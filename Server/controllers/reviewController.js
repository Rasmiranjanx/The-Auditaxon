const Review = require('../models/Review')
const { notifyAdmin } = require('../utils/sendEmail')
const { serverError, asString } = require('../utils/http')

// Keep in sync with models/Review.js and the client's ReviewForm.
const LIMITS = { name: 120, role: 120, message: 1000 }
const MIN_MESSAGE_LENGTH = 10

// Fields safe to show on the public site.
const PUBLIC_FIELDS = 'name role message rating createdAt'

// @route  POST /api/reviews
// @access Public (rate limited)
const submitReview = async (req, res) => {
  try {
    const name = asString(req.body.name)
    const role = asString(req.body.role)
    const message = asString(req.body.message)
    const rating = Number(req.body.rating)

    if (!name || !message || !req.body.rating) {
      return res.status(400).json({ message: 'Name, message, and rating are required' })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' })
    }
    if (message.length < MIN_MESSAGE_LENGTH) {
      return res
        .status(400)
        .json({ message: `Review must be at least ${MIN_MESSAGE_LENGTH} characters` })
    }
    const tooLong = Object.entries({ name, role, message }).find(
      ([field, value]) => value.length > LIMITS[field]
    )
    if (tooLong) {
      const [field] = tooLong
      const label = { name: 'Name', role: 'Role / company', message: 'Review' }[field]
      return res
        .status(400)
        .json({ message: `${label} must be ${LIMITS[field]} characters or fewer` })
    }

    const review = await Review.create({ name, role, message, rating })

    notifyAdmin(`New review awaiting approval (${rating}/5) from ${name}`, {
      Name: name,
      'Role / company': role,
      Rating: `${rating} / 5`,
      Review: message,
    })

    res.status(201).json({ message: 'Review submitted, pending approval', id: review._id })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Failed to submit review', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  GET /api/reviews
// @access Public (only approved reviews shown)
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .select(PUBLIC_FIELDS)
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(reviews)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  GET /api/reviews/all
// @access Private (admin) — includes unapproved
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(500)
    res.json(reviews)
  } catch (error) {
    serverError(res, error)
  }
}

const setApproval = (isApproved) => async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { returnDocument: 'after' }
    )
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json(review)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  PUT /api/reviews/:id/approve
// @access Private (admin) — publishes the review in the testimonials section
const approveReview = setApproval(true)

// @route  PUT /api/reviews/:id/unapprove
// @access Private (admin) — hides a published review again without deleting it
const unapproveReview = setApproval(false)

// @route  DELETE /api/reviews/:id
// @access Private (admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json({ message: 'Review deleted' })
  } catch (error) {
    serverError(res, error)
  }
}

module.exports = {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  unapproveReview,
  deleteReview,
}
