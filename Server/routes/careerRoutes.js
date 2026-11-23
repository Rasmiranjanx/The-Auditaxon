const express = require('express')
const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/careerController')
const { protect } = require('../middleware/authMiddleware')
const { formLimiter } = require('../middleware/rateLimiters')
const validateObjectId = require('../middleware/validateObjectId')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()
router.param('id', validateObjectId)

// Public — candidate submits the Apply Here form with a resume file.
// The rate limit runs first so blocked requests never upload to Cloudinary.
router.post('/apply', formLimiter, upload.single('resume'), submitApplication)

// Admin-only — review applicants
router.get('/applications', protect, getApplications)
router.get('/applications/:id', protect, getApplicationById)
router.put('/applications/:id/status', protect, updateApplicationStatus)

module.exports = router
