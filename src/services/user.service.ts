import { User } from '@prisma/client';
import prisma from '../config/database.config';
import logger from '../config/logger.confg';
import { encryptPassword } from '../utils/password-encryptor.util';

export const createUser = async (login: string, password: string): Promise<User> => {
  const encryptedPassword = encryptPassword(password);
  if (!encryptedPassword) {
    throw new Error('Error encrypting password');
  }

  logger.info('Creating user', { login, password });
  try {
    const user = await prisma.user.create({
      data: {
        login,
        password: encryptedPassword,
      },
    });
    logger.info('Complete creating user', { user });
    return user;
  } catch (error) {
    logger.error('Error creating user', error);
    throw error;
  }
};

export const getUserByLogin = async (login: string): Promise<User | null> => {
  logger.info('Getting user by login', { login });
  try {
    const user = await prisma.user.findUnique({
      where: { login },
    });
    logger.info('Complete getting user by login', { user });
    return user;
  } catch (error) {
    logger.error('Error getting user by login', error);
    throw error;
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  logger.info('Getting user by id', { id });
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    logger.info('Complete getting user by id', { user });
    return user;
  } catch (error) {
    logger.error('Error getting user by id', error);
    throw error;
  }
};
