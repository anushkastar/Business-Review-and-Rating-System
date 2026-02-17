import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.get('/dashboard', adminController.dashboard);
router.get('/businesses', adminController.listBusinesses);
router.patch('/businesses/:id/approve', adminController.approveBusiness);
router.patch('/businesses/:id/reject', adminController.rejectBusiness);
router.get('/reviews/pending', adminController.pendingReviews);
router.patch('/reviews/:id/approve', adminController.approveReview);
router.patch('/reviews/:id/reject', adminController.rejectReview);
router.get('/businesses/:id/reviews', adminController.businessReviews);

export default router;
