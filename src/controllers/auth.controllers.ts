import { createUser, getUserByLogin } from '../services/user.service';
import { Request, Response } from 'express';
import logger from '../config/logger.confg';
import { verifyPassword } from '../utils/password-encryptor.util';
import { generateAccessToken } from '../utils/generate-acess-token.util';
import {
  createJwtRefresh,
  deleteJwtRefreshById,
  deleteJwtRefreshByToken,
} from '../services/jwt-refresh.service';

export const signup = async (
  req: Request<unknown, unknown, { login: string; password: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      res.status(400).json({ error: 'Login and password are required' });
      return;
    }

    const existingUser = await getUserByLogin(login);
    if (existingUser) {
      res.status(400).json({ error: 'User with this login already exists' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const user = await createUser(login, password);
    res.status(201).json({
      message: 'User created successfully',
      user: { id: Number(user.id), login: user.login },
    });
  } catch (error) {
    logger.error('Registration error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      login: req.body.login,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signin = async (
  req: Request<unknown, unknown, { login: string; password: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await getUserByLogin(login);
    if (!user) {
      res.status(401).json({ error: 'Invalid login or password' });
      return;
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const jwtRefresh = await createJwtRefresh(Number(user.id));
    const accessToken = await generateAccessToken(Number(user.id), Number(jwtRefresh.id));
    logger.info('User logged in successfully', { userId: user.id, login });
    res.json({
      message: 'Login successful',
      user: {
        id: Number(user.id),
        login: user.login,
      },
      accessToken: accessToken,
      refreshToken: jwtRefresh.token,
    });
  } catch (error) {
    logger.error('Login error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (
  req: Request<unknown, unknown, { refreshToken: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    const deletedJwtRefresh = await deleteJwtRefreshByToken(req.body.refreshToken);
    if (!deletedJwtRefresh) {
      res.status(400).json({ error: 'Invalid refresh token' });
      return;
    }

    const jwtRefresh = await createJwtRefresh(Number(deletedJwtRefresh.userId));
    const accessToken = await generateAccessToken(
      Number(deletedJwtRefresh.userId),
      Number(jwtRefresh.id),
    );
    res.json({
      accessToken: accessToken,
      refreshToken: jwtRefresh.token,
    });
  } catch (error) {
    logger.error('Refresh token error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.jwtRefreshId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await deleteJwtRefreshById(req.jwtRefreshId);
    res.status(200).json({ message: 'Logged out successfully' });
    return;
  } catch (error) {
    logger.error('Logout error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};

export const info = async (req: Request, res: Response): Promise<void> => {
  res.json({
    user: {
      id: Number(req.user?.id),
    },
  });
};
