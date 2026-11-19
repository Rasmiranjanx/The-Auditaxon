const jwt = require('jsonwebtoken')

const generateToken = (adminId, role) => {
  return jwt.sign({ id: adminId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

module.exports = generateToken
