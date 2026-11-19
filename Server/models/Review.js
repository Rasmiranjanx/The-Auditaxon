const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    message: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)
