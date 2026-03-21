import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "church/images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

export const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");
    return {
      folder: isVideo ? "church/videos" : isAudio ? "church/audio" : "church/media",
      resource_type: isVideo || isAudio ? "video" : "auto",
    };
  },
});

export const sermonStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");
    return {
      folder: "church/sermons",
      resource_type: isVideo || isAudio ? "video" : "auto",
    };
  },
});

export function getPublicIdFromUrl(url) {
  if (!url || !url.includes("cloudinary")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let publicId = parts[1];
    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch {
    return null;
  }
}

export async function deleteFromCloudinary(url, resourceType = "image") {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
}

export default cloudinary;
