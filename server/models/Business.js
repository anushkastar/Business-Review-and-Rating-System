import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: null },
  location: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approved: { type: Boolean, default: false },
  avgRating: { type: Number, default: 0, min: 0, max: 5 }
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
