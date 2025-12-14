import Contact from "../models/Contact.js";

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contacts
 * @access  Admin only
 */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Newest first

    res.json(contacts);
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get single contact submission
 * @route   GET /api/contacts/:id
 * @access  Admin only
 */
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    res.json(contact);
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Submit contact form
 * @route   POST /api/contacts
 * @access  Public
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please provide name, email, and message",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Contact form submitted successfully",
      contact,
    });
  } catch (error) {
    console.error("Submit contact error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Mark contact as read/unread
 * @route   PATCH /api/contacts/:id/read
 * @access  Admin only
 */
export const toggleContactRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    contact.isRead = !contact.isRead;
    await contact.save();

    res.json(contact);
  } catch (error) {
    console.error("Toggle contact read error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete contact submission
 * @route   DELETE /api/contacts/:id
 * @access  Admin only
 */
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    await contact.deleteOne();

    res.json({ message: "Contact submission deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
