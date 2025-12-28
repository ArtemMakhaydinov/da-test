import { Request, Response } from 'express';
import logger from '../config/logger.confg';
import { checkIfFileExists, getFileReadStream } from '../services/fs.service';
import {
  handleFileDelete,
  handleFileUpdate,
  handleFileUpload,
} from '../services/file-handler.service';
import { countFiles, getFileById, getFilesPagination } from '../services/file.service';
import { numerifyBigint } from '../utils/numerify-bigint.util';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const filename = req.headers['x-filename'] as string;
    if (!filename || typeof filename !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Filename is required',
      });
      return;
    }

    const isExists = await checkIfFileExists(filename);
    if (isExists) {
      res.status(400).json({
        success: false,
        message: 'File already exists',
      });
      return;
    }

    const record = await handleFileUpload(req, filename);
    res.status(200).json({
      success: true,
      data: numerifyBigint(record),
    });
  } catch (error) {
    logger.error('Error handling file upload request', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error instanceof Error
            ? error.message
            : 'Unknown error',
    });
  }
};

export const listFiles = async (
  req: Request<unknown, unknown, { page?: number; limit?: number }>,
  res: Response,
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const files = await getFilesPagination(Number(page), Number(limit));
    const count = await countFiles();
    res.status(200).json({
      success: true,
      data: numerifyBigint(files),
      hasNext: count > Number(page) * Number(limit),
    });
  } catch (error) {
    logger.error('Error listing files', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list files',
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error instanceof Error
            ? error.message
            : 'Unknown error',
    });
  }
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = await getFileById(Number(id));
    if (!file) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: numerifyBigint(file),
    });
  } catch (error) {
    logger.error('Error getting file', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file',
    });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const record = await getFileById(Number(id));
    if (!record) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'File id is required',
      });
      return;
    }

    await handleFileDelete(Number(id));
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting file', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
    });
  }
};

export const updateFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'File id is required',
      });
      return;
    }

    const filename = req.headers['x-filename'] as string;
    const record = await getFileById(Number(id));
    if (!filename && !record) {
      res.status(404).json({
        success: false,
        message: 'File not found. Provide a new filename or upload file',
      });
      return;
    }

    const file = await handleFileUpdate(req, Number(id), record?.name ?? filename);
    res.status(200).json({
      success: true,
      data: numerifyBigint(file),
    });
  } catch (error) {
    logger.error('Error updating file', error);
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'File id is required',
      });
      return;
    }

    const record = await getFileById(Number(id));
    const isExists = await checkIfFileExists(record?.name ?? '');
    if (!record || !isExists) {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
      return;
    }

    res.status(200).set({
      'Content-Disposition': `attachment; filename="${record.name}"`,
      'Content-Type': record.mimeType,
      'Content-Length': record.sizeBytes.toString(),
    });
    const readStream = await getFileReadStream(record.name);
    readStream.pipe(res);
  } catch (error) {
    logger.error('Error downloading file', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
    });
  }
};
