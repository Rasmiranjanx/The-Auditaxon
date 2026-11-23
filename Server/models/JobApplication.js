const mongoose = require('mongoose')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const jobApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [EMAIL_PATTERN, 'Please enter a valid email address'],
    },
    mobileNo: { type: String, required: true, trim: true, maxlength: 20 },
    gender: { type: String, enum: ['male', 'female'], required: true },
    positionAppliedFor: { type: String, trim: true, maxlength: 120 },
    dateOfBirth: { type: Date },
    highestQualification: { type: String, trim: true, maxlength: 120 },
    portfolioWebsite: { type: String, trim: true, maxlength: 300 },
    resumeUrl: { type: String, required: true },
    lastCompany: { type: String, trim: true, maxlength: 120 },
    experienceYears: { type: Number, default: 0, min: 0, max: 60 },
    experienceMonths: { type: Number, default: 0, min: 0, max: 11 },
    referenceComments: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ['received', 'shortlisted', 'rejected', 'hired'],
      default: 'received',
    },
  },
  { timestamps: true }
)

// Admin list: newest first, optionally filtered by status
jobApplicationSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('JobApplication', jobApplicationSchema)
