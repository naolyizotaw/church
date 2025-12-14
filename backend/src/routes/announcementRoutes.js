import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public route with optional authentication
router.get("/", optionalAuth, getAnnouncements);

// Admin only routes
router.post("/", protect, admin, createAnnouncement);
router.put("/:id", protect, admin, updateAnnouncement);
router.delete("/:id", protect, admin, deleteAnnouncement);

export default router;
