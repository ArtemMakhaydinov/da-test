import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import logger from '../config/logger';

interface JwtPayload {
  userId: number;
  email: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Authentication attempt without token', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
      });
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not defined');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Optionally fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      logger.warn('Authentication attempt with invalid user', {
        userId: decoded.userId,
        url: req.originalUrl,
      });
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token', {
        error: error.message,
        url: req.originalUrl,
        ip: req.ip,
      });
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Expired JWT token', {
        url: req.originalUrl,
        ip: req.ip,
      });
      res.status(403).json({ error: 'Token expired' });
      return;
    }
    logger.error('Authentication error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: req.originalUrl,
    });
    res.status(500).json({ error: 'Authentication failed' });
  }
};

