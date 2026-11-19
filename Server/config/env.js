/**
 * Environment variable validation for The Auditaxon Server.
 * Validates required configuration at boot time and fails fast with actionable errors.
 */

const requiredVars = [
  { key: 'MONGO_URI', desc: 'MongoDB connection string' },
  { key: 'JWT_SECRET', desc: 'Secret key for signing JSON Web Tokens (min 32 chars recommended)' },
  {
    key: 'CLIENT_URL',
    desc: 'Frontend URL for CORS & password reset links (e.g. http://localhost:5173)',
  },
  { key: 'CLOUDINARY_CLOUD_NAME', desc: 'Cloudinary cloud name for media assets' },
  { key: 'CLOUDINARY_API_KEY', desc: 'Cloudinary API key' },
  { key: 'CLOUDINARY_API_SECRET', desc: 'Cloudinary API secret' },
  { key: 'RESEND_API_KEY', desc: 'Resend API key for transactional emails' },
  { key: 'MAIL_FROM', desc: 'Sender email address (e.g. The Auditaxon <onboarding@resend.dev>)' },
  { key: 'ADMIN_NOTIFY_EMAIL', desc: 'Firm notification inbox (e.g. contact@theauditaxon.com)' },
]

const missing = requiredVars.filter((v) => !process.env[v.key] || process.env[v.key].trim() === '')

if (missing.length > 0) {
  console.error('\n=======================================================')
  console.error(' [FATAL] The Auditaxon Server Configuration Error')
  console.error(' Missing required environment variable(s):')
  missing.forEach((v) => {
    console.error(`   - ${v.key}: ${v.desc}`)
  })
  console.error('-------------------------------------------------------')
  console.error(' Please copy Server/.env.example to Server/.env and configure values.')
  console.error('=======================================================\n')
  process.exit(1)
}

// Set safe defaults for non-blocking variables
process.env.PORT = process.env.PORT || '5000'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  ADMIN_NOTIFY_EMAIL: process.env.ADMIN_NOTIFY_EMAIL,
}
