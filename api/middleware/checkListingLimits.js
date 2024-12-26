import Listing from '../models/listing.model.js';

export const checkListingLimits = async (req, res, next) => {
  try {
    if (req.user.role === 'agent') {
      return next();
    }

    // Count all listings ever created by user (including deleted)
    const totalListings = await Listing.countDocuments({
      userRef: req.user.id,
      $or: [{ deleted: true }, { deleted: false }]
    });

    if (totalListings >= 3) {
      return res.status(403).json({
        success: false,
        message: 'You have reached the maximum limit of 3 listings. Please upgrade to agent to create more.'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}; 