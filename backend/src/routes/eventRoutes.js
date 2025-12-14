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

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin only routes
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

export default router;
