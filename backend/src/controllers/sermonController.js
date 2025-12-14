import Sermon from "../models/Sermon.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all sermons
 * @route   GET /api/sermons
 * @access  Public
 */
export const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find()
      .populate("uploadedBy", "name email")
      .sort({ date: -1 }); // Sort by date descending (newest first)

    res.json(sermons);
  } catch (error) {
    console.error("Get sermons error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get single sermon
 * @route   GET /api/sermons/:id
 * @access  Public
 */
export const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    res.json(sermon);
  } catch (error) {
    console.error("Get sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create new sermon with file upload
 * @route   POST /api/sermons
 * @access  Admin only
 */
export const createSermon = async (req, res) => {
  try {
    const { title, description, speaker, date, fileType } = req.body;

    // Validation
    if (!title || !speaker || !date || !fileType) {
      // If validation fails and file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Please provide title, speaker, date, and fileType",
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a sermon file" });
    }

    // Validate fileType
    if (!["audio", "video"].includes(fileType)) {
      // Delete uploaded file if fileType is invalid
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "File type must be either 'audio' or 'video'",
      });
    }

    // Create file URL path (relative to server)
    const fileUrl = `/uploads/${req.file.filename}`;

    const sermon = await Sermon.create({
      title,
      description,
      speaker,
      date,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
    });

    // Populate uploadedBy before sending response
    await sermon.populate("uploadedBy", "name email");

    res.status(201).json(sermon);
  } catch (error) {
    console.error("Create sermon error:", error);

    // If error occurs and file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update sermon (without file change)
 * @route   PUT /api/sermons/:id
 * @access  Admin only
 */
export const updateSermon = async (req, res) => {
  try {
    const { title, description, speaker, date } = req.body;

    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    // Update fields (fileUrl and fileType cannot be changed via update)
    sermon.title = title || sermon.title;
    sermon.description = description || sermon.description;
    sermon.speaker = speaker || sermon.speaker;
    sermon.date = date || sermon.date;

    const updatedSermon = await sermon.save();
    await updatedSermon.populate("uploadedBy", "name email");

    res.json(updatedSermon);
  } catch (error) {
    console.error("Update sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete sermon
 * @route   DELETE /api/sermons/:id
 * @access  Admin only
 */
export const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(__dirname, "../../", sermon.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    await sermon.deleteOne();

    res.json({ message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Delete sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
