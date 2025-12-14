import express from "express";
import {
  getPageBySlug,
  getAllPages,
  upsertPage,
  deletePage,
} from "../controllers/pageController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.get("/", getAllPages);
router.get("/:slug", getPageBySlug);

// Admin only routes
router.put("/:slug", protect, admin, upsertPage);
router.delete("/:slug", protect, admin, deletePage);

export default router;
