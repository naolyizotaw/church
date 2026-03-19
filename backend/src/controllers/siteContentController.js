import SiteContent from "../models/SiteContent.js";

export const getSiteContent = async (_req, res) => {
  try {
    let doc = await SiteContent.findOne({ key: "main" });
    if (!doc) {
      doc = await SiteContent.create({ key: "main" });
    }
    res.json(doc);
  } catch (error) {
    console.error("Get site content error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSiteContent = async (req, res) => {
  try {
    const allowed = [
      "churchName",
      "address",
      "phone",
      "email",
      "mapQuery",
      "serviceTimes",
      "socialLinks",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    let doc = await SiteContent.findOne({ key: "main" });
    if (!doc) {
      doc = await SiteContent.create({ key: "main", ...updates });
    } else {
      Object.assign(doc, updates);
      await doc.save();
    }

    res.json(doc);
  } catch (error) {
    console.error("Update site content error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
