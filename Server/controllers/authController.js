const crypto = require('crypto')
const Admin = require('../models/Admin')
const generateToken = require('../utils/generateToken')
const sendPasswordResetEmail = require('../utils/sendEmail')
const { serverError, asString } = require('../utils/http')

const GENERIC_RESET_MESSAGE = 'If that email exists, a reset link has been sent'

// @route  POST /api/auth/login
// @access Public (rate limited)
const loginAdmin = async (req, res) => {
  try {
    const email = asString(req.body.email).toLowerCase()
    const password = typeof req.body.password === 'string' ? req.body.password : ''

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
    serverError(res, error)
  }
}

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json(req.admin)
}

// @route  POST /api/auth/forgot-password
// @access Public (rate limited)
const forgotPassword = async (req, res) => {
  try {
    const email = asString(req.body.email).toLowerCase()
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const admin = await Admin.findOne({ email })
    if (!admin || !admin.isActive) {
      return res.json({ message: GENERIC_RESET_MESSAGE })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    admin.resetPasswordExpires = Date.now() + 30 * 60 * 1000
    await admin.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    try {
      await sendPasswordResetEmail(admin.email, resetUrl)
    } catch (emailError) {
      // Same response either way so the endpoint can't reveal which emails exist;
      // the failure is in the server logs.
      console.error('[EMAIL] Password reset email failed:', emailError.message)
    }

    res.json({ message: GENERIC_RESET_MESSAGE })
  } catch (error) {
    serverError(res, error)
  }
}

// @route  POST /api/auth/reset-password/:token
// @access Public (rate limited)
const resetPassword = async (req, res) => {
  try {
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }
    // bcrypt only uses the first 72 bytes of a password
    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Password must be at most 72 characters' })
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(String(req.params.token))
      .digest('hex')

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
    serverError(res, error)
  }
}

module.exports = { loginAdmin, getMe, forgotPassword, resetPassword }
