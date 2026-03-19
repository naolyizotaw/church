import Program from "../models/Program.js";

export const getPrograms = async (req, res) => {
  try {
    const { category, admin } = req.query;
    const filter = {};
    if (!admin) filter.isActive = true;
    if (category) filter.category = category;

    const programs = await Program.find(filter)
      .populate("createdBy", "name email")
      .sort({ order: 1, createdAt: -1 });

    res.json(programs);
  } catch (error) {
    console.error("Get programs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    console.error("Get program error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProgram = async (req, res) => {
  try {
    const { title, titleAmharic, description, descriptionAmharic, icon, day, time, location, category, order } = req.body;

    if (!title || !description || !day || !time) {
      return res.status(400).json({
        message: "Please provide title, description, day, and time",
      });
    }

    const program = await Program.create({
      title,
      titleAmharic,
      description,
      descriptionAmharic,
      icon,
      day,
      time,
      location,
      category,
      order,
      createdBy: req.user._id,
    });

    await program.populate("createdBy", "name email");
    res.status(201).json(program);
  } catch (error) {
    console.error("Create program error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const fields = ["title", "titleAmharic", "description", "descriptionAmharic", "icon", "day", "time", "location", "category", "isActive", "order"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        program[field] = req.body[field];
      }
    });

    const updatedProgram = await program.save();
    await updatedProgram.populate("createdBy", "name email");

    res.json(updatedProgram);
  } catch (error) {
    console.error("Update program error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.deleteOne();
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Delete program error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
