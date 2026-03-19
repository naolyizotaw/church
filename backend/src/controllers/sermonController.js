import Sermon from "../models/Sermon.js";
import { extractVideoId } from "./youtubeController.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all sermons (supports filtering by series, speaker, topic, search)
 * @route   GET /api/sermons
 * @access  Public
 */
export const getSermons = async (req, res) => {
  try {
    const { series, speaker, topic, search, page = 1, limit = 6 } = req.query;
    const filter = {};

    if (series) filter.series = series;
    if (speaker) filter.speaker = speaker;
    if (topic) filter.topic = topic;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Sermon.countDocuments(filter);

    const sermons = await Sermon.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      sermons,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Get sermons error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get featured sermon
 * @route   GET /api/sermons/featured
 * @access  Public
 */
export const getFeaturedSermon = async (req, res) => {
  try {
    let sermon = await Sermon.findOne({ isFeatured: true }).populate("uploadedBy", "name email");
    if (!sermon) {
      sermon = await Sermon.findOne().sort({ date: -1, createdAt: -1 }).populate("uploadedBy", "name email");
    }
    if (!sermon) {
      return res.status(404).json({ message: "No sermons found" });
    }
    res.json(sermon);
  } catch (error) {
    console.error("Get featured sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get filter options (distinct series, speakers, topics)
 * @route   GET /api/sermons/filters
 * @access  Public
 */
export const getSermonFilters = async (req, res) => {
  try {
    const [seriesList, speakers, topics] = await Promise.all([
      Sermon.distinct("series"),
      Sermon.distinct("speaker"),
      Sermon.distinct("topic"),
    ]);
    res.json({
      series: seriesList.filter(Boolean),
      speakers: speakers.filter(Boolean),
      topics: topics.filter(Boolean),
    });
  } catch (error) {
    console.error("Get sermon filters error:", error);
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
    const { title, description, speaker, date, fileType, series, topic, thumbnailUrl, videoUrl, duration, isFeatured } = req.body;

    if (!title || !speaker || !date) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Please provide title, speaker, and date",
      });
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const youtubeVideoId = extractVideoId(videoUrl);

    const sermon = await Sermon.create({
      title,
      description,
      speaker,
      date,
      fileUrl,
      fileType,
      series,
      topic,
      thumbnailUrl,
      videoUrl,
      youtubeVideoId,
      duration,
      isFeatured: isFeatured === "true" || isFeatured === true,
      uploadedBy: req.user._id,
    });

    await sermon.populate("uploadedBy", "name email");

    res.status(201).json(sermon);
  } catch (error) {
    console.error("Create sermon error:", error);

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update sermon
 * @route   PUT /api/sermons/:id
 * @access  Admin only
 */
export const updateSermon = async (req, res) => {
  try {
    const { title, description, speaker, date, series, topic, thumbnailUrl, videoUrl, duration, isFeatured } = req.body;

    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    sermon.title = title || sermon.title;
    sermon.description = description !== undefined ? description : sermon.description;
    sermon.speaker = speaker || sermon.speaker;
    sermon.date = date || sermon.date;
    sermon.series = series !== undefined ? series : sermon.series;
    sermon.topic = topic !== undefined ? topic : sermon.topic;
    sermon.thumbnailUrl = thumbnailUrl !== undefined ? thumbnailUrl : sermon.thumbnailUrl;
    sermon.videoUrl = videoUrl !== undefined ? videoUrl : sermon.videoUrl;
    if (videoUrl !== undefined) {
      sermon.youtubeVideoId = extractVideoId(videoUrl);
    }
    sermon.duration = duration !== undefined ? duration : sermon.duration;
    if (isFeatured !== undefined) sermon.isFeatured = isFeatured === "true" || isFeatured === true;

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

    if (sermon.fileUrl) {
      try {
        const filePath = path.join(__dirname, "../../", sermon.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
      }
    }

    await sermon.deleteOne();

    res.json({ message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Delete sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
