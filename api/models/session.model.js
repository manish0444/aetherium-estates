import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  unverifiedUser: {
    username: String,
    email: {
      type: String,
      required: true,
      index: true
    },
    password: String,
    verificationToken: {
      type: String,
      required: true
    },
    verificationTokenExpiresAt: {
      type: Date,
      required: true,
      index: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Automatically delete documents after 10 minutes
  }
});

// Create compound index for faster lookups
sessionSchema.index({ '_id': 1, 'unverifiedUser.email': 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session; 