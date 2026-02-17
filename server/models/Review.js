import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true },

  business: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true },
    rating: { type: Number, 
    required: true, 
    min: 1, 
    max: 5 },

  comment: { 
    type: String,
    default: ''
  },
  photos: [{ 
    type: String
   }],
  approved: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ business: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
