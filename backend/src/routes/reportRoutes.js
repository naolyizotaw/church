import express from "express";
import { getDonationReport, getOverviewReport } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.get("/donations", protect, admin, getDonationReport);
router.get("/overview", protect, admin, getOverviewReport);

export default router;
