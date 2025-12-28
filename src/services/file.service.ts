import { File, Prisma } from '../../generated/prisma/client';
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

export const countFiles = async (): Promise<number> => {
  try {
    logger.info('Counting files');
    const count = await prisma.file.count();
    logger.info('Completed counting files', { count });
    return count;
  } catch (error) {
    logger.error('Error counting files', error);
    throw error;
  }
};

export const getFilesPagination = async (page: number, limit: number): Promise<File[]> => {
  try {
    logger.info('Getting files with pagination', { page, limit });
    const records = await prisma.file.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
    });
    logger.info('Completed getting files with pagination', { records });
    return records;
  } catch (error) {
    logger.error('Error getting files with pagination', error);
    throw error;
  }
};

export const getFileById = async (id: number): Promise<File | null> => {
  try {
    logger.info('Getting file by id', { id });
    const record = await prisma.file.findUnique({ where: { id } });
    logger.info('Completed getting file by id', { record });
    return record;
  } catch (error) {
    logger.error('Error getting file by id', error);
    throw error;
  }
};

export const deleteFileById = async (id: number): Promise<File | null> => {
  try {
    logger.info('Deleting file by id', { id });
    const record = await prisma.file.delete({ where: { id } });
    logger.info('Completed deleting file by id', { record });
    return record;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      logger.warn('Error deleting file by id. File not found', { id });
      return null;
    }

    logger.error('Error deleting file by id', error);
    throw error;
  }
};

export const updateOrCreateFile = async (
  id: number,
  name: string,
  extension: string,
  sizeBytes: bigint | number,
  mimeType: string,
): Promise<File> => {
  try {
    logger.info('Updating or creating file', { id, name, extension, sizeBytes, mimeType });
    const record = await prisma.file.upsert({
      where: { id },
      update: { name, extension, sizeBytes, mimeType },
      create: { name, extension, sizeBytes, mimeType },
    });
    logger.info('Completed updating or creating file', { record });
    return record;
  } catch (error) {
    logger.error('Error updating or creating file', error);
    throw error;
  }
};
