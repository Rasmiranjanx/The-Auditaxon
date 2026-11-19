const mongoose = require('mongoose')

const jobApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobileNo: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    positionAppliedFor: { type: String, trim: true },
    dateOfBirth: { type: Date },
    highestQualification: { type: String, trim: true },
    portfolioWebsite: { type: String, trim: true },
    resumeUrl: { type: String, required: true },
    lastCompany: { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    experienceMonths: { type: Number, default: 0 },
    referenceComments: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ['received', 'shortlisted', 'rejected', 'hired'],
      default: 'received',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('JobApplication', jobApplicationSchema)
