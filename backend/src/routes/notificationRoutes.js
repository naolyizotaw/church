import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", protect, admin, getNotifications);
router.put("/:id/read", protect, admin, markAsRead);
router.put("/read-all", protect, admin, markAllAsRead);
router.delete("/:id", protect, admin, deleteNotification);

export default router;
