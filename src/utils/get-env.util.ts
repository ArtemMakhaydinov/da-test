import logger from '../config/logger.confg';

export const getEnv = (key: string, options?: { isOptional?: boolean }): string | undefined => {
  const value = process.env[key];
  if (!value) {
    logger.error('Environment variable is not set', { key, ...(options || {}) });
    if (!options?.isOptional) throw new Error('Server configuration error');
  }

  return value;
};
