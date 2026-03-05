import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    endDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["worship", "youth", "outreach", "prayer", "conference", "charity"],
      default: "worship",
    },
    posterUrl: {
      type: String,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
      enum: ["weekly", "biweekly", "monthly"],
      default: null,
    },
    recurrenceEnd: {
      type: Date,
      default: null,
    },
    requiresRegistration: {
      type: Boolean,
      default: false,
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

const Event = mongoose.model("Event", eventSchema);

export default Event;
