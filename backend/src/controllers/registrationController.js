import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

/**
 * @desc    Register for an event
 * @route   POST /api/registrations
 * @access  Public
 */
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, name, email, phone } = req.body;

    if (!eventId || !name || !phone) {
      return res.status(400).json({ message: "Event, name, and phone number are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!event.requiresRegistration) {
      return res.status(400).json({ message: "This event does not require registration" });
    }

    const existing = await Registration.findOne({ event: eventId, phone });
    if (existing) {
      return res.status(409).json({ message: "This phone number is already registered for this event" });
    }

    const registration = await Registration.create({
      event: eventId,
      name,
      email: email || undefined,
      phone,
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "This phone number is already registered for this event" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get registrations for an event
 * @route   GET /api/registrations/:eventId
 * @access  Admin only
 */
export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get registration count for an event
 * @route   GET /api/registrations/:eventId/count
 * @access  Public
 */
export const getRegistrationCount = async (req, res) => {
  try {
    const count = await Registration.countDocuments({ event: req.params.eventId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete a registration
 * @route   DELETE /api/registrations/:id
 * @access  Admin only
 */
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    await registration.deleteOne();
    res.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
