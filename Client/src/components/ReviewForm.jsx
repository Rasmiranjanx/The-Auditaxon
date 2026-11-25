import React, { useState } from 'react'
import api from '../lib/api'
import { Star, CircleCheck, CircleAlert } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'

// Keep in sync with Server/controllers/reviewController.js
const MAX_NAME = 120
const MAX_ROLE = 120
const MIN_MESSAGE = 10
const MAX_MESSAGE = 1000

const RATING_LABELS = {
  1: 'Needs improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Exceptional',
}

const ReviewForm = () => {
  const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 0 })
  const [hoverRating, setHoverRating] = useState(0)
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (status.success || status.error) setStatus({ loading: false, success: false, error: '' })
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

  const activeRating = hoverRating || formData.rating

  return (
    <section id="feedback" className="section bg-ivory">
      <div className="container-page">
        <Reveal>
          <div className="card-luxury mx-auto max-w-2xl p-6 sm:p-10">
            <SectionHeader
              eyebrow="Feedback"
              title="Share Your Experience"
              lead="Worked with us? Let others know how it went."
            />

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-5 border-t border-paper-edge/70 pt-8"
            >
              <fieldset>
                <legend className="form-label">Your rating</legend>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="-ml-1.5 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} out of 5`}
                        aria-pressed={formData.rating === star}
                        onClick={() => {
                          setFormData({ ...formData, rating: star })
                          if (status.error) setStatus({ loading: false, success: false, error: '' })
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:outline-none"
                      >
                        <Star
                          size={28}
                          strokeWidth={1.5}
                          className={
                            star <= activeRating
                              ? 'fill-gold-500 text-gold-500 transition-colors duration-150'
                              : 'text-slate-400 transition-colors duration-150'
                          }
                        />
                      </button>
                    ))}
                  </div>
                  {activeRating > 0 && (
                    <span className="badge badge-gold">{RATING_LABELS[activeRating]}</span>
                  )}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="review-name" className="form-label">
                    Your name
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={MAX_NAME}
                    className="form-control"
                  />
                </div>

                <div>
                  <label htmlFor="review-role" className="form-label">
                    Role / company <span className="font-normal text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="review-role"
                    type="text"
                    name="role"
                    autoComplete="organization-title"
                    value={formData.role}
                    onChange={handleChange}
                    maxLength={MAX_ROLE}
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="review-message" className="form-label">
                  Your review
                </label>
                <textarea
                  id="review-message"
                  name="message"
                  placeholder="Tell us about your experience"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={MIN_MESSAGE}
                  maxLength={MAX_MESSAGE}
                  rows={4}
                  aria-describedby="review-message-hint"
                  className="form-control resize-none"
                ></textarea>
                <p id="review-message-hint" className="form-hint flex justify-between gap-4">
                  <span>At least {MIN_MESSAGE} characters.</span>
                  <span>
                    {formData.message.length} / {MAX_MESSAGE}
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="btn btn-primary mt-1 w-full"
              >
                {status.loading ? 'Submitting...' : 'Submit Review'}
              </button>

              {status.success && (
                <div role="status" className="alert alert-success">
                  <CircleCheck size={18} className="mt-px shrink-0" />
                  <p>Thank you! Your review will appear once approved.</p>
                </div>
              )}
              {status.error && (
                <div role="alert" className="alert alert-error">
                  <CircleAlert size={18} className="mt-px shrink-0" />
                  <p>{status.error}</p>
                </div>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ReviewForm
