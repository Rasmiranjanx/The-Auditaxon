import React, { useState } from 'react'
import api from '../lib/api'
import { Star } from 'lucide-react'

const ReviewForm = () => {
  const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 0 })
  const [hoverRating, setHoverRating] = useState(0)
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.rating === 0) {
      setStatus({ loading: false, success: false, error: 'Please select a rating' })
      return
    }

    setStatus({ loading: true, success: false, error: '' })

    try {
      await api.post('/reviews', formData)
      setStatus({ loading: false, success: true, error: '' })
      setFormData({ name: '', role: '', message: '', rating: 0 })
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <div id="review" className="py-20 px-6 md:px-20 lg:px-32 bg-white">
      <div className="text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-slate-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Share Your Experience
        </h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          Worked with us? Let others know how it went.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={32}
                className={
                  star <= (hoverRating || formData.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300'
                }
              />
            </button>
          ))}
        </div>

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
          type="text"
          name="role"
          placeholder="Your Role / Company (optional)"
          value={formData.role}
          onChange={handleChange}
          className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
        />

        <textarea
          name="message"
          placeholder="Tell us about your experience"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition resize-none"
        ></textarea>

        <button
          type="submit"
          disabled={status.loading}
          className="bg-slate-900 hover:bg-slate-800 transition text-white px-8 py-3 font-semibold disabled:opacity-50"
        >
          {status.loading ? 'Submitting...' : 'Submit Review'}
        </button>

        {status.success && (
          <p className="text-green-600 text-sm text-center">
            Thank you! Your review will appear once approved.
          </p>
        )}
        {status.error && <p className="text-red-600 text-sm text-center">{status.error}</p>}
      </form>
    </div>
  )
}

export default ReviewForm
