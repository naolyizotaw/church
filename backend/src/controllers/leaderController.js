import Leader from "../models/Leader.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all leaders (public — only active, sorted by displayOrder)
 * @route   GET /api/leaders
 * @access  Public
 */
export const getLeaders = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };
    const leaders = await Leader.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    res.json(leaders);
  } catch (error) {
    console.error("Get leaders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get single leader
 * @route   GET /api/leaders/:id
 * @access  Public
 */
export const getLeaderById = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: "Leader not found" });
    }
    res.json(leader);
  } catch (error) {
    console.error("Get leader error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create new leader
 * @route   POST /api/leaders
 * @access  Admin only
 */
export const createLeader = async (req, res) => {
  try {
    const {
      name, role, roleAm, bio, phone, email, address,
      facebook, twitter, linkedin, displayOrder, isActive,
    } = req.body;

    if (!name || !role) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Name and role are required" });
    }

    let photoUrl = req.body.photoUrl || "";
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const leader = await Leader.create({
      name, role, roleAm, bio, photoUrl, phone, email, address,
      facebook, twitter, linkedin,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
      isActive: isActive === "false" ? false : true,
    });

    res.status(201).json(leader);
  } catch (error) {
    console.error("Create leader error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update leader
 * @route   PUT /api/leaders/:id
 * @access  Admin only
 */
export const updateLeader = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Leader not found" });
    }

    const fields = [
      "name", "role", "roleAm", "bio", "phone", "email",
      "address", "facebook", "twitter", "linkedin",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) leader[f] = req.body[f];
    });

    if (req.body.displayOrder !== undefined) {
      leader.displayOrder = Number(req.body.displayOrder);
    }
    if (req.body.isActive !== undefined) {
      leader.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    if (req.file) {
      if (leader.photoUrl && leader.photoUrl.startsWith("/uploads/")) {
        try {
          const oldPath = path.join(__dirname, "../../", leader.photoUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) { /* ignore */ }
      }
      leader.photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl !== undefined) {
      leader.photoUrl = req.body.photoUrl;
    }

    const updated = await leader.save();
    res.json(updated);
  } catch (error) {
    console.error("Update leader error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete leader
 * @route   DELETE /api/leaders/:id
 * @access  Admin only
 */
export const deleteLeader = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    if (leader.photoUrl && leader.photoUrl.startsWith("/uploads/")) {
      try {
        const filePath = path.join(__dirname, "../../", leader.photoUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) { /* ignore */ }
    }

    await leader.deleteOne();
    res.json({ message: "Leader deleted successfully" });
  } catch (error) {
    console.error("Delete leader error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
