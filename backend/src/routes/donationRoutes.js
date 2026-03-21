import express from "express";
import {
  initializePayment,
  verifyPayment,
  chapaCallback,
  getDonations,
  getDonationStats,
  deleteDonation,
} from "../controllers/donationController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.post("/initialize", initializePayment);
router.get("/verify/:txRef", verifyPayment);
router.post("/callback", chapaCallback);

// Admin only routes
router.get("/", protect, admin, getDonations);
router.get("/stats", protect, admin, getDonationStats);
router.delete("/:id", protect, admin, deleteDonation);

export default router;
