import { Router } from 'express';
import { info, logout, refreshToken, signin, signup } from '../controllers/auth.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/signin/refresh_token', refreshToken);
router.post('/signin', signin);

router.use(authenticateToken);

router.get('/info', info);
router.get('/logout', logout);

export default router;
