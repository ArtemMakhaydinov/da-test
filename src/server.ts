import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from './config/logger';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
    });
  });

  next();
});

// Routes
app.get('/', (_req: Request, res: Response): void => {
  res.json({
    message: 'Express API with JWT Authentication',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)',
      },
      protected: {
        profile: 'GET /api/protected/profile',
        data: 'GET /api/protected/data',
      },
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status((err as any).status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, (): void => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

