const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

// Verifies the JWT and attaches the logged-in admin to req.admin
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.admin = await Admin.findById(decoded.id).select('-password')
      if (!req.admin || !req.admin.isActive) {
        return res.status(401).json({ message: 'Not authorized, account inactive' })
      }
      return next()
    } catch {
      return res.status(401).json({ message: 'Not authorized, invalid token' })
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' })
}

// Restricts a route to specific roles, e.g. requireRole("superadmin")
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' })
    }
    next()
  }

module.exports = { protect, requireRole }
