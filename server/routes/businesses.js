import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../auth.js';
import * as businessController from '../controllers/businessController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', businessController.list);
router.get('/my/list', requireAuth, requireRole('business'), businessController.myList);
router.get('/:id', businessController.getOne);
router.post('/', requireAuth, requireRole('business'), upload.single('photo'), businessController.create);

export default router;
