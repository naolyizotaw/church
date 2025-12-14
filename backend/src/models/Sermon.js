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
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileType: {
      type: String,
      enum: ["audio", "video"],
      required: [true, "File type is required"],
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
