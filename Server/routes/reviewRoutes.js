const express = require('express')
const {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  unapproveReview,
  deleteReview,
} = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')
const { formLimiter } = require('../middleware/rateLimiters')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()
router.param('id', validateObjectId)

router.post('/', formLimiter, submitReview)
router.get('/', getApprovedReviews)
router.get('/all', protect, getAllReviews)
router.put('/:id/approve', protect, approveReview)
router.put('/:id/unapprove', protect, unapproveReview)
router.delete('/:id', protect, deleteReview)

module.exports = router
