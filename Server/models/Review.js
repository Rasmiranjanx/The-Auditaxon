const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Public testimonials (approved only) and the admin list, newest first
reviewSchema.index({ isApproved: 1, createdAt: -1 })

module.exports = mongoose.model('Review', reviewSchema)
