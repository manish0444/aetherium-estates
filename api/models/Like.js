import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

// Prevent duplicate likes from the same user for the same agent
likeSchema.index({ user: 1, agent: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;