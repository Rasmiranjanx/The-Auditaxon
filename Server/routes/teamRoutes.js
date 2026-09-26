const express = require("express");
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public reads — powers the Partners page and Associates page
router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);

// Admin-only writes
router.post("/", protect, createTeamMember);
router.put("/:id", protect, updateTeamMember);
router.delete("/:id", protect, deleteTeamMember);

module.exports = router;