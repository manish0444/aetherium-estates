import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.get("/my-favorites/:userId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json([]);
    }
    
    return getFavorites(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/check-favorite/:userId&:listingId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ isFavorite: false });
    }
    return checkFavorite(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/add/:listingId", verifyToken(["user"]), addToFavorites);
router.delete("/remove/:listingId", verifyToken(["user"]), removeFromFavorites);

export default router;
