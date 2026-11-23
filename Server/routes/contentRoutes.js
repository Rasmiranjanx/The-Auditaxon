const express = require('express')
const {
  getContentList,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController')
const { protect, requireRole } = require('../middleware/authMiddleware')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()
router.param('id', validateObjectId)

// Public reads — this is what the React frontend calls for every page
router.get('/', getContentList)
router.get('/:slug', getContentBySlug)

// Admin-only writes
router.post('/', protect, createContent)
router.put('/:id', protect, updateContent)
router.delete('/:id', protect, requireRole('superadmin'), deleteContent)

module.exports = router
