import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.confg';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status((err as any).status || 500).json({
    error: err.message || 'Internal server error',
  });
};
