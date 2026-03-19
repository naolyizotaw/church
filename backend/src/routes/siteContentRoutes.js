import express from "express";
import { getSiteContent, updateSiteContent } from "../controllers/siteContentController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", getSiteContent);
router.put("/", protect, admin, updateSiteContent);

export default router;
