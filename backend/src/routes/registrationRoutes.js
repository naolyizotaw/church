import express from "express";
import {
  registerForEvent,
  getRegistrations,
  getRegistrationCount,
  deleteRegistration,
} from "../controllers/registrationController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public
router.post("/", registerForEvent);
router.get("/:eventId/count", getRegistrationCount);

// Admin only
router.get("/:eventId", protect, admin, getRegistrations);
router.delete("/:id", protect, admin, deleteRegistration);

export default router;
