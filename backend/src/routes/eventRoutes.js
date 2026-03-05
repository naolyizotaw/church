import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { imageUpload } from "../config/imageUpload.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin only routes
router.post("/", protect, admin, imageUpload.single("poster"), createEvent);
router.put("/:id", protect, admin, imageUpload.single("poster"), updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

export default router;
