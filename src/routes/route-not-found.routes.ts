import { Request, Response, NextFunction } from 'express';

export const routeNotFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    error: 'Route not found',
  });
};
