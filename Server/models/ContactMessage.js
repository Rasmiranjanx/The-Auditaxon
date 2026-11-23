const mongoose = require('mongoose')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [EMAIL_PATTERN, 'Please enter a valid email address'],
    },
    phone: { type: String, trim: true, maxlength: 30 },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 3000 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Admin inbox: newest first, optionally filtered by read/unread
contactMessageSchema.index({ isRead: 1, createdAt: -1 })

module.exports = mongoose.model('ContactMessage', contactMessageSchema)
