import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
} from "../controllers/leaderController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "leader-" + unique + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp, gif) are allowed."), false);
  }
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: imageFilter });

const router = express.Router();

router.get("/", getLeaders);
router.get("/:id", getLeaderById);

router.post("/", protect, admin, upload.single("photo"), createLeader);
router.put("/:id", protect, admin, upload.single("photo"), updateLeader);
router.delete("/:id", protect, admin, deleteLeader);

export default router;
