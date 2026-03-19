import mongoose from "mongoose";

const sermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    speaker: {
      type: String,
      required: [true, "Speaker is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Sermon date is required"],
    },
    series: {
      type: String,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    youtubeVideoId: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["audio", "video"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sermon = mongoose.model("Sermon", sermonSchema);

export default Sermon;
