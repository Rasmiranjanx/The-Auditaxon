const { rateLimit } = require('express-rate-limit')

// Requires app.set('trust proxy', ...) in server.js so limits apply per visitor IP
// rather than to the hosting provider's proxy.
const limiter = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message },
  })

// Admin login, forgot-password and reset-password: slow down password guessing.
const authLimiter = limiter(15, 10, 'Too many attempts. Please try again in 15 minutes.')

// Public forms (contact, review, job application): stop spam floods.
const formLimiter = limiter(60, 10, 'Too many submissions. Please try again later.')

module.exports = { authLimiter, formLimiter }
