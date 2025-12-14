import Announcement from "../models/Announcement.js";

/**
 * @desc    Get all announcements
 * @route   GET /api/announcements
 * @access  Public (filters based on auth status)
 * @note    Public users see only non-member-only announcements
 *          Logged-in users and admins see all announcements
 */
export const getAnnouncements = async (req, res) => {
  try {
    let filter = {};

    // If user is not authenticated, only show non-member-only announcements
    if (!req.user) {
      filter.isMemberOnly = false;
    }
    // If user is authenticated (member or admin), show all announcements
    // No additional filter needed

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error("Get announcements error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create new announcement
 * @route   POST /api/announcements
 * @access  Admin only
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, isMemberOnly } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Please provide title and content" });
    }

    const announcement = await Announcement.create({
      title,
      content,
      isMemberOnly: isMemberOnly || false,
      createdBy: req.user._id,
    });

    // Populate createdBy before sending response
    await announcement.populate("createdBy", "name email");

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update announcement
 * @route   PUT /api/announcements/:id
 * @access  Admin only
 */
export const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, isMemberOnly } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Update fields
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    if (isMemberOnly !== undefined) {
      announcement.isMemberOnly = isMemberOnly;
    }

    const updatedAnnouncement = await announcement.save();
    await updatedAnnouncement.populate("createdBy", "name email");

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error("Update announcement error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete announcement
 * @route   DELETE /api/announcements/:id
 * @access  Admin only
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await announcement.deleteOne();

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
