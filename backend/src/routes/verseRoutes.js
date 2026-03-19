import express from "express";
import { getVerses, getTodayVerse, createVerse, updateVerse, deleteVerse } from "../controllers/verseController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.get("/today", getTodayVerse);
router.get("/", protect, admin, getVerses);
router.post("/", protect, admin, createVerse);
router.put("/:id", protect, admin, updateVerse);
router.delete("/:id", protect, admin, deleteVerse);

export default router;
