require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)

  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || 'Super Admin'

  if (!email || !password) {
    console.log('Usage: node scripts/seedAdmin.js <email> <password> [name]')
    process.exit(1)
  }

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log('Admin with this email already exists.')
    process.exit(0)
  }

  await Admin.create({ name, email, password, role: 'superadmin' })
  console.log(`Superadmin created: ${email}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
