import ListingView from '../models/listingView.model.js';

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const offset = parseInt(req.query.offset) || 0;

    // Build filter query
    const query = {};

    if (req.query.searchTerm) {
      query.$or = [
        { name: { $regex: req.query.searchTerm, $options: 'i' } },
        { description: { $regex: req.query.searchTerm, $options: 'i' } },
        { address: { $regex: req.query.searchTerm, $options: 'i' } }
      ];
    }

    if (req.query.type !== 'all' && req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.parking === 'true') {
      query.parking = true;
    }

    if (req.query.furnished === 'true') {
      query.furnished = true;
    }

    if (req.query.offer === 'true') {
      query.offer = true;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.regularPrice = {};
      if (req.query.minPrice) query.regularPrice.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) query.regularPrice.$lte = parseInt(req.query.maxPrice);
    }

    // Area range
    if (req.query.minArea || req.query.maxArea) {
      query.totalArea = {};
      if (req.query.minArea) query.totalArea.$gte = parseInt(req.query.minArea);
      if (req.query.maxArea) query.totalArea.$lte = parseInt(req.query.maxArea);
    }

    // Bedrooms and bathrooms
    if (req.query.bedrooms && req.query.bedrooms !== 'any') {
      query.bedrooms = { $gte: parseInt(req.query.bedrooms) };
    }

    if (req.query.bathrooms && req.query.bathrooms !== 'any') {
      query.bathrooms = { $gte: parseInt(req.query.bathrooms) };
    }

    // Property status
    if (req.query.propertyStatus && req.query.propertyStatus !== 'all') {
      query.propertyStatus = req.query.propertyStatus;
    }

    // Amenities
    if (req.query.amenities) {
      const amenities = req.query.amenities.split(',');
      query.amenities = { $all: amenities };
    }

    // Sort options
    let sort = {};
    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    const listings = await Listing.find(query)
      .sort(sort)
      .limit(limit)
      .skip(offset);

    const total = await Listing.countDocuments(query);

    res.header('X-Total-Count', total);
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Ensure all fields are included in the response
    const listingData = {
      ...listing._doc,
      propertyType: listing.propertyType || listing.type,
      currency: listing.currency || 'NPR',
      maintenanceFees: listing.maintenanceFees || 0,
      deposit: listing.deposit || 0,
      paymentFrequency: listing.paymentFrequency || 'monthly',
      amenities: listing.amenities || {},
      furnishing: listing.furnishing || 'unfurnished',
      propertyStatus: listing.propertyStatus || 'ready'
    };

    res.status(200).json(listingData);
  } catch (error) {
    next(error);
  }
};

export const incrementViewCount = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { deviceId } = req.body;

    // Check if this device has already viewed this listing
    const existingView = await ListingView.findOne({
      listingId,
      deviceId
    });

    if (!existingView) {
      // Create new view record
      await ListingView.create({
        listingId,
        deviceId,
        timestamp: new Date()
      });

      // Increment the view count on the listing
      await Listing.findByIdAndUpdate(listingId, {
        $inc: { views: 1 }
      });

      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: true, alreadyViewed: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getManagerStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const stats = await Listing.aggregate([
      {
        $match: { userRef: userId }
      },
      {
        $facet: {
          totalListings: [{ $count: 'count' }],
          pendingReviews: [
            { $match: { status: 'pending' } },
            { $count: 'count' }
          ],
          approvedListings: [
            { $match: { status: 'approved' } },
            { $count: 'count' }
          ],
          rejectedListings: [
            { $match: { status: 'rejected' } },
            { $count: 'count' }
          ],
          recentListings: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                name: 1,
                status: 1,
                views: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    const formattedStats = {
      totalListings: stats[0].totalListings[0]?.count || 0,
      pendingReviews: stats[0].pendingReviews[0]?.count || 0,
      approvedListings: stats[0].approvedListings[0]?.count || 0,
      rejectedListings: stats[0].rejectedListings[0]?.count || 0,
      recentListings: stats[0].recentListings || []
    };

    res.status(200).json(formattedStats);
  } catch (error) {
    next(error);
  }
};

export const getPendingListings = async (req, res, next) => {
  try {
    const pendingListings = await Listing.find({ status: 'pending' })
      .populate('userRef', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(pendingListings);
  } catch (error) {
    next(error);
  }
};

export const reviewListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    // Check user's existing listings if they are not an agent
    if (req.user.role === 'user') {
      const existingListings = await Listing.countDocuments({ userRef: req.user.id });
      if (existingListings >= 3) {
        return res.status(403).json({
          success: false,
          message: 'You have reached the maximum limit of 3 listings. Please upgrade to agent to create more listings.'
        });
      }
    }

    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,
      status: 'approved' // All listings are approved by default
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    
    if (req.user.id !== listing.userRef && req.user.role !== 'admin') {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    // Soft delete instead of removing
    await Listing.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json('Listing has been soft deleted!');
  } catch (error) {
    next(error);
  }
};