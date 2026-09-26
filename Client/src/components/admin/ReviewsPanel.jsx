import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Star, CheckCircle, Trash2 } from 'lucide-react'

const ReviewsPanel = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const token = localStorage.getItem('adminToken')

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reviews/all', {
                headers: { Authorization: `Bearer ${token}` },
            })
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

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/reviews/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchReviews()
        } catch (err) {
            console.error('Failed to approve:', err)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return
        try {
            await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchReviews()
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    if (loading) return <p className='text-slate-400'>Loading reviews...</p>
    if (error) return <p className='text-red-500'>{error}</p>

    return (
        <div>
            <h2 className='text-2xl font-bold text-white mb-6' style={{ fontFamily: "'Playfair Display', serif" }}>
                Reviews
            </h2>

            {reviews.length === 0 ? (
                <p className='text-slate-400'>No reviews yet.</p>
            ) : (
                <div className='flex flex-col gap-4'>
                    {reviews.map((r) => (
                        <div
                            key={r._id}
                            className={`p-5 rounded-lg border ${
                                r.isApproved ? 'border-slate-800 bg-slate-900/30' : 'border-amber-500/40 bg-slate-900/60'
                            }`}
                        >
                            <div className='flex justify-between items-start mb-2'>
                                <div>
                                    <h4 className='font-semibold text-white'>{r.name}</h4>
                                    {r.role && <p className='text-slate-400 text-sm'>{r.role}</p>}
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full ${
                                    r.isApproved ? 'bg-green-900 text-green-300' : 'bg-amber-900 text-amber-300'
                                }`}>
                                    {r.isApproved ? 'Approved' : 'Pending'}
                                </span>
                            </div>

                            <div className='flex gap-1 mb-2'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}
                                    />
                                ))}
                            </div>

                            <p className='text-slate-300 text-sm mb-3'>{r.message}</p>

                            <div className='flex gap-3'>
                                {!r.isApproved && (
                                    <button
                                        onClick={() => handleApprove(r._id)}
                                        className='flex items-center gap-1 text-green-400 hover:text-green-300 text-sm transition'
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(r._id)}
                                    className='flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition'
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewsPanel