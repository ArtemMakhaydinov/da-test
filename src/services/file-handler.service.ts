import { fileTypeStream } from 'file-type';
import { Request, Response } from 'express';
import { saveFile } from '../utils/upload-file.util';
import { saveFileData } from './file.service';
import { File } from '../../generated/prisma/client';
import logger from '../config/logger.confg';

export const handleFileUpload = async (req: Request, _res: Response): Promise<File> => {
  try {
    const filename = req.headers['x-filename'] as string;
    const streamFileType = await fileTypeStream(req);
    const streamUploadStats = await saveFile(streamFileType, filename);
    const record = await saveFileData(
      filename,
      streamFileType.fileType?.ext ?? '',
      streamUploadStats.size,
      streamFileType.fileType?.mime ?? '',
    );
    return record;
  } catch (error) {
    logger.error('Error handling file upload', error);
    throw error;
  }
};
