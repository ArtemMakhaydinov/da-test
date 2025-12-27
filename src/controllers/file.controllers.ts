import { Request, Response } from 'express';
import logger from '../config/logger.confg';
import { checkIfFileExists } from '../utils/upload-file.util';
import { handleFileUpload } from '../services/file-handler.service';

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

    const record = await handleFileUpload(req, res);
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename,
      fileId: Number(record.id),
      path: `/uploads/${filename}`,
      sizeBytes: Number(record.sizeBytes),
      mimeType: record.mimeType,
      extension: record.extension,
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
