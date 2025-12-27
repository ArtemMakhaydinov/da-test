import { File } from '../../generated/prisma/client';
import logger from '../config/logger.confg';
import prisma from '../config/database.config';

export const saveFileData = async (
  name: string,
  extension: string,
  sizeBytes: bigint | number,
  mimeType: string,
): Promise<File> => {
  try {
    logger.info('Saving file data', { name, extension, sizeBytes, mimeType });
    const record = await prisma.file.create({
      data: {
        name,
        extension,
        sizeBytes,
        mimeType,
      },
    });
    logger.info('File data saved', { record });
    return record;
  } catch (error) {
    logger.error('Error saving file data', error);
    throw error;
  }
};
