import express from "express";
import {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
} from "../controllers/leaderController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { imageUpload } from "../config/imageUpload.js";

const router = express.Router();

router.get("/", getLeaders);
router.get("/:id", getLeaderById);

router.post("/", protect, admin, imageUpload.single("photo"), createLeader);
router.put("/:id", protect, admin, imageUpload.single("photo"), updateLeader);
router.delete("/:id", protect, admin, deleteLeader);

export default router;
