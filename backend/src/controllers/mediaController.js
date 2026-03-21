import Media from "../models/Media.js";
import Sermon from "../models/Sermon.js";
import Event from "../models/Event.js";
import Leader from "../models/Leader.js";
import Service from "../models/Service.js";
import path from "path";
import { deleteFromCloudinary } from "../config/cloudinary.js";

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
      filename: file.filename || file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: file.path,
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
          filename: file.filename || file.originalname,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          url: file.path,
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

    const resourceType = media.category === "video" || media.category === "audio" ? "video" : "image";
    await deleteFromCloudinary(media.url, resourceType);

    await media.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

function guessMimeType(ext) {
  const map = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
    ".mp4": "video/mp4", ".webm": "video/webm", ".avi": "video/x-msvideo",
    ".mov": "video/quicktime", ".mp3": "audio/mpeg", ".wav": "audio/wav",
    ".ogg": "audio/ogg", ".m4a": "audio/mp4", ".pdf": "application/pdf",
    ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext.toLowerCase()] || "application/octet-stream";
}

function categoryFromExt(ext) {
  const e = ext.toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(e)) return "image";
  if ([".mp4", ".webm", ".avi", ".mov"].includes(e)) return "video";
  if ([".mp3", ".wav", ".ogg", ".m4a"].includes(e)) return "audio";
  return "document";
}

export const syncMedia = async (req, res) => {
  try {
    let synced = 0;
    const existingUrls = new Set((await Media.find({}, "url")).map((m) => m.url));

    const sources = [
      { model: Sermon, modelName: "Sermon", fields: [
        { urlField: "fileUrl", nameField: "title", fileType: null },
        { urlField: "thumbnailUrl", nameField: "title", fileType: "image" },
      ]},
      { model: Event, modelName: "Event", fields: [
        { urlField: "posterUrl", nameField: "title", fileType: "image" },
      ]},
      { model: Leader, modelName: "Leader", fields: [
        { urlField: "photoUrl", nameField: "name", fileType: "image" },
      ]},
      { model: Service, modelName: "Service", fields: [
        { urlField: "imageUrl", nameField: "title", fileType: "image" },
      ]},
    ];

    for (const src of sources) {
      const docs = await src.model.find();
      for (const doc of docs) {
        for (const field of src.fields) {
          const url = doc[field.urlField];
          if (!url || existingUrls.has(url)) continue;

          const ext = path.extname(new URL(url).pathname || "") || ".jpg";
          const originalName = `${doc[field.nameField] || src.modelName}${ext}`;
          const category = field.fileType || categoryFromExt(ext);

          await Media.create({
            filename: path.basename(url),
            originalName,
            mimeType: guessMimeType(ext),
            size: 0,
            path: "",
            url,
            category,
            usedBy: [{ model: src.modelName, modelId: doc._id, field: field.urlField }],
            uploadedBy: req.user._id,
          });
          existingUrls.add(url);
          synced++;
        }
      }
    }

    res.json({ message: `Sync complete. ${synced} new file(s) indexed.`, synced });
  } catch (error) {
    console.error("Sync media error:", error);
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
