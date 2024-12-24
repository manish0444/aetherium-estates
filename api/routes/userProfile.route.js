import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import { Listing } from '../models/listing.model.js';

const router = express.Router();

// Get user profile data
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user stats
router.get('/user/stats/:id', async (req, res) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    const totalListings = listings.length;
    const listingsViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const likes = listings.reduce((acc, curr) => acc + (curr.favorites?.length || 0), 0);
    
    res.json({
      totalListings,
      listingsViews,
      likes,
      rating: 0 // Implement your rating logic here
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user comments
router.get('/user/comments/:id', async (req, res) => {
  try {
    const comments = await Comment.find({ userId: req.params.id })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 });
    
    const formattedComments = comments.map(comment => ({
      id: comment._id,
      author: comment.authorId.username,
      text: comment.text,
      date: comment.createdAt.toLocaleDateString(),
      authorId: comment.authorId._id
    }));
    
    res.json(formattedComments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add comment
router.post('/user/comment', verifyToken, async (req, res) => {
  try {
    const { userId, authorId, text } = req.body;
    
    const newComment = new Comment({
      userId,
      authorId,
      text,
      createdAt: new Date()
    });
    
    await newComment.save();
    
    res.json({ 
      success: true, 
      commentId: newComment._id 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;