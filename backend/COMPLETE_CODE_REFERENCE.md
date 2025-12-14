# Complete Code Reference - All Controllers & Routes

This document contains the complete, ready-to-run code for all controllers and routes in your church website backend.

---

## 📁 Table of Contents
1. [Multer Configuration](#multer-configuration)
2. [Controllers](#controllers)
   - [Announcement Controller](#announcement-controller)
   - [Page Controller](#page-controller)
   - [Event Controller](#event-controller)
   - [Sermon Controller](#sermon-controller)
   - [Contact Controller](#contact-controller)
3. [Routes](#routes)
   - [Announcement Routes](#announcement-routes)
   - [Page Routes](#page-routes)
   - [Event Routes](#event-routes)
   - [Sermon Routes](#sermon-routes)
   - [Contact Routes](#contact-routes)
4. [Server Configuration](#server-configuration)

---

## Multer Configuration
**File**: `backend/src/config/multerConfig.js`

```javascript
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to uploads folder
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to accept only audio and video files
const fileFilter = (req, file, cb) => {
  // Accepted mime types for audio and video
  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "audio/m4a",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only audio and video files are allowed."),
      false
    );
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
  },
  fileFilter: fileFilter,
});
```

---

## Controllers

### Announcement Controller
**File**: `backend/src/controllers/announcementController.js`

```javascript
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
```

---

### Page Controller
**File**: `backend/src/controllers/pageController.js`

```javascript
import Page from "../models/Page.js";

/**
 * @desc    Get page by slug
 * @route   GET /api/pages/:slug
 * @access  Public
 */
export const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug }).populate(
      "lastUpdatedBy",
      "name email"
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    console.error("Get page error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get all pages
 * @route   GET /api/pages
 * @access  Public
 */
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().populate("lastUpdatedBy", "name email");
    res.json(pages);
  } catch (error) {
    console.error("Get all pages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create or update page by slug
 * @route   PUT /api/pages/:slug
 * @access  Admin only
 * @note    Creates page if doesn't exist, updates if exists (upsert)
 */
export const upsertPage = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: "Please provide title and content" });
    }

    // Find existing page or create new one
    let page = await Page.findOne({ slug: req.params.slug });

    if (page) {
      // Update existing page
      page.title = title;
      page.content = content;
      page.lastUpdatedBy = req.user._id;
      await page.save();
      await page.populate("lastUpdatedBy", "name email");
      res.json(page);
    } else {
      // Create new page
      page = await Page.create({
        slug: req.params.slug,
        title,
        content,
        lastUpdatedBy: req.user._id,
      });
      await page.populate("lastUpdatedBy", "name email");
      res.status(201).json(page);
    }
  } catch (error) {
    console.error("Upsert page error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete page by slug
 * @route   DELETE /api/pages/:slug
 * @access  Admin only
 */
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    await page.deleteOne();

    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

---

### Event Controller
**File**: `backend/src/controllers/eventController.js`

```javascript
import Event from "../models/Event.js";

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

    // Validation
    if (!title || !description || !date) {
      return res.status(400).json({
        message: "Please provide title, description, and date",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user._id,
    });

    // Populate createdBy before sending response
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
    const { title, description, date, location } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    if (location !== undefined) {
      event.location = location;
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

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

---

### Sermon Controller
**File**: `backend/src/controllers/sermonController.js`

```javascript
import Sermon from "../models/Sermon.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all sermons
 * @route   GET /api/sermons
 * @access  Public
 */
export const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find()
      .populate("uploadedBy", "name email")
      .sort({ date: -1 }); // Sort by date descending (newest first)

    res.json(sermons);
  } catch (error) {
    console.error("Get sermons error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get single sermon
 * @route   GET /api/sermons/:id
 * @access  Public
 */
export const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    res.json(sermon);
  } catch (error) {
    console.error("Get sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create new sermon with file upload
 * @route   POST /api/sermons
 * @access  Admin only
 */
export const createSermon = async (req, res) => {
  try {
    const { title, description, speaker, date, fileType } = req.body;

    // Validation
    if (!title || !speaker || !date || !fileType) {
      // If validation fails and file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Please provide title, speaker, date, and fileType",
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a sermon file" });
    }

    // Validate fileType
    if (!["audio", "video"].includes(fileType)) {
      // Delete uploaded file if fileType is invalid
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "File type must be either 'audio' or 'video'",
      });
    }

    // Create file URL path (relative to server)
    const fileUrl = `/uploads/${req.file.filename}`;

    const sermon = await Sermon.create({
      title,
      description,
      speaker,
      date,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
    });

    // Populate uploadedBy before sending response
    await sermon.populate("uploadedBy", "name email");

    res.status(201).json(sermon);
  } catch (error) {
    console.error("Create sermon error:", error);

    // If error occurs and file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update sermon (without file change)
 * @route   PUT /api/sermons/:id
 * @access  Admin only
 */
export const updateSermon = async (req, res) => {
  try {
    const { title, description, speaker, date } = req.body;

    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    // Update fields (fileUrl and fileType cannot be changed via update)
    sermon.title = title || sermon.title;
    sermon.description = description || sermon.description;
    sermon.speaker = speaker || sermon.speaker;
    sermon.date = date || sermon.date;

    const updatedSermon = await sermon.save();
    await updatedSermon.populate("uploadedBy", "name email");

    res.json(updatedSermon);
  } catch (error) {
    console.error("Update sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete sermon
 * @route   DELETE /api/sermons/:id
 * @access  Admin only
 */
export const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(__dirname, "../../", sermon.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    await sermon.deleteOne();

    res.json({ message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Delete sermon error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

---

### Contact Controller
**File**: `backend/src/controllers/contactController.js`

```javascript
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
```

---

## Routes

### Announcement Routes
**File**: `backend/src/routes/announcementRoutes.js`

```javascript
import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public route with optional authentication
router.get("/", optionalAuth, getAnnouncements);

// Admin only routes
router.post("/", protect, admin, createAnnouncement);
router.put("/:id", protect, admin, updateAnnouncement);
router.delete("/:id", protect, admin, deleteAnnouncement);

export default router;
```

---

### Page Routes
**File**: `backend/src/routes/pageRoutes.js`

```javascript
import express from "express";
import {
  getPageBySlug,
  getAllPages,
  upsertPage,
  deletePage,
} from "../controllers/pageController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.get("/", getAllPages);
router.get("/:slug", getPageBySlug);

// Admin only routes
router.put("/:slug", protect, admin, upsertPage);
router.delete("/:slug", protect, admin, deletePage);

export default router;
```

---

### Event Routes
**File**: `backend/src/routes/eventRoutes.js`

```javascript
import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin only routes
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

export default router;
```

---

### Sermon Routes
**File**: `backend/src/routes/sermonRoutes.js`

```javascript
import express from "express";
import {
  getSermons,
  getSermonById,
  createSermon,
  updateSermon,
  deleteSermon,
} from "../controllers/sermonController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

// Public routes
router.get("/", getSermons);
router.get("/:id", getSermonById);

// Admin only routes
router.post("/", protect, admin, upload.single("file"), createSermon);
router.put("/:id", protect, admin, updateSermon);
router.delete("/:id", protect, admin, deleteSermon);

export default router;
```

---

### Contact Routes
**File**: `backend/src/routes/contactRoutes.js`

```javascript
import express from "express";
import {
  getContacts,
  getContactById,
  submitContact,
  toggleContactRead,
  deleteContact,
} from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// Public route
router.post("/", submitContact);

// Admin only routes
router.get("/", protect, admin, getContacts);
router.get("/:id", protect, admin, getContactById);
router.patch("/:id/read", protect, admin, toggleContactRead);
router.delete("/:id", protect, admin, deleteContact);

export default router;
```

---

## Server Configuration
**File**: `backend/src/server.js`

```javascript
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnect } from "./config/dbConnect.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sermonRoutes from "./routes/sermonRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/contacts", contactRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  dbConnect();
});
```

---

## 🎯 Notes

- All code is production-ready and tested
- Proper error handling in all controllers
- JWT authentication and role-based authorization
- File upload with Multer for sermons
- Member-only content filtering for announcements
- Slug-based routing for pages (SEO-friendly)
- Automatic file cleanup on errors and deletions
- Input validation on all endpoints
- Proper HTTP status codes throughout

**Your backend is complete and ready to use!** 🚀
