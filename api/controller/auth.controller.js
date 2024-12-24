import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/verifyUser.js";
import { sendVerificationEmail } from "../utils/emailConfig.js";
import { 
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail 
} from "../utils/emailConfig.js";
import passport from 'passport';

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user) => {
    try {
      if (err) {
        return next(errorHandler(500, "Error authenticating with Google"));
      }
      
      if (!user) {
        return next(errorHandler(401, "Failed to authenticate with Google"));
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      const { password, ...userData } = user._doc;

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        .redirect(`${process.env.CLIENT_URL}?login=success`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? "Email is already in use."
          : "Username is already taken.",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const verificationToken = generateVerificationToken();

    // Create and save session data
    req.session.unverifiedUser = {
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000,
    };

    // Force session save
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
        }
        resolve();
      });
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Log session data for debugging
    console.log('Session saved:', {
      id: req.sessionID,
      unverifiedUser: req.session.unverifiedUser
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your email.",
      sessionId: req.sessionID
    });
  } catch (error) {
    console.error('Signup error:', error);
    next(errorHandler(500, "Server Error!"));
  }
};

export const verifyEmail = async (req, res, next) => {
  const { code, email } = req.body;

  try {
    console.log('Verification attempt:', {
      email,
      code,
      sessionID: req.sessionID,
      unverifiedUser: req.session.unverifiedUser
    });

    const unverifiedUser = req.session.unverifiedUser;

    if (!unverifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please sign up again.",
      });
    }

    if (unverifiedUser.email !== email || 
        unverifiedUser.verificationToken !== code ||
        unverifiedUser.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Create new user
    const newUser = new User({
      username: unverifiedUser.username,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      isVerified: true,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );

    // Clear session
    req.session.unverifiedUser = null;
    await new Promise(resolve => req.session.save(resolve));

    // Send welcome email
    await sendWelcomeEmail(newUser.email, newUser.username);

    const { password, ...rest } = newUser._doc;

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        success: true,
        message: "Email verified successfully",
        user: rest,
      });

  } catch (error) {
    console.error('Verification error:', error);
    next(errorHandler(500, "Server Error"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Wrong credentials!"));

    // Generate the token
    // const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: "30d",
    // });

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, "User not found"));

    //Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpireAt;

    await user.save();

    res.status(200).json({ message: "Password reset email sent." });

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) return next(errorHandler(404, "Invalid or expired reset token"));

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Generate new verification token
    const verificationToken = generateVerificationToken();

    // Store user data in the session
    req.session.unverifiedUser = {
      ...req.session.unverifiedUser,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Send new verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "New verification code sent successfully",
    });
  } catch (error) {
    next(errorHandler(500, "Error sending verification email"));
  }
};
