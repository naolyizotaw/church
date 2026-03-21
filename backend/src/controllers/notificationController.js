import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find()
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit)),
      Notification.countDocuments(),
      Notification.countDocuments({ isRead: false }),
    ]);
    res.json({ notifications, total, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notification.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createNotification = async ({ type, title, message, relatedId, relatedModel }) => {
  try {
    return await Notification.create({ type, title, message, relatedId, relatedModel });
  } catch (error) {
    console.error("Create notification error:", error);
  }
};
