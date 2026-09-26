import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/api/reviews')
            .then((res) => setReviews(res.data))
            .catch((err) => console.error('Failed to load reviews:', err))
    }, [])

    if (reviews.length === 0) return null // hide section entirely if no approved reviews yet

    return (
        <div id="testimonials" className='min-h-screen py-20 px-6 md:px-20 lg:px-32 bg-black flex flex-col justify-center relative overflow-hidden'>
            <div
                className='absolute inset-0'
                style={{
                    background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                }}
            ></div>

            <div className='absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl'></div>
            <div className='absolute bottom-20 left-20 w-64 h-64 bg-slate-400/10 rounded-full blur-3xl'></div>

            <div className='relative z-10'>
                <div className='text-center mb-14'>
                    <h2 className='text-3xl md:text-4xl font-bold text-white' style={{ fontFamily: "'Playfair Display', serif" }}>
                        What Our Clients Say
                    </h2>
                    <p className='text-slate-400 mt-3 max-w-2xl mx-auto'>
                        Real feedback from businesses we've worked with.
                    </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {reviews.map((r) => (
                        <div key={r._id} className='flex flex-col p-8 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition'>
                            <Quote className='text-white/20 mb-4' size={32} />
                            <p className='text-slate-300 text-sm mb-6 flex-1'>{r.message}</p>
                            <div className='flex gap-1 mb-4'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}
                                    />
                                ))}
                            </div>
                            <div>
                                <h4 className='font-semibold text-white'>{r.name}</h4>
                                <p className='text-slate-500 text-xs'>{r.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Testimonials