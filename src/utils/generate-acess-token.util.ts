import * as jwt from 'jsonwebtoken';
import { getEnv } from './get-env.util';

export const generateAccessToken = async (
  userId: number,
  jwtRefreshId: number,
): Promise<string> => {
  const expiresIn = Number(getEnv('JWT_EXPIRES_IN_SEC'));
  const secret = getEnv('JWT_SECRET');
  return jwt.sign({ jwtRefreshId }, secret, {
    subject: userId.toString(),
    expiresIn,
  });
};
