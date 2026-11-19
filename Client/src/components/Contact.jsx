import React, { useState } from 'react'
import api from '../lib/api'
import siteConfig from '../config/site'
import { Mail, MapPin } from 'lucide-react'

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width={props.size}
    height={props.size}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width={props.size}
    height={props.size}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const FacebookIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width={props.size}
    height={props.size}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: '' })

    try {
      await api.post('/contact', formData)
      setStatus({ loading: false, success: true, error: '' })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <div
      id="contact"
      className="min-h-screen py-20 px-6 md:px-20 lg:px-32 bg-white flex flex-col justify-center"
    >
      <div className="text-center mb-14">
        <h2
          className="text-3xl md:text-4xl font-bold text-slate-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Contact Us
        </h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          Have a question or need our services? Reach out and we'll get back to you soon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-slate-900 text-white p-3 rounded-full">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Email</h4>
              <p className="text-slate-500 text-sm">
                <a href={`mailto:${siteConfig.contact.primaryEmail}`} className="hover:underline">
                  {siteConfig.contact.primaryEmail}
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-slate-900 text-white p-3 rounded-full">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Office</h4>
              <p className="text-slate-500 text-sm">{siteConfig.location.addressLine2}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-slate-900 text-white p-3 rounded-full">
              <InstagramIcon size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Follow Us</h4>
              <div className="flex gap-3 mt-1">
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-slate-500 hover:text-slate-900 transition"
                >
                  <InstagramIcon size={20} />
                </a>
                <a
                  href={siteConfig.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-slate-500 hover:text-slate-900 transition"
                >
                  <LinkedinIcon size={20} />
                </a>
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-slate-500 hover:text-slate-900 transition"
                >
                  <FacebookIcon size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
            />
          </div>

          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject (optional)"
            value={formData.subject}
            onChange={handleChange}
            className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={status.loading}
            className="bg-slate-900 hover:bg-slate-800 transition text-white px-8 py-3 font-semibold disabled:opacity-50"
          >
            {status.loading ? 'Sending...' : 'Send Message'}
          </button>

          {status.success && (
            <p className="text-green-600 text-sm">
              Message sent successfully! We'll get back to you soon.
            </p>
          )}
          {status.error && <p className="text-red-600 text-sm">{status.error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Contact
