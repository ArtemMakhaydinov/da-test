import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import logger from '../config/logger.confg';

export const saveFile = async (downloadStream: Readable, fileName: string): Promise<fs.Stats> => {
  logger.info(`Uploading file: ${fileName}`);
  const uploadsDir = await getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);
  const writeStream = fs.createWriteStream(filePath);
  downloadStream.pipe(writeStream);
  return new Promise((resolve, reject) => {
    writeStream.on('finish', async () => {
      const stats = await fs.promises.stat(filePath);
      logger.info(`File uploaded successfully: ${fileName}`, {
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

export const checkIfFileExists = async (fileName: string): Promise<boolean> => {
  const uploadsDir = await getUploadsDir();
  const filePath = path.join(uploadsDir, fileName);
  return fs.existsSync(filePath);
};

const getUploadsDir = async (): Promise<string> => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    await fs.promises.mkdir(uploadsDir, { recursive: true });
  }

  return uploadsDir;
};
