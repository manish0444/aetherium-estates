import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from "../controller/blog.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//admin
router.post("/create", verifyToken(["admin"]), createBlog);
router.delete("/delete/:id", verifyToken(["admin"]), deleteBlog);
router.post("/update/:id", verifyToken(["admin"]), updateBlog);

//user and admin
router.get("", getAllBlogs);
router.get("/get/:id", getBlog);

export default router;
