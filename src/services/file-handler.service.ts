import { fileTypeStream } from 'file-type';
import { deleteFile, saveFile } from './fs.service';
import { deleteFileById, saveFileData, updateOrCreateFile } from './file.service';
import { File } from '../../generated/prisma/client';
import logger from '../config/logger.confg';
import { Readable } from 'node:stream';

export const handleFileUpload = async (uploadStream: Readable, filename: string): Promise<File> => {
  try {
    const streamFileType = await fileTypeStream(uploadStream);
    const stats = await saveFile(streamFileType, filename);
    const record = await saveFileData(
      filename,
      streamFileType.fileType?.ext ?? '',
      stats.size,
      streamFileType.fileType?.mime ?? '',
    );
    return record;
  } catch (error) {
    logger.error('Error handling file upload', error);
    throw error;
  }
};

export const handleFileDelete = async (fileId: number): Promise<void> => {
  try {
    const record = await deleteFileById(fileId);
    if (record) {
      await deleteFile(record.name);
    }
  } catch (error) {
    logger.error('Error handling file delete', error);
    throw error;
  }
};

export const handleFileUpdate = async (
  uploadStream: Readable,
  fileId: number,
  filename: string,
): Promise<File> => {
  try {
    await deleteFile(filename);
    const streamFileType = await fileTypeStream(uploadStream);
    const stats = await saveFile(streamFileType, filename);
    const record = await updateOrCreateFile(
      fileId,
      filename,
      streamFileType.fileType?.ext ?? '',
      stats.size,
      streamFileType.fileType?.mime ?? '',
    );
    return record;
  } catch (error) {
    logger.error('Error handling file update', error);
    throw error;
  }
};
