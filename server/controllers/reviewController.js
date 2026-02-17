import Review from '../models/Review.js';
import Business from '../models/Business.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export async function updateBusinessAvgRating(businessId) {
  const agg = await Review.aggregate([
    { $match: { business: businessId, approved: true } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);
  const avgRating = agg[0]?.avg ?? 0;
  await Business.findByIdAndUpdate(businessId, { avgRating: Math.round(avgRating * 10) / 10 });
}

export async function listByBusiness(req, res) {
  try {
    const { businessId } = req.params;
    const filter = { business: businessId };
    if (req.user) {
      filter.$or = [{ approved: true }, { user: req.user.id }];
    } else {
      filter.approved = true;
    }
    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const { businessId, rating, comment } = req.body;
    if (!businessId || rating == null) {
      return res.status(400).json({ error: 'Business and rating required' });
    }
    const numRating = Math.min(5, Math.max(1, Number(rating)));
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    if (!business.approved) return res.status(400).json({ error: 'Business not approved yet' });

    const photos = [];
    for (const file of req.files || []) {
      const result = await uploadToCloudinary(file.buffer, 'review-platform/reviews');
      photos.push(result.secure_url);
    }

    let review = await Review.findOne({ business: businessId, user: req.user.id });
    if (review) {
      review.rating = numRating;
      review.comment = comment || '';
      review.photos = photos;
      review.approved = false;
      await review.save();
    } else {
      review = await Review.create({
        business: businessId,
        user: req.user.id,
        rating: numRating,
        comment: comment || '',
        photos,
        approved: false
      });
    }
    const populated = await Review.findById(review._id).populate('user', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function myReviews(req, res) {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('business', 'name photo location category avgRating approved')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
