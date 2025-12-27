import { Router } from 'express';
// import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadFile } from '../controllers/file.controllers';

const router = Router();

// router.use(authenticateToken);

router.post('/upload', uploadFile);

export default router;
