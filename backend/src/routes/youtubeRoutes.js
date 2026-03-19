import express from "express";
import { getYoutubeInfo } from "../controllers/youtubeController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.get("/info", protect, admin, getYoutubeInfo);

export default router;
