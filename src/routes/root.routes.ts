import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
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

export default router;
