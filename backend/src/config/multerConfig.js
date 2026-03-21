import multer from "multer";
import { sermonStorage } from "./cloudinary.js";

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "audio/m4a",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only audio and video files are allowed."),
      false
    );
  }
};

export const upload = multer({
  storage: sermonStorage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});
