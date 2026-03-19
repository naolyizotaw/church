import mongoose from "mongoose";

const serviceTimeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    time: { type: String, required: true },
    isHighlighted: { type: Boolean, default: false },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "main",
    },
    churchName: { type: String, default: "Kerabu Full Gospel Church" },
    address: { type: String, default: "Addis Ababa, Ethiopia\nKerabu Full Gospel Church" },
    phone: { type: String, default: "+251 911 123 456" },
    email: { type: String, default: "info@kerabuchurch.org" },
    mapQuery: { type: String, default: "Kerabu+Full+Gospel+Church+Addis+Ababa+Ethiopia" },
    serviceTimes: {
      type: [serviceTimeSchema],
      default: [
        { label: "Sunday Worship", time: "09:00 AM - 12:00 PM", isHighlighted: true },
        { label: "Wednesday Bible Study", time: "06:00 PM - 08:00 PM", isHighlighted: false },
        { label: "Friday Prayer", time: "06:00 PM - 08:00 PM", isHighlighted: false },
      ],
    },
    socialLinks: {
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);
export default SiteContent;
