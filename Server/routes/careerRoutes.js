const express = require('express')
const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/careerController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

// Public — candidate submits the Apply Here form with a resume file
router.post('/apply', upload.single('resume'), submitApplication)

// Admin-only — review applicants
router.get('/applications', protect, getApplications)
router.get('/applications/:id', protect, getApplicationById)
router.put('/applications/:id/status', protect, updateApplicationStatus)

module.exports = router
