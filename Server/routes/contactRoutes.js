const express = require('express')
const {
  submitContactMessage,
  getContactMessages,
  markAsRead,
  deleteContactMessage,
} = require('../controllers/contactController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// Public — visitor submits the Contact Us form
router.post('/', submitContactMessage)

// Admin-only — view and manage messages
router.get('/', protect, getContactMessages)
router.put('/:id/read', protect, markAsRead)
router.delete('/:id', protect, deleteContactMessage)

module.exports = router
