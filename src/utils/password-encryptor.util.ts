import * as crypto from 'node:crypto';
import logger from '../config/logger.confg';
import { getEnv } from './get-env.util';

export const encryptPassword = (password: string): Uint8Array<ArrayBuffer> | null => {
  try {
    const secret = getEnv('JWT_SECRET');
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(secret, salt, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = cipher.update(password);
    return Uint8Array.from(Buffer.concat([salt, iv, encrypted, cipher.final()]));
  } catch (error) {
    logger.error('Error encrypting password', { error });
    return null;
  }
};

export const decryptPassword = (encryptedPassword: Uint8Array<ArrayBuffer>): string => {
  try {
    const secret = getEnv('JWT_SECRET');
    const salt = encryptedPassword.subarray(0, 16);
    const iv = encryptedPassword.subarray(16, 32);
    const encryptedData = encryptedPassword.subarray(32);
    const key = crypto.scryptSync(secret, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = decipher.update(encryptedData);
    return Buffer.concat([decrypted, decipher.final()]).toString();
  } catch (error) {
    logger.error('Error decrypting password', { error });
    return '';
  }
};

export const verifyPassword = (
  password: string,
  encryptedPassword: Uint8Array<ArrayBuffer>,
): boolean => {
  const decryptedPassword = decryptPassword(encryptedPassword);
  return password === decryptedPassword;
};
