import logger from '../config/logger.confg';

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    logger.error(`${key} is not set`);
    throw new Error('Server configuration error');
  }

  return value;
};
