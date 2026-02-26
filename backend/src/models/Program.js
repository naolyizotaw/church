import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    titleAmharic: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    descriptionAmharic: {
      type: String,
    },
    icon: {
      type: String,
      trim: true,
    },
    day: {
      type: String,
      required: [true, "Day is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["ministry", "bible-study", "prayer", "choir", "youth", "children", "women", "other"],
      default: "other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model("Program", programSchema);

export default Program;
