const express = require("express");
const {
  getContentList,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Public reads — this is what the React frontend calls for every page
router.get("/", getContentList);
router.get("/:slug", getContentBySlug);

// Admin-only writes
router.post("/", protect, createContent);
router.put("/:id", protect, updateContent);
router.delete("/:id", protect, requireRole("superadmin"), deleteContent);

module.exports = router;