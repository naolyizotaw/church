import mongoose from "mongoose";

const verseSchema = new mongoose.Schema(
  {
    textEnglish: {
      type: String,
      required: [true, "English verse text is required"],
      trim: true,
    },
    textAmharic: {
      type: String,
      trim: true,
      default: "",
    },
    referenceEnglish: {
      type: String,
      required: [true, "Bible reference is required"],
      trim: true,
    },
    referenceAmharic: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

verseSchema.index({ date: -1 });

const Verse = mongoose.model("Verse", verseSchema);

export default Verse;
