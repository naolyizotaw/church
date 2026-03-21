import express from "express";
import multer from "multer";
import {
  getMediaFiles,
  uploadMedia,
  uploadBulkMedia,
  getMediaById,
  deleteMedia,
  getMediaStats,
  syncMedia,
} from "../controllers/mediaController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { mediaStorage } from "../config/cloudinary.js";

const upload = multer({
  storage: mediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = express.Router();

router.get("/", protect, admin, getMediaFiles);
router.get("/stats", protect, admin, getMediaStats);
router.post("/sync", protect, admin, syncMedia);
router.post("/upload", protect, admin, upload.single("file"), uploadMedia);
router.post("/upload-bulk", protect, admin, upload.array("files", 20), uploadBulkMedia);
router.get("/:id", protect, admin, getMediaById);
router.delete("/:id", protect, admin, deleteMedia);

export default router;
