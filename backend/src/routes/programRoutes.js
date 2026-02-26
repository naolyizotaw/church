import express from "express";
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgramById);

router.post("/", protect, admin, createProgram);
router.put("/:id", protect, admin, updateProgram);
router.delete("/:id", protect, admin, deleteProgram);

export default router;
