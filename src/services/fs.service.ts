import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import logger from '../config/logger.confg';

export const saveFile = async (uploadStream: Readable, fileName: string): Promise<fs.Stats> => {
  logger.info(`Uploading file: ${fileName}`);
  const uploadsDir = await getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);
  const writeStream = fs.createWriteStream(filePath);
  uploadStream.pipe(writeStream);
  return new Promise((resolve, reject) => {
    writeStream.on('finish', async () => {
      const stats = await fs.promises.stat(filePath);
      logger.info('File uploaded successfully', {
        fileName,
        filePath,
        size: stats.size,
      });
      resolve(stats);
    });
    writeStream.on('error', (error) => {
      logger.error(`Error uploading file: ${fileName}`, error);
      reject(error);
    });
  });
};

export const getFileReadStream = async (fileName: string): Promise<fs.ReadStream> => {
  const uploadsDir = await getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);
  return fs.createReadStream(filePath);
};

export const checkIfFileExists = async (fileName: string): Promise<boolean> => {
  if (!fileName) {
    return false;
  }

  const uploadsDir = await getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);
  return fs.existsSync(filePath);
};

export const deleteFile = async (fileName: string): Promise<void> => {
  logger.info('Deleting file from file system', { fileName });
  const uploadsDir = await getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);
  await fs.promises.unlink(filePath).catch((err) => {
    if (err.code === 'ENOENT') {
      logger.warn('Cant delete file. File not found', { fileName });
      return;
    }

    logger.error('Error deleting file', err);
    throw err;
  });
  logger.info('File deleted from file system', { fileName });
};

const getUploadsDir = async (): Promise<string> => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    await fs.promises.mkdir(uploadsDir, { recursive: true });
  }

  return uploadsDir;
};
