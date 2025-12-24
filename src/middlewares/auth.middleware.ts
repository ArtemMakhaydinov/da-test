import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import logger from '../config/logger.confg';
import { JwtRefresh, User } from '@prisma/client';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate(
    'jwt',
    { session: false },
    (
      err: Error | null,
      user: User | null,
      info: {
        jwtRefresh?: JwtRefresh | null;
        expiresAt?: number;
      },
    ) => {
      if (err) {
        logger.error('Authentication error', {
          error: err.message,
          url: req.originalUrl,
          ip: req.ip,
        });
        res.status(500).json({ error: 'Authentication failed' });
        return;
      }

      if (!user) {
        logger.warn('Authentication attempt failed. User not found.', {
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
        });
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!info?.jwtRefresh) {
        logger.warn('Authentication attempt failed. JwtRefresh not found.', {
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
        });
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (info?.expiresAt && info.expiresAt < Date.now() / 1000) {
        logger.warn('Authentication attempt failed. Token expired.', {
          expiresAt: info.expiresAt,
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
        });
        res.status(401).json({ error: 'Token expired' });
        return;
      }

      req.user = user;
      req.jwtRefreshId = Number(info.jwtRefresh.id);
      next();
    },
  )(req, res, next);
};
