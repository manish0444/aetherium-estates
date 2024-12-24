import express from "express";
import passport from 'passport';
import {
  forgetPassword,
  resetPassword,
  signin,
  signOut,
  signup,
  verifyEmail,
  resendVerification,
} from "../controller/auth.controller.js";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/signin", signin);
router.get("/signout", signOut);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword/:token", resetPassword);
router.post("/resend-verification", resendVerification);
router.get("/debug-session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    unverifiedUser: req.session.unverifiedUser
  });
});
router.get("/session-status", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.cookies,
    unverifiedUser: req.session.unverifiedUser
  });
});
router.get("/test-session", (req, res) => {
  // Set a test value
  req.session.test = 'test value';
  
  // Save explicitly
  req.session.save(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save session' });
    }
    res.json({ 
      message: 'Session test successful',
      sessionID: req.sessionID,
      test: req.session.test
    });
  });
});
router.get("/check", verifyToken(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ 
      isAdmin: user.role === 'admin',
      user: {
        id: user._id,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
