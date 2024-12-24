import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
    },
    date: {
      type: Date,
    },
    categories: {
      type: [String],
      enum: [
        "Market Analysis",
        "Investment",
        "Buying Guide",
        "Residential",
        "Commercial",
        "Legal",
        "Home Improvement",
        "Technology",
      ],
    },
    featured: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
