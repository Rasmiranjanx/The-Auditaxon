/**
 * Creates the first superadmin account.
 *
 *   node scripts/seedAdmin.js <email> <password> [name]
 *
 * Works from any folder: it always reads Server/.env (MONGO_URI).
 */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const Admin = require('../models/Admin')

const run = async () => {
  const email = (process.argv[2] || '').trim().toLowerCase()
  const password = process.argv[3] || ''
  const name = process.argv[4] || 'Super Admin'

  if (!email || !password) {
    console.log('Usage: node scripts/seedAdmin.js <email> <password> [name]')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in Server/.env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  console.log(`Connected to database "${mongoose.connection.name}"`)

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log('Admin with this email already exists.')
  } else {
    await Admin.create({ name, email, password, role: 'superadmin' })
    console.log(`Superadmin created: ${email}`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(async (err) => {
  console.error(err.message || err)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
