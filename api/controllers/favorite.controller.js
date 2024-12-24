import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Verify user is requesting their own favorites
    if (req.user.id !== userId) {
      return next(errorHandler(403, 'You can only view your own favorites'));
    }

    const user = await User.findById(userId)
      .populate('favorites')
      .select('favorites');

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.json(user.favorites || []);
  } catch (error) {
    next(error);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check if listing is already in favorites
    if (user.favorites.includes(listingId)) {
      return next(errorHandler(400, 'Listing is already in favorites'));
    }

    // Add to favorites
    user.favorites.push(listingId);
    await user.save();

    res.status(200).json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== listingId);
    await user.save();

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const { userId, listingId } = req.params;
    
    if (!userId || !listingId) {
      return next(errorHandler(400, 'User ID and Listing ID are required'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const isFavorite = user.favorites?.includes(listingId) || false;
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
}; 