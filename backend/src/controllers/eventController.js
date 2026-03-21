import Event from "../models/Event.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

function getNextOccurrence(event) {
  if (!event.isRecurring || !event.recurrencePattern) return event;

  const now = new Date();
  const end = event.recurrenceEnd ? new Date(event.recurrenceEnd) : null;
  let cursor = new Date(event.date);

  const advance = {
    weekly: (d) => d.setDate(d.getDate() + 7),
    biweekly: (d) => d.setDate(d.getDate() + 14),
    monthly: (d) => d.setMonth(d.getMonth() + 1),
  };

  const step = advance[event.recurrencePattern];
  if (!step) return event;

  const MAX = 200;
  let count = 0;
  while (cursor < now && count < MAX) {
    if (end && cursor > end) return null;
    step(cursor);
    count++;
  }

  if (end && cursor > end) return null;

  const obj = event.toObject ? event.toObject() : { ...event };
  const shift = cursor.getTime() - new Date(event.date).getTime();
  obj.date = new Date(cursor);
  if (event.endDate) {
    obj.endDate = new Date(new Date(event.endDate).getTime() + shift);
  }
  return obj;
}

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    const admin = req.query.admin === "true";
    if (admin) {
      return res.json(events);
    }

    const result = [];
    for (const ev of events) {
      if (ev.isRecurring) {
        const next = getNextOccurrence(ev);
        if (next) result.push(next);
      } else {
        result.push(ev);
      }
    }

    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(result);
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
    const { title, description, date, endDate, location, category, isRecurring, recurrencePattern, recurrenceEnd, requiresRegistration } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        message: "Please provide title, description, and date",
      });
    }

    let posterUrl = null;
    if (req.file) {
      posterUrl = req.file.path;
    }

    const recurring = isRecurring === "true" || isRecurring === true;
    const event = await Event.create({
      title,
      description,
      date,
      endDate: endDate || null,
      location,
      category: category || "worship",
      posterUrl,
      isRecurring: recurring,
      recurrencePattern: recurring ? recurrencePattern : null,
      recurrenceEnd: recurring ? recurrenceEnd || null : null,
      requiresRegistration: requiresRegistration === "true" || requiresRegistration === true,
      createdBy: req.user._id,
    });

    await event.populate("createdBy", "name email");

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
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
    const { title, description, date, endDate, location, category, isRecurring, recurrencePattern, recurrenceEnd, requiresRegistration } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    if (endDate !== undefined) event.endDate = endDate || null;
    if (location !== undefined) event.location = location;
    if (category) event.category = category;

    const recurring = isRecurring === "true" || isRecurring === true;
    event.isRecurring = recurring;
    event.recurrencePattern = recurring ? recurrencePattern || event.recurrencePattern : null;
    event.recurrenceEnd = recurring ? recurrenceEnd || event.recurrenceEnd : null;

    if (requiresRegistration !== undefined) {
      event.requiresRegistration = requiresRegistration === "true" || requiresRegistration === true;
    }

    if (req.file) {
      if (event.posterUrl) {
        await deleteFromCloudinary(event.posterUrl);
      }
      event.posterUrl = req.file.path;
    }

    const updatedEvent = await event.save();
    await updatedEvent.populate("createdBy", "name email");

    res.json(updatedEvent);
  } catch (error) {
    console.error("Update event error:", error);
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
      await deleteFromCloudinary(event.posterUrl);
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
