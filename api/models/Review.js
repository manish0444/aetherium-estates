import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  }
}, { 
  timestamps: true 
});

// Prevent duplicate reviews from the same user for the same agent
reviewSchema.index({ user: 1, agent: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;