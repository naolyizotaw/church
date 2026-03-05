import Event from "../models/Event.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 }); // Sort by date ascending (upcoming events first)

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get single event
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Admin only
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "Please provide title, description, and date",
      });
    }

    let posterUrl = null;
    if (req.file) {
      posterUrl = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      posterUrl,
      createdBy: req.user._id,
    });

    await event.populate("createdBy", "name email");

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Admin only
 */
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    if (location !== undefined) event.location = location;

    if (req.file) {
      if (event.posterUrl) {
        try {
          const oldPath = path.join(__dirname, "../../", event.posterUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) { console.error("Error deleting old poster:", e); }
      }
      event.posterUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    await updatedEvent.populate("createdBy", "name email");

    res.json(updatedEvent);
  } catch (error) {
    console.error("Update event error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Admin only
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.posterUrl) {
      try {
        const filePath = path.join(__dirname, "../../", event.posterUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) { console.error("Error deleting poster:", e); }
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
