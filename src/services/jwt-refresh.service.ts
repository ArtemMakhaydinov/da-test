import { JwtRefresh } from '@prisma/client';
import prisma from '../config/database.config';
import logger from '../config/logger.confg';

export const createJwtRefresh = async (userId: number): Promise<JwtRefresh> => {
  try {
    logger.info('Creating JwtRefresh record', { userId });
    const record = await prisma.jwtRefresh.create({
      data: {
        userId,
      },
    });
    logger.info('Complete creating JwtRefresh record', { record });
    return record;
  } catch (error) {
    logger.error('Error creating JwtRefresh record', error);
    throw error;
  }
};

export const getJwtRefreshById = async (id: number): Promise<JwtRefresh | null> => {
  try {
    logger.info('Getting JwtRefresh record by id', { id });
    const record = await prisma.jwtRefresh.findUnique({
      where: { id },
    });
    logger.info('Complete getting JwtRefresh record by id', { record });
    return record;
  } catch (error) {
    logger.error('Error getting JwtRefresh record by id', error);
    throw error;
  }
};

export const getJwtRefreshByToken = async (token: string): Promise<JwtRefresh | null> => {
  try {
    logger.info('Getting JwtRefresh record by token', { token });
    const record = await prisma.jwtRefresh.findUnique({
      where: { token },
    });
    logger.info('Complete getting JwtRefresh record by token', { record });
    return record;
  } catch (error) {
    logger.error('Error getting JwtRefresh record by token', error);
    throw error;
  }
};

export const deleteJwtRefreshByToken = async (token: string): Promise<JwtRefresh | null> => {
  try {
    logger.info('Deleting JwtRefresh record by token', { token });
    const record = await prisma.jwtRefresh.delete({
      where: { token },
    });
    logger.info('Complete deleting JwtRefresh record by token', { record });
    return record;
  } catch (error) {
    logger.error('Error deleting JwtRefresh record by token', error);
    throw error;
  }
};

export const deleteJwtRefreshById = async (id: number): Promise<JwtRefresh | null> => {
  try {
    logger.info('Deleting JwtRefresh record by id', { id });
    const record = await prisma.jwtRefresh.delete({
      where: { id },
    });
    logger.info('Complete deleting JwtRefresh record by id', { record });
    return record;
  } catch (error) {
    logger.error('Error deleting JwtRefresh record by id', error);
    throw error;
  }
};
