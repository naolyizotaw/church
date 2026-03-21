import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    path: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["image", "video", "audio", "document"],
      required: true,
    },
    usedBy: [
      {
        model: { type: String, enum: ["Sermon", "Event", "Leader", "Page", "Service"] },
        modelId: { type: mongoose.Schema.Types.ObjectId },
        field: { type: String },
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

mediaSchema.index({ category: 1, createdAt: -1 });

const Media = mongoose.model("Media", mediaSchema);
export default Media;
