import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import ListingView from '../models/listingView.model.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body, views: 0 });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userRef', 'username email role');
    
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (listing.userRef.role === 'manager' && 
        (listing.status === 'pending' || listing.status === 'rejected')) {
      return next(errorHandler(403, "This listing is not available"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent", "lease"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const statusCondition = {
      $or: [
        { status: 'approved' },
        { 
          $and: [
            { status: { $ne: 'pending' } },
            { status: { $ne: 'rejected' } },
            { 'userRef.role': { $ne: 'manager' } }
          ]
        }
      ]
    };

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      ...statusCondition
    })
      .populate('userRef', 'username email role')
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const incrementViewCount = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { deviceId } = req.body;

    const existingView = await ListingView.findOne({
      listingId,
      deviceId
    });

    if (!existingView) {
      await ListingView.create({
        listingId,
        deviceId,
        timestamp: new Date()
      });

      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { $inc: { views: 1 } },
        { new: true }
      );

      res.status(200).json({ 
        success: true, 
        views: updatedListing.views 
      });
    } else {
      const listing = await Listing.findById(listingId);
      res.status(200).json({ 
        success: true, 
        alreadyViewed: true,
        views: listing.views 
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm || '';
    const type = req.query.type;

    const query = {
      ...(searchTerm && { name: { $regex: searchTerm, $options: 'i' } }),
      ...(type && type !== 'all' && { type })
    };

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userRef', 'username email role');

    res.status(200).json({
      success: true,
      listings,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getTopViewedListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const listings = await Listing.find()
      .sort({ views: -1 })
      .limit(limit);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};