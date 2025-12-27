import { User as PrismaUser } from '../../generated/prisma/client';

export declare global {
  namespace Express {
    interface User extends PrismaUser {}
    interface Request {
      jwtRefreshId: number | undefined;
    }
  }
}

export {};
