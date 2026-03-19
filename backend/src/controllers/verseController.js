import Verse from "../models/Verse.js";

export const getVerses = async (req, res) => {
  try {
    const verses = await Verse.find()
      .populate("createdBy", "name email")
      .sort({ date: -1 });
    res.json(verses);
  } catch (error) {
    console.error("Get verses error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTodayVerse = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    let verse = await Verse.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
      isActive: true,
    });

    if (!verse) {
      verse = await Verse.findOne({ isActive: true }).sort({ date: -1 });
    }

    if (!verse) {
      return res.json({
        textEnglish: "Jesus Christ is the same yesterday and today and forever.",
        textAmharic: "ኢየሱስ ክርስቶስ ትናንትና ዛሬ እንዲሁም ለዘላለም አንድ ነው::",
        referenceEnglish: "Hebrews 13:8",
        referenceAmharic: "ዕብራውያን 13:8",
      });
    }

    res.json(verse);
  } catch (error) {
    console.error("Get today verse error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createVerse = async (req, res) => {
  try {
    const { textEnglish, textAmharic, referenceEnglish, referenceAmharic, date, isActive } = req.body;

    if (!textEnglish || !referenceEnglish || !date) {
      return res.status(400).json({ message: "Please provide verse text, reference, and date" });
    }

    const verse = await Verse.create({
      textEnglish,
      textAmharic: textAmharic || "",
      referenceEnglish,
      referenceAmharic: referenceAmharic || "",
      date,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    await verse.populate("createdBy", "name email");
    res.status(201).json(verse);
  } catch (error) {
    console.error("Create verse error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateVerse = async (req, res) => {
  try {
    const { textEnglish, textAmharic, referenceEnglish, referenceAmharic, date, isActive } = req.body;

    const verse = await Verse.findById(req.params.id);
    if (!verse) {
      return res.status(404).json({ message: "Verse not found" });
    }

    if (textEnglish !== undefined) verse.textEnglish = textEnglish;
    if (textAmharic !== undefined) verse.textAmharic = textAmharic;
    if (referenceEnglish !== undefined) verse.referenceEnglish = referenceEnglish;
    if (referenceAmharic !== undefined) verse.referenceAmharic = referenceAmharic;
    if (date !== undefined) verse.date = date;
    if (isActive !== undefined) verse.isActive = isActive;

    const updated = await verse.save();
    await updated.populate("createdBy", "name email");
    res.json(updated);
  } catch (error) {
    console.error("Update verse error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteVerse = async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.id);
    if (!verse) {
      return res.status(404).json({ message: "Verse not found" });
    }

    await verse.deleteOne();
    res.json({ message: "Verse deleted successfully" });
  } catch (error) {
    console.error("Delete verse error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
