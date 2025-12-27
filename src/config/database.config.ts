import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { getEnv } from '../utils/get-env.util';

const adapter = new PrismaMariaDb({
  host: getEnv('DATABASE_HOST'),
  port: Number(getEnv('DATABASE_PORT')),
  user: getEnv('DATABASE_USER'),
  password: getEnv('DATABASE_PASSWORD', { isOptional: true }),
  database: getEnv('DATABASE_NAME'),
  connectionLimit: 5,
});

const prisma: PrismaClient = new PrismaClient({ adapter });

export default prisma;
