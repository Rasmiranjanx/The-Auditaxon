const TeamMember = require('../models/TeamMember')

// @route  GET /api/team?category=partner
// @access Public
const getTeamMembers = async (req, res) => {
  try {
    const { category } = req.query

    const filter = { isActive: true }
    if (category) filter.category = category

    const members = await TeamMember.find(filter).sort({ order: 1, name: 1 })

    res.json(members)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
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
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  POST /api/team
// @access Private (admin)
const createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(req.body)
    res.status(201).json(member)
  } catch (error) {
    res.status(400).json({ message: 'Failed to create team member', error: error.message })
  }
}

// @route  PUT /api/team/:id
// @access Private (admin)
const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json(member)
  } catch (error) {
    res.status(400).json({ message: 'Failed to update team member', error: error.message })
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
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
}
