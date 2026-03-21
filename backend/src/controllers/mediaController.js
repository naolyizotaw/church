import Media from "../models/Media.js";
import fs from "fs";
import path from "path";

function getCategory(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}

export const getMediaFiles = async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (search) filter.originalName = { $regex: search, $options: "i" };

    const [files, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate("uploadedBy", "name"),
      Media.countDocuments(filter),
    ]);

    res.json({ files, total });
  } catch (error) {
    console.error("Get media error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { file } = req;
    const media = await Media.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
      category: getCategory(file.mimetype),
      uploadedBy: req.user._id,
    });
    res.status(201).json(media);
  } catch (error) {
    console.error("Upload media error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadBulkMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const mediaItems = await Promise.all(
      req.files.map((file) =>
        Media.create({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          url: `/uploads/${file.filename}`,
          category: getCategory(file.mimetype),
          uploadedBy: req.user._id,
        })
      )
    );
    res.status(201).json({ uploaded: mediaItems.length, files: mediaItems });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate("uploadedBy", "name");
    if (!media) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(media);
  } catch (error) {
    console.error("Get media by id error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "File not found" });
    }
    try {
      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
    } catch (fsErr) {
      console.error("File delete warning:", fsErr.message);
    }
    await media.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMediaStats = async (req, res) => {
  try {
    const [byCategory, totalSize, totalCount] = await Promise.all([
      Media.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            size: { $sum: "$size" },
          },
        },
      ]),
      Media.aggregate([{ $group: { _id: null, total: { $sum: "$size" } } }]),
      Media.countDocuments(),
    ]);

    res.json({
      totalFiles: totalCount,
      totalSize: totalSize[0]?.total || 0,
      byCategory: byCategory.reduce((acc, c) => {
        acc[c._id] = { count: c.count, size: c.size };
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Media stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
