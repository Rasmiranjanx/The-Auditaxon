const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['superadmin', 'editor'],
      default: 'editor',
    },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
)

// Hash password before saving, only if it changed
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)
