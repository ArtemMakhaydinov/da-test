import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes in this file require authentication
router.use(authenticateToken);

// Example protected route
router.get('/profile', (req: Request, res: Response): void => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Another example protected route
router.get('/data', (req: Request, res: Response): void => {
  res.json({
    message: 'Protected data endpoint',
    data: {
      userId: req.user?.id,
      userEmail: req.user?.email,
      secretInfo: 'This is only accessible with a valid JWT token',
    },
  });
});

export default router;

