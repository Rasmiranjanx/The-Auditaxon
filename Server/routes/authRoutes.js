const express = require('express')
const {
  loginAdmin,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { authLimiter } = require('../middleware/rateLimiters')

const router = express.Router()

router.post('/login', authLimiter, loginAdmin)
router.get('/me', protect, getMe)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password/:token', authLimiter, resetPassword)

module.exports = router
