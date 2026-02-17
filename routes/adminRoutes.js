import { Router } from 'express';


import { getDashboardCountsHelper, getBusinessesHelper, approveBusinessHelper, rejectBusinessHelper, getPendingReviewsHelper, approveReviewHelper, rejectReviewHelper, getBusinessReviewsHelper } from '../controllers/adminController.js';

const router = Router();

// Dashboard counts
router.get('/dashboard', async (req, res) => {
  try {
    const [businesses, approvedBusinesses, pendingBusinesses, reviews, pendingReviews, users] = await Promise.all([
      Business.countDocuments(),
      Business.countDocuments({ approved: true }),
      Business.countDocuments({ approved: false }),
      Review.countDocuments(),
      Review.countDocuments({ approved: false }),
      User.countDocuments()
    ]);
    res.json({
      businesses,
      approvedBusinesses,
      pendingBusinesses,
      reviews,
      pendingReviews,
      users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/businesses', getBusinessesHelper);

router.patch('/businesses/:id/approve', approveBusinessHelper);

router.patch('/businesses/:id/reject', rejectBusinessHelper);

// List pending reviews (all, with business info)
router.get('/reviews/pending', getPendingReviewsHelper );

router.patch('/reviews/:id/approve', approveReviewHelper);

router.patch('/reviews/:id/reject', rejectReviewHelper);

router.get('/businesses/:id/reviews', getBusinessReviewsHelper);

export default router;