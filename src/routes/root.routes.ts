import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  res.json({
    message: 'Express API with JWT Authentication',
    endpoints: {
      auth: {
        signup: {
          method: 'POST',
          path: '/api/auth/signup',
          description: 'Register a new user',
          body: { login: 'string', password: 'string' },
          protected: false,
        },
        signin: {
          method: 'POST',
          path: '/api/auth/signin',
          description: 'Login user and get access/refresh tokens',
          body: { login: 'string', password: 'string' },
          protected: false,
        },
        refreshToken: {
          method: 'POST',
          path: '/api/auth/signin/refresh_token',
          description: 'Refresh access token using refresh token',
          body: { refreshToken: 'string' },
          protected: false,
        },
        info: {
          method: 'GET',
          path: '/api/auth/info',
          description: 'Get current user information',
          protected: true,
        },
        logout: {
          method: 'GET',
          path: '/api/auth/logout',
          description: 'Logout user and invalidate refresh token',
          protected: true,
        },
      },
      files: {
        upload: {
          method: 'POST',
          path: '/api/file/upload',
          description: 'Upload a new file',
          headers: { 'x-filename': 'string' },
          body: 'file stream',
          protected: true,
        },
        list: {
          method: 'GET',
          path: '/api/file/list',
          description: 'List files with pagination',
          query: { page: 'number (optional, default: 1)', limit: 'number (optional, default: 10)' },
          protected: true,
        },
        get: {
          method: 'GET',
          path: '/api/file/:id',
          description: 'Get file metadata by ID',
          params: { id: 'number' },
          protected: true,
        },
        delete: {
          method: 'DELETE',
          path: '/api/file/:id',
          description: 'Delete a file by ID',
          params: { id: 'number' },
          protected: true,
        },
        update: {
          method: 'PUT',
          path: '/api/file/update/:id',
          description: 'Update a file by ID',
          headers: { 'x-filename': 'string (optional)' },
          body: 'file stream (optional)',
          params: { id: 'number' },
          protected: true,
        },
        download: {
          method: 'GET',
          path: '/api/file/download/:id',
          description: 'Download a file by ID',
          params: { id: 'number' },
          protected: true,
        },
      },
    },
  });
});

export default router;
