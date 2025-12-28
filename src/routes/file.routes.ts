import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  deleteFile,
  downloadFile,
  getFile,
  listFiles,
  updateFile,
  uploadFile,
} from '../controllers/file.controllers';

const router = Router();

router.use(authenticateToken);

router.post('/upload', uploadFile);
router.get('/list', listFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);
router.put('/update/:id', updateFile);
router.get('/download/:id', downloadFile);

export default router;
