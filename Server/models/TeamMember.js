const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }, // e.g. "Partner", "Associate"
    category: {
      type: String,
      enum: ['partner', 'associate'],
      required: true,
      index: true,
    },
    designation: { type: String, trim: true }, // e.g. "Chartered Accountant"
    bio: { type: String },
    qualifications: [{ type: String }],
    photoUrl: { type: String },
    email: { type: String, lowercase: true, trim: true },
    linkedIn: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('TeamMember', teamMemberSchema)
