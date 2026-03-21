import Leader from "../models/Leader.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

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
      return res.status(400).json({ message: "Name and role are required" });
    }

    let photoUrl = req.body.photoUrl || "";
    if (req.file) {
      photoUrl = req.file.path;
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
      if (leader.photoUrl) {
        await deleteFromCloudinary(leader.photoUrl);
      }
      leader.photoUrl = req.file.path;
    } else if (req.body.photoUrl !== undefined) {
      leader.photoUrl = req.body.photoUrl;
    }

    const updated = await leader.save();
    res.json(updated);
  } catch (error) {
    console.error("Update leader error:", error);
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

    if (leader.photoUrl) {
      await deleteFromCloudinary(leader.photoUrl);
    }

    await leader.deleteOne();
    res.json({ message: "Leader deleted successfully" });
  } catch (error) {
    console.error("Delete leader error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
