const crypto = require('crypto')
const Admin = require('../models/Admin')
const generateToken = require('../utils/generateToken')
const sendPasswordResetEmail = require('../utils/sendEmail')

// @route  POST /api/auth/login
// @access Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json(req.admin)
}

// @route  POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.json({ message: 'If that email exists, a reset link has been sent' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    admin.resetPasswordExpires = Date.now() + 30 * 60 * 1000
    await admin.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendPasswordResetEmail(admin.email, resetUrl)

    res.json({ message: 'If that email exists, a reset link has been sent' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  POST /api/auth/reset-password/:token
// @access Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires')

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired reset link' })
    }

    admin.password = password
    admin.resetPasswordToken = undefined
    admin.resetPasswordExpires = undefined
    await admin.save()

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { loginAdmin, getMe, forgotPassword, resetPassword }
