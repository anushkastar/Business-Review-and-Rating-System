import Business from '../models/Business.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { updateBusinessAvgRating } from './reviewController.js';

export async function dashboard(req, res) {
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
}

export async function listBusinesses(req, res) {
  try {
    const list = await Business.find().populate('owner', 'name email').sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function approveBusiness(req, res) {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).populate('owner', 'name');
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function rejectBusiness(req, res) {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function pendingReviews(req, res) {
  try {
    const list = await Review.find({ approved: false })
      .populate('user', 'name email')
      .populate('business', 'name location category')
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function approveReview(req, res) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).populate('user', 'name').populate('business', 'name');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    await updateBusinessAvgRating(review.business._id);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function rejectReview(req, res) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    ).populate('user', 'name');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    const bizId = review.business?._id || review.business;
    if (bizId) await updateBusinessAvgRating(bizId);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function businessReviews(req, res) {
  try {
    const reviews = await Review.find({ business: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
