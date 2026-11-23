const TeamMember = require('../models/TeamMember')
const { serverError, asString } = require('../utils/http')

// Fields the server manages itself; never accepted from the request body.
const PROTECTED_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt']
const withoutProtected = (body) => {
  const data = { ...body }
  PROTECTED_FIELDS.forEach((key) => delete data[key])
  return data
}

// @route  GET /api/team?category=partner
// @access Public
const getTeamMembers = async (req, res) => {
  try {
    const filter = { isActive: true }
    const category = asString(req.query.category)
    if (category) filter.category = category

    const members = await TeamMember.find(filter).sort({ order: 1, name: 1 })
    res.json(members)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  GET /api/team/:id
// @access Public
const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member || !member.isActive) {
      return res.status(404).json({ message: 'Team member not found' })
    }
    res.json(member)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  POST /api/team
// @access Private (admin)
const createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(withoutProtected(req.body))
    res.status(201).json(member)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Failed to create team member', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  PUT /api/team/:id
// @access Private (admin)
const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, withoutProtected(req.body), {
      returnDocument: 'after',
      runValidators: true,
    })
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json(member)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Failed to update team member', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  DELETE /api/team/:id
// @access Private (admin)
const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json({ message: 'Team member deleted' })
  } catch (error) {
    serverError(res, error)
  }
}

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
}
