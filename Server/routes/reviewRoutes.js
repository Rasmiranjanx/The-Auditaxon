const express = require("express");
const {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", submitReview);
router.get("/", getApprovedReviews);
router.get("/all", protect, getAllReviews);
router.put("/:id/approve", protect, approveReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;