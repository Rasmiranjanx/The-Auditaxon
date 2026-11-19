const Review = require('../models/Review')

// @route  POST /api/reviews
// @access Public
const submitReview = async (req, res) => {
  try {
    const { name, role, message, rating } = req.body

    if (!name || !message || !rating) {
      return res.status(400).json({ message: 'Name, message, and rating are required' })
    }

    const review = await Review.create({ name, role, message, rating })
    res.status(201).json({ message: 'Review submitted, pending approval', id: review._id })
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit review', error: error.message })
  }
}

// @route  GET /api/reviews
// @access Public (only approved reviews shown)
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  GET /api/reviews/all
// @access Private (admin) — includes unapproved
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  PUT /api/reviews/:id/approve
// @access Private (admin)
const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    )
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json(review)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  DELETE /api/reviews/:id
// @access Private (admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json({ message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { submitReview, getApprovedReviews, getAllReviews, approveReview, deleteReview }
