const multer = require('multer')

const isProduction = () => process.env.NODE_ENV === 'production'

// Unknown /api routes get a JSON 404 instead of Express's HTML page.
const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` })
}

/**
 * Central error handler: turns known errors into clear 4xx JSON responses and never
 * leaks internal error details to visitors in production.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Résumé upload problems (size limit, wrong field)
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Resume must be 1 MB or smaller'
        : `Upload error: ${err.message}`
    return res.status(400).json({ message })
  }

  // Rejected by our upload file filter
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ message: err.message })
  }

  // Malformed JSON body or body over the size limit
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request is too large' })
  }

  // Mongoose: bad ObjectId or failed schema validation
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }

  // CORS rejection from our origin allowlist
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Origin not allowed' })
  }

  console.error('[ERROR]', req.method, req.originalUrl, err)
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
  res.status(status).json({
    message: status === 500 ? 'Server error' : err.message,
    ...(isProduction() ? {} : { error: err.message }),
  })
}

module.exports = { notFound, errorHandler }
