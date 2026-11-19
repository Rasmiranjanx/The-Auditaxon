const Content = require('../models/Content')

// @route  GET /api/content?type=service&category=Direct%20Tax
// @access Public
const getContentList = async (req, res) => {
  try {
    const { type, category, subcategory, parent, search, page = 1, limit = 20 } = req.query

    const filter = { isPublished: true }
    if (type) filter.type = type
    if (category) filter.category = category
    if (subcategory) filter.subcategory = subcategory
    if (parent) filter.parent = parent === 'null' ? null : parent
    if (search)
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ]

    const skip = (Number(page) - 1) * Number(limit)

    const [items, total] = await Promise.all([
      Content.find(filter)
        .select('-body') // list views don't need the full body text
        .sort({ order: 1, publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Content.countDocuments(filter),
    ])

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  GET /api/content/:slug
// @access Public
const getContentBySlug = async (req, res) => {
  try {
    const item = await Content.findOne({ slug: req.params.slug, isPublished: true })
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route  POST /api/content
// @access Private (admin)
const createContent = async (req, res) => {
  try {
    const item = await Content.create({ ...req.body, createdBy: req.admin._id })
    res.status(201).json(item)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A content item with that slug already exists' })
    }
    res.status(400).json({ message: 'Failed to create content', error: error.message })
  }
}

// @route  PUT /api/content/:id
// @access Private (admin)
const updateContent = async (req, res) => {
  try {
    const item = await Content.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.admin._id },
      { new: true, runValidators: true }
    )
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json(item)
  } catch (error) {
    res.status(400).json({ message: 'Failed to update content', error: error.message })
  }
}

// @route  DELETE /api/content/:id
// @access Private (admin)
const deleteContent = async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json({ message: 'Content deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getContentList,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
}
