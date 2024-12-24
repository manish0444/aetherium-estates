import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyToken = (requiredRoles = []) => {
  return async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return next(errorHandler(401, 'You need to be logged in'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // If roles are specified, verify user's role
      if (requiredRoles.length > 0) {
        const user = await User.findById(decoded.id);
        if (!user) {
          return next(errorHandler(404, 'User not found'));
        }
        
        if (!requiredRoles.includes(user.role)) {
          return next(errorHandler(403, 'You do not have permission'));
        }
      }

      next();
    } catch (err) {
      next(errorHandler(403, 'Invalid token'));
    }
  };
};

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const verifyManager = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'manager' || req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'You are not authorized' });
    }
  });
};
