import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import Review from '../models/Review.js';
import Like from '../models/Like.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import AdminAction from '../models/adminAction.model.js';

// Export all functions
export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    if (req.user.id !== user._id.toString() && req.user.role !== 'admin') {
      return next(errorHandler(403, 'You can only update your own account'));
    }

    // Handle password update
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Handle arrays properly
    if (req.body.languages) {
      req.body.languages = Array.isArray(req.body.languages) 
        ? req.body.languages 
        : req.body.languages.split(',').map(lang => lang.trim());
    }

    if (req.body.certifications) {
      req.body.certifications = Array.isArray(req.body.certifications)
        ? req.body.certifications
        : req.body.certifications.split(',').map(cert => cert.trim());
    }

    // Remove empty fields
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v != null && v !== '')
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  // ... existing code
};

export const getUserListings = async (req, res, next) => {
  try {
    console.log('Fetching listings for user:', req.params.id);
    
    if (!req.params.id) {
      return next(errorHandler(400, 'User ID is required'));
    }

    const listings = await Listing.find({ userRef: req.params.id });
    console.log('Found listings:', listings.length);
    
    res.json(listings);
  } catch (error) {
    console.error('Error in getUserListings:', error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    // Include role-specific data
    let userData = { ...user._doc };
    delete userData.password;

    // Add role-specific data
    if (userData.role === 'admin') {
      const adminStats = {
        totalManaged: await Listing.countDocuments({ adminRef: user._id }),
        recentActivity: await AdminAction.find({ adminId: user._id })
          .sort('-createdAt')
          .limit(5)
          .lean()
      };
      userData.adminStats = adminStats;
    }

    // Add general user stats
    const listings = await Listing.find({ userRef: user._id });
    userData.stats = {
      totalListings: listings.length,
      views: listings.reduce((sum, listing) => sum + (listing.views || 0), 0),
      role: userData.role
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error in getUser:', error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  // ... existing code
};

const MAX_USER_LISTINGS = 3;

export const getUserListingsCount = async (req, res) => {
  try {
    // Get all listings ever created by the user (including deleted)
    const allListings = await Listing.find({
      userRef: req.params.id,
    });

    // Count total listings (including deleted)
    const totalListingsEverCreated = allListings.length;

    // Count active listings
    const activeListings = allListings.filter(listing => !listing.deleted).length;

    // Calculate remaining listings
    const remainingListings = Math.max(0, MAX_USER_LISTINGS - totalListingsEverCreated);

    // Check if user has reached limit
    const hasReachedLimit = totalListingsEverCreated >= MAX_USER_LISTINGS;

    res.json({ 
      success: true, 
      totalCount: totalListingsEverCreated,
      activeCount: activeListings,
      remainingListings,
      hasReachedLimit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAgents = async (req, res, next) => {
  try {
    console.log('Fetching agents...');
    const agents = await User.find({ role: 'agent' })
      .select('-password')
      .lean();

    console.log('Found agents:', agents.length);

    const agentsWithStats = await Promise.all(agents.map(async (agent) => {
      const reviews = await Review.find({ agent: agent._id });
      const likes = await Like.countDocuments({ agent: agent._id });
      const listings = await Listing.countDocuments({ userRef: agent._id });
      
      const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

      return {
        ...agent,
        reviewsCount: reviews.length,
        averageRating: averageRating.toFixed(1),
        likesCount: likes,
        listingsCount: listings
      };
    }));

    console.log('Processed agents with stats:', agentsWithStats.length);
    res.status(200).json(agentsWithStats);
  } catch (error) {
    console.error('Error in getAgents:', error);
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const agentId = req.params.id;
    const userId = req.user.id;

    const existingReview = await Review.findOne({ user: userId, agent: agentId });
    if (existingReview) {
      return next(errorHandler(400, 'You have already reviewed this agent'));
    }

    const review = new Review({
      user: userId,
      agent: agentId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ agent: req.params.id })
      .populate('user', 'username photo')
      .sort('-createdAt');
    
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const agentId = req.params.id;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ user: userId, agent: agentId });
    
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      res.status(200).json({ success: true, liked: false });
    } else {
      const like = new Like({ user: userId, agent: agentId });
      await like.save();
      res.status(200).json({ success: true, liked: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getLikes = async (req, res, next) => {
  try {
    const likes = await Like.countDocuments({ agent: req.params.id });
    res.status(200).json({ likes });
  } catch (error) {
    next(error);
  }
};

export const checkRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('role');
    res.json({ role: user.role });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Get total listings
    const totalListings = await Listing.countDocuments({ userRef: userId });
    
    // Get total views across all listings
    const listings = await Listing.find({ userRef: userId });
    const totalViews = listings.reduce((sum, listing) => sum + (listing.views || 0), 0);
    
    // Get average rating
    const reviews = await Review.find({ agent: userId });
    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;
    
    // Get total likes
    const totalLikes = await Like.countDocuments({ agent: userId });

    res.json({
      totalListings,
      totalViews,
      averageRating,
      totalLikes,
      reviewsCount: reviews.length
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username createdAt')
      .lean()
      .then(users => users.map(user => ({
        type: 'user',
        name: user.username,
        timestamp: new Date(user.createdAt).toLocaleDateString()
      })));

    // Get recent listings
    const recentListings = await Listing.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt')
      .lean()
      .then(listings => listings.map(listing => ({
        type: 'listing',
        name: listing.name,
        timestamp: new Date(listing.createdAt).toLocaleDateString()
      })));

    // Get monthly stats for the last 6 months
    const monthlyStats = await getMonthlyStats();

    res.json({
      totalUsers,
      totalListings,
      recentUsers,
      recentListings,
      monthlyStats
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyStats = async () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    months.push(month);
  }

  const monthlyStats = await Promise.all(months.map(async (month, index) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (5 - index));
    startDate.setDate(1);
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const [users, listings] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate }
      }),
      Listing.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate }
      })
    ]);

    return { month, users, listings };
  }));

  return monthlyStats;
};

export const checkLikeStatus = async (req, res, next) => {
  try {
    const agentId = req.params.id;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ user: userId, agent: agentId });
    res.status(200).json({ isLiked: !!existingLike });
  } catch (error) {
    next(error);
  }
};

