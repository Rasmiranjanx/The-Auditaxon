const mongoose = require('mongoose')

/**
 * Use with router.param('id', validateObjectId): a malformed :id returns 404 instead of
 * reaching MongoDB and failing with a CastError (500).
 */
const validateObjectId = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Not found' })
  }
  next()
}

module.exports = validateObjectId
