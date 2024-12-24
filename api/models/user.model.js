import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'manager', 'admin'],
      default: 'user'
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    }],
    languages: {
      type: [String],
      default: []
    },
    certifications: {
      type: [String],
      default: []
    },
    specialization: {
      type: String,
      default: ''
    },
    experience: {
      type: Number,
      default: 0
    },
    bio: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
