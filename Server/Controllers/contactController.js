const ContactMessage = require("../models/ContactMessage");

// @route  POST /api/contact
// @access Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });

    res.status(201).json({ message: "Message sent successfully", id: contactMessage._id });
  } catch (error) {
    res.status(400).json({ message: "Failed to send message", error: error.message });
  }
};

// @route  GET /api/contact
// @access Private (admin)
const getContactMessages = async (req, res) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ContactMessage.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/contact/:id/read
// @access Private (admin)
const markAsRead = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contactMessage) return res.status(404).json({ message: "Message not found" });
    res.json(contactMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  DELETE /api/contact/:id
// @access Private (admin)
const deleteContactMessage = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!contactMessage) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  markAsRead,
  deleteContactMessage,
};