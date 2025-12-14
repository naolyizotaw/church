import express from "express";
import {
  getContacts,
  getContactById,
  submitContact,
  toggleContactRead,
  deleteContact,
} from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public route
router.post("/", submitContact);

// Admin only routes
router.get("/", protect, admin, getContacts);
router.get("/:id", protect, admin, getContactById);
router.patch("/:id/read", protect, admin, toggleContactRead);
router.delete("/:id", protect, admin, deleteContact);

export default router;
