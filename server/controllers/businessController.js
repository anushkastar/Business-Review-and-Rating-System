import Business from '../models/Business.js';
import Review from '../models/Review.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export async function list(req, res) {
  try {
    const { category, location, sort = 'rating' } = req.query;
    const filter = { approved: true };
    if (category) filter.category = category.trim();
    if (location) filter.location = location.trim();

    let query = Business.find(filter).populate('owner', 'name').lean();
    if (sort === 'rating') query = query.sort({ avgRating: -1, name: 1 });
    if (sort === 'reviews') {
      const withCount = await Business.aggregate([
        { $match: filter },
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'business', as: 'reviews' } },
        { $addFields: { approvedReviews: { $size: { $filter: { input: '$reviews', as: 'r', cond: { $eq: ['$$r.approved', true] } } } } } },
        { $sort: { approvedReviews: -1, avgRating: -1 } },
        { $project: { reviews: 0 } }
      ]);
      const ids = withCount.map(b => b._id);
      const ordered = await Business.find({ _id: { $in: ids } }).populate('owner', 'name').lean();
      const orderMap = ids.reduce((acc, id, i) => { acc[id.toString()] = i; return acc; }, {});
      ordered.sort((a, b) => orderMap[a._id.toString()] - orderMap[b._id.toString()]);
      return res.json(ordered);
    }
    const list = await query;
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name email').lean();
    if (!business) return res.status(404).json({ error: 'Business not found' });
    if (!business.approved && (!req.user || (req.user.role !== 'admin' && business.owner?._id?.toString() !== req.user.id))) {
      return res.status(404).json({ error: 'Business not found' });
    }
    const reviewCount = await Review.countDocuments({ business: business._id, approved: true });
    res.json({ ...business, reviewCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const { name, location, category, description } = req.body;
    if (!name || !location || !category) {
      return res.status(400).json({ error: 'Name, location and category required' });
    }
    let photo = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'review-platform/businesses');
      photo = result.secure_url;
    }
    const business = await Business.create({
      name,
      photo,
      location,
      category,
      description: description || '',
      owner: req.user.id,
      approved: false
    });
    const populated = await Business.findById(business._id).populate('owner', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function myList(req, res) {
  try {
    const list = await Business.find({ owner: req.user.id }).populate('owner', 'name').lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
