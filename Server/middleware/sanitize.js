/**
 * Blocks MongoDB operator injection.
 *
 * JSON bodies can contain objects such as { "email": { "$ne": null } }. If such a value
 * reaches a query it becomes a query operator instead of a plain value. This middleware
 * removes every key that starts with "$" or contains "." from req.body and req.params
 * (recursively) before any controller sees them.
 *
 * req.query needs no cleaning: Express 5's default "simple" query parser only produces
 * strings and arrays of strings, never nested objects.
 */
const isUnsafeKey = (key) => key.startsWith('$') || key.includes('.')

const clean = (value) => {
  if (Array.isArray(value)) return value.map(clean)
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    for (const key of Object.keys(value)) {
      if (isUnsafeKey(key)) delete value[key]
      else value[key] = clean(value[key])
    }
  }
  return value
}

const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === 'object') clean(req.body)
  if (req.params && typeof req.params === 'object') clean(req.params)
  next()
}

module.exports = sanitizeRequest
