import express from "express";
import {
  getSermons,
  getSermonById,
  getFeaturedSermon,
  getSermonFilters,
  createSermon,
  updateSermon,
  deleteSermon,
} from "../controllers/sermonController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getSermons);
router.get("/featured", getFeaturedSermon);
router.get("/filters", getSermonFilters);
router.get("/:id", getSermonById);

router.post("/", protect, admin, upload.single("file"), createSermon);
router.put("/:id", protect, admin, updateSermon);
router.delete("/:id", protect, admin, deleteSermon);

export default router;
