import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../auth.js';
import * as reviewController from '../controllers/reviewController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/business/:businessId', reviewController.listByBusiness);
router.post('/', requireAuth, requireRole('user'), upload.array('photos', 5), reviewController.create);
router.get('/my', requireAuth, requireRole('user'), reviewController.myReviews);

export { updateBusinessAvgRating } from '../controllers/reviewController.js';
export default router;