export const addReplyToReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    const reply = {
      user: userId,
      text,
      likes: [],
      dislikes: []
    };

    review.replies.push(reply);
    await review.save();

    // Populate the user info for the new reply
    const populatedReview = await Review.findById(reviewId)
      .populate('replies.user', 'username photo');

    const newReply = populatedReview.replies[populatedReview.replies.length - 1];

    res.status(201).json({ success: true, reply: newReply });
  } catch (error) {
    next(error);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    if (review.user.toString() !== userId) {
      return next(errorHandler(403, 'You can only edit your own reviews'));
    }

    review.comment = comment;
    review.rating = rating;
    review.isEdited = true;
    review.editedAt = new Date();

    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate('user', 'username photo');

    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    next(error);
  }
};

export const editReplyToReview = async (req, res, next) => {
  try {
    const { reviewId, replyId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return next(errorHandler(404, 'Reply not found'));
    }

    if (reply.user.toString() !== userId) {
      return next(errorHandler(403, 'You can only edit your own replies'));
    }

    reply.text = text;
    reply.isEdited = true;
    reply.editedAt = new Date();

    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate('replies.user', 'username photo');

    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    if (review.user.toString() !== userId) {
      return next(errorHandler(403, 'You can only delete your own reviews'));
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteReplyToReview = async (req, res, next) => {
  try {
    const { reviewId, replyId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return next(errorHandler(404, 'Reply not found'));
    }

    if (reply.user.toString() !== userId) {
      return next(errorHandler(403, 'You can only delete your own replies'));
    }

    review.replies.pull(replyId);
    await review.save();

    res.status(200).json({ success: true, message: 'Reply deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleReviewReaction = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reaction } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    const hasLiked = review.likes.includes(userId);
    const hasDisliked = review.dislikes.includes(userId);

    // Remove existing reaction if any
    if (hasLiked) {
      review.likes.pull(userId);
    }
    if (hasDisliked) {
      review.dislikes.pull(userId);
    }

    // Add new reaction if it's different from the previous one
    if (reaction === 'like' && !hasLiked) {
      review.likes.push(userId);
    } else if (reaction === 'dislike' && !hasDisliked) {
      review.dislikes.push(userId);
    }

    await review.save();

    res.status(200).json({
      success: true,
      likes: review.likes.length,
      dislikes: review.dislikes.length,
      userReaction: reaction === 'like' && !hasLiked ? 'like' : 
                    reaction === 'dislike' && !hasDisliked ? 'dislike' : null
    });
  } catch (error) {
    next(error);
  }
};

export const toggleReplyReaction = async (req, res, next) => {
  try {
    const { reviewId, replyId } = req.params;
    const { reaction } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return next(errorHandler(404, 'Reply not found'));
    }

    const hasLiked = reply.likes.includes(userId);
    const hasDisliked = reply.dislikes.includes(userId);

    // Remove existing reaction if any
    if (hasLiked) {
      reply.likes.pull(userId);
    }
    if (hasDisliked) {
      reply.dislikes.pull(userId);
    }

    // Add new reaction if it's different from the previous one
    if (reaction === 'like' && !hasLiked) {
      reply.likes.push(userId);
    } else if (reaction === 'dislike' && !hasDisliked) {
      reply.dislikes.push(userId);
    }

    await review.save();

    res.status(200).json({
      success: true,
      likes: reply.likes.length,
      dislikes: reply.dislikes.length,
      userReaction: reaction === 'like' && !hasLiked ? 'like' : 
                    reaction === 'dislike' && !hasDisliked ? 'dislike' : null
    });
  } catch (error) {
    next(error);
  }
}; 