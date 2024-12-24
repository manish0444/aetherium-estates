import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
  incrementViewCount,
  getAllListings,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import Listing from "../models/listing.model.js";

const router = express.Router();

// Basic listing routes
router.post("/create", verifyToken(["user", "admin", "manager"]), createListing);
router.delete("/delete/:id", verifyToken(["user", "admin"]), deleteListing);
router.post("/update/:id", verifyToken(["user", "admin"]), updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
router.post("/view/:listingId", incrementViewCount);
router.get("/all", verifyToken(["admin"]), getAllListings);

// Manager and admin specific routes
router.get("/manager/stats", verifyToken(["manager", "admin"]), async (req, res, next) => {
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
});

router.get("/pending", verifyToken(["admin"]), async (req, res, next) => {
  try {
    const pendingListings = await Listing.find({ status: 'pending' })
      .populate('userRef', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: pendingListings });
  } catch (error) {
    next(error);
  }
});

router.put("/review/:id", verifyToken(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: 'Listing not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: listing 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
