import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserListings,
  getUserListingsCount,
  test,
  updateUser,
  addReview,
  getReviews,
  toggleLike,
  getLikes,
  getAgents,
  checkRole,
  getUserStats,
  getAdminDashboardStats,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Listing from '../models/listing.model.js';
import AdminAction from '../models/adminAction.model.js';

const router = express.Router();

// Move the getAllUsers route before the /:id route to prevent conflict
// This route should be at the top of your routes
router.get("/list", verifyToken(["admin"]), async (req, res, next) => {
  try {
    console.log('Fetching all users...');
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    next(error);
  }
});

// Public routes
router.get("/agents", getAgents);
router.get("/listings/:id", getUserListings);
router.get("/reviews/:id", getReviews);
router.get("/likes/:id", getLikes);

// Protected routes
router.post("/update/:id", verifyToken(), updateUser);
router.delete("/delete/:id", verifyToken(), deleteUser);
router.get("/listings/count/:id", verifyToken(["user", "agent"]), getUserListingsCount);
router.post("/review/:id", verifyToken(["user"]), addReview);
router.post("/like/:id", verifyToken(["user"]), toggleLike);

// Make user profile public for agents, but protected for regular users
router.get("/:id", async (req, res, next) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return next(errorHandler(400, 'Valid user ID is required'));
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Add role-specific data
    const userData = { ...user._doc };
    
    if (user.role === 'admin') {
      const adminStats = await AdminAction.find({ adminId: user._id })
        .sort('-createdAt')
        .limit(5)
        .lean();
      userData.adminStats = adminStats;
    }

    res.json(userData);
  } catch (error) {
    next(error);
  }
});

// Admin routes
router.get("/stats/:id", verifyToken(), getUserStats);

// Get admin-specific stats
router.get("/admin-stats/:id", verifyToken(["admin"]), async (req, res, next) => {
  try {
    const adminId = req.params.id;
    
    // Get admin-specific statistics
    const managedProperties = await Listing.countDocuments({ adminRef: adminId });
    const totalActions = await AdminAction.countDocuments({ adminId });
    const userManagement = await User.countDocuments({ managedBy: adminId });
    
    res.json({
      managedProperties,
      totalActions,
      userManagement,
      role: 'admin'
    });
  } catch (error) {
    next(error);
  }
});

// Get admin-specific data
router.get("/admin-data/:id", verifyToken(["admin"]), async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id)
      .select('department responsibilities lastLogin activityLog')
      .lean();
      
    if (!admin) {
      return next(errorHandler(404, 'Admin not found'));
    }
    
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

router.get("/admin-dashboard", verifyToken(["admin", "manager"]), getAdminDashboardStats);

export default router;
