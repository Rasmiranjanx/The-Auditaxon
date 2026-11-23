const mongoose = require('mongoose')
const Content = require('../models/Content')
const { serverError, getPagination, escapeRegex, asString } = require('../utils/http')

// Fields the server manages itself; never accepted from the request body.
const PROTECTED_FIELDS = ['_id', '__v', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
const withoutProtected = (body) => {
  const data = { ...body }
  PROTECTED_FIELDS.forEach((key) => delete data[key])
  return data
}

// @route  GET /api/content?type=service&category=Direct%20Tax
// @access Public
const getContentList = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const type = asString(req.query.type)
    const category = asString(req.query.category)
    const subcategory = asString(req.query.subcategory)
    const parent = asString(req.query.parent)
    const search = asString(req.query.search).slice(0, 100)

    const filter = { isPublished: true }
    if (type) filter.type = type
    if (category) filter.category = category
    if (subcategory) filter.subcategory = subcategory
    if (parent) {
      if (parent === 'null') filter.parent = null
      else if (mongoose.isValidObjectId(parent)) filter.parent = parent
      else return res.json({ items: [], total: 0, page, pages: 0 })
    }
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i')
      filter.$or = [{ title: pattern }, { summary: pattern }]
    }

    const [items, total] = await Promise.all([
      Content.find(filter)
        .select('-body') // list views don't need the full body text
        .sort({ order: 1, publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Content.countDocuments(filter),
    ])

    res.json({ items, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    serverError(res, error)
  }
}

// @route  GET /api/content/:slug
// @access Public
const getContentBySlug = async (req, res) => {
  try {
    const item = await Content.findOne({ slug: String(req.params.slug), isPublished: true })
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json(item)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  POST /api/content
// @access Private (admin)
const createContent = async (req, res) => {
  try {
    const item = await Content.create({ ...withoutProtected(req.body), createdBy: req.admin._id })
    res.status(201).json(item)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A content item with that slug already exists' })
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Failed to create content', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  PUT /api/content/:id
// @access Private (admin)
const updateContent = async (req, res) => {
  try {
    const item = await Content.findByIdAndUpdate(
      req.params.id,
      { ...withoutProtected(req.body), updatedBy: req.admin._id },
      { returnDocument: 'after', runValidators: true }
    )
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json(item)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A content item with that slug already exists' })
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Failed to update content', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  DELETE /api/content/:id
// @access Private (superadmin)
const deleteContent = async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json({ message: 'Content deleted' })
  } catch (error) {
    serverError(res, error)
  }
}

module.exports = {
  getContentList,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
}
