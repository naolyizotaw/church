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
