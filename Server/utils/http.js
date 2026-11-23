/**
 * Small request helpers shared by the controllers.
 */

// Logs the real error, but only sends its details to the client outside production.
const serverError = (res, error) => {
  console.error('[ERROR]', error)
  res.status(500).json({
    message: 'Server error',
    ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message }),
  })
}

// Bounded pagination from ?page=&limit= (limit capped so one request can't dump a collection).
const getPagination = (query, { defaultLimit = 20, maxLimit = 100 } = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit))
  return { page, limit, skip: (page - 1) * limit }
}

// Escapes user text for safe use inside a RegExp (prevents regex injection / ReDoS).
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Coerces a request value to a trimmed string ('' for objects/arrays/undefined).
const asString = (value) => (typeof value === 'string' ? value.trim() : '')

module.exports = { serverError, getPagination, escapeRegex, asString }
