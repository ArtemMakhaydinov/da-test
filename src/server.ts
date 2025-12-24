import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from './config/logger.confg';
import './config/passport.config';
import rootRoutes from './routes/root.routes';
import authRoutes from './routes/auth.routes';
import { logRequest } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { routeNotFound } from './routes/route-not-found.routes';
import prisma from './config/database.config';

const bootstrap = async (): Promise<void> => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(logRequest);

  app.use(rootRoutes);
  app.use('/api', authRoutes);

  app.use(errorHandler);
  app.use(routeNotFound);

  const PORT = process.env.PORT || 3000;
  await prisma
    .$connect()
    .then(() => {
      logger.info('Database connected');
    })
    .catch((error) => {
      logger.error('Database connection error:', error);
    });

  app.listen(PORT, (): void => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

bootstrap();
