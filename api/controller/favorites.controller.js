import mongoose from "mongoose";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const addFavorite = async (req, res, next) => {
  const { userId, listingId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found!"));

    // Convert listingId to an ObjectId if it isn't one already
    const listingObjectId = new mongoose.Types.ObjectId(listingId);

    // Check if listing is already in favorites
    const isFavorite = user.favorites.some((fav) =>
      fav.equals(listingObjectId)
    );
    if (isFavorite)
      return next(errorHandler(400, "Listing is already in favorites!"));

    // Add listingId to favorites
    user.favorites.push(listingObjectId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    next(error);
  }
};

export const checkFavorite = async (req, res, next) => {
  const { userId, listingId } = req.params;

  try {
    // Validate inputs
    if (!userId || !listingId)
      return next(errorHandler(400, "Missing userId or listingId"));

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    // Check if the listingId exists in the user's favorites
    const isFavorite = user.favorites.some(
      (fav) => fav.toString() === listingId
    );

    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error("Error checking favorite:", error);
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  const { userId, listingId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found!"));

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== listingId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    next(error);
  }
};

// Get all favorite listings for a user
export const usersAllFavoriteList = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate("favorites");
    if (!user) return next(errorHandler(404, "User not found!"));

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};
