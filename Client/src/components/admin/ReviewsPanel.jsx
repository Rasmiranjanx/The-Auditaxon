import React, { useState, useEffect } from 'react'
import api from '../../lib/api'
import { Star, CheckCircle, EyeOff, Trash2, MessageSquareQuote, CircleAlert } from 'lucide-react'

// Card header used by the loading, error and loaded states (presentational only)
const PanelHeader = ({ count, pending }) => (
  <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
    <div className="flex flex-wrap items-center gap-2.5">
      <h2 className="text-lg font-semibold text-ink">Reviews</h2>
      {count !== undefined && (
        <span className="badge badge-slate">
          {count}
          <span className="sr-only"> reviews</span>
        </span>
      )}
      {pending > 0 && <span className="badge badge-gold">{pending} pending</span>}
    </div>
    <p className="mt-1 text-sm text-slate-500">
      Client feedback from the website. Approved reviews appear in the testimonials section.
    </p>
  </div>
)

const ReviewsPanel = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/all')
      setReviews(res.data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Runs one admin action on a review, then refreshes the list; failures are shown above the table.
  const runAction = async (id, request, failureText) => {
    setBusyId(id)
    setActionError('')
    try {
      await request()
      await fetchReviews()
    } catch (err) {
      setActionError(err.response?.data?.message || failureText)
    } finally {
      setBusyId(null)
    }
  }

  const handleApprove = (id) =>
    runAction(id, () => api.put(`/reviews/${id}/approve`), 'Failed to approve the review')

  const handleUnapprove = (id) =>
    runAction(id, () => api.put(`/reviews/${id}/unapprove`), 'Failed to unpublish the review')

  const handleDelete = (id) => {
    if (!window.confirm('Delete this review?')) return
    runAction(id, () => api.delete(`/reviews/${id}`), 'Failed to delete the review')
  }

  const pendingCount = reviews.filter((r) => !r.isApproved).length

  if (loading)
    return (
      <div className="card overflow-hidden">
        <PanelHeader />
        <p role="status" className="px-6 py-16 text-center text-sm text-slate-500">
          Loading reviews…
        </p>
      </div>
    )
  if (error)
    return (
      <div className="card overflow-hidden">
        <PanelHeader />
        <div className="p-4 sm:p-6">
          <div role="alert" className="alert alert-error">
            <CircleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="card overflow-hidden">
      <PanelHeader count={reviews.length} pending={pendingCount} />

      {actionError && (
        <div className="border-b border-slate-200 p-4 sm:px-6">
          <div role="alert" className="alert alert-error">
            <CircleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
            <p>{actionError}</p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <MessageSquareQuote
            size={40}
            strokeWidth={1.5}
            aria-hidden="true"
            className="text-slate-300"
          />
          <p className="mt-4 font-medium text-ink">No reviews yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Feedback shared through the website&apos;s review form will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="block w-full text-left text-sm lg:table">
            <thead className="hidden border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase lg:table-header-group">
              <tr>
                <th scope="col" className="py-3 pr-4 pl-6 font-semibold">
                  Reviewer
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Rating
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Review
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="py-3 pr-6 pl-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-slate-100 lg:table-row-group">
              {reviews.map((r) => (
                <tr
                  key={r._id}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 px-4 py-4 transition-colors duration-150 hover:bg-slate-50/70 sm:px-6 lg:table-row ${
                    r.isApproved ? '' : 'bg-gold-50/50'
                  }`}
                >
                  <th
                    scope="row"
                    className="min-w-0 text-left align-top font-normal lg:w-48 lg:py-4 lg:pr-4 lg:pl-6 xl:w-64"
                  >
                    <p className="font-semibold text-ink">{r.name}</p>
                    {r.role && <p className="mt-0.5 text-slate-500">{r.role}</p>}
                    <p className="mt-1 text-xs text-slate-500">
                      <span className="sr-only">Submitted </span>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </th>

                  <td className="col-span-2 align-top lg:px-4 lg:py-4">
                    <div
                      role="img"
                      aria-label={`Rated ${r.rating} out of 5`}
                      className="flex gap-0.5 lg:pt-0.5"
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          aria-hidden="true"
                          className={
                            i < r.rating
                              ? 'fill-gold-500 text-gold-600'
                              : 'fill-slate-100 text-slate-300'
                          }
                        />
                      ))}
                    </div>
                  </td>

                  <td className="col-span-2 align-top lg:px-4 lg:py-4">
                    <p className="leading-relaxed whitespace-pre-line text-slate-600">
                      {r.message}
                    </p>
                  </td>

                  <td className="col-start-2 row-start-1 justify-self-end align-top lg:px-4 lg:py-4">
                    <span className={`badge ${r.isApproved ? 'badge-green' : 'badge-gold'}`}>
                      {r.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>

                  <td className="col-span-2 justify-self-end align-top lg:py-4 lg:pr-6 lg:pl-4">
                    <div className="flex flex-wrap justify-end gap-2 lg:flex-col lg:flex-nowrap lg:items-end xl:flex-row xl:items-center">
                      {r.isApproved ? (
                        <button
                          onClick={() => handleUnapprove(r._id)}
                          disabled={busyId === r._id}
                          aria-label={`Unpublish review by ${r.name}`}
                          className="btn btn-outline btn-sm h-10 lg:h-8"
                        >
                          <EyeOff size={14} aria-hidden="true" /> Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(r._id)}
                          disabled={busyId === r._id}
                          aria-label={`Approve review by ${r.name}`}
                          className="btn btn-outline btn-sm h-10 lg:h-8"
                        >
                          <CheckCircle size={14} aria-hidden="true" /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={busyId === r._id}
                        aria-label={`Delete review by ${r.name}`}
                        className="btn btn-danger btn-sm h-10 lg:h-8"
                      >
                        <Trash2 size={14} aria-hidden="true" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ReviewsPanel
