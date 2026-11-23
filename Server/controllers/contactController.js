const ContactMessage = require('../models/ContactMessage')
const { notifyAdmin } = require('../utils/sendEmail')
const { serverError, getPagination, asString } = require('../utils/http')

// @route  POST /api/contact
// @access Public (rate limited)
const submitContactMessage = async (req, res) => {
  try {
    const name = asString(req.body.name)
    const email = asString(req.body.email)
    const phone = asString(req.body.phone)
    const subject = asString(req.body.subject)
    const message = asString(req.body.message)

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' })
    }

    const contactMessage = await ContactMessage.create({ name, email, phone, subject, message })

    notifyAdmin(
      `New enquiry from ${name}${subject ? `: ${subject}` : ''}`,
      { Name: name, Email: email, Phone: phone, Subject: subject, Message: message },
      email
    )

    res.status(201).json({ message: 'Message sent successfully', id: contactMessage._id })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Failed to send message', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  GET /api/contact
// @access Private (admin)
const getContactMessages = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}
    const isRead = asString(req.query.isRead)
    if (isRead === 'true' || isRead === 'false') filter.isRead = isRead === 'true'

    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(filter),
    ])

    res.json({ items, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    serverError(res, error)
  }
}

// @route  PUT /api/contact/:id/read
// @access Private (admin)
const markAsRead = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: 'after' }
    )
    if (!contactMessage) return res.status(404).json({ message: 'Message not found' })
    res.json(contactMessage)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  DELETE /api/contact/:id
// @access Private (admin)
const deleteContactMessage = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id)
    if (!contactMessage) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (error) {
    serverError(res, error)
  }
}

module.exports = {
  submitContactMessage,
  getContactMessages,
  markAsRead,
  deleteContactMessage,
}
