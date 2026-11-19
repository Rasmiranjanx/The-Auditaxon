import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { Star, Quote } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

const Testimonials = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    api
      .get('/reviews')
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Failed to load reviews:', err))
  }, [])

  if (reviews.length === 0) return null // hide section entirely if no approved reviews yet

  return (
    <section id="testimonials" className="section relative overflow-hidden bg-navy-900">
      {/* Faint hexagon grid echoing the logo */}
      <div
        aria-hidden="true"
        className="pattern-hex pattern-fade pointer-events-none absolute inset-0"
      ></div>

      <div className="container-page relative">
        <SectionHeader
          onDark
          eyebrow="Client voices"
          title="What Our Clients Say"
          lead="Real feedback from businesses we've worked with."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-6 md:mt-16">
          {reviews.map((r) => (
            <figure
              key={r._id}
              className="card-on-dark flex w-full flex-col p-7 md:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            >
              <div className="flex items-center justify-between gap-4">
                <Quote
                  size={28}
                  strokeWidth={1.5}
                  className="shrink-0 fill-gold-400/15 text-gold-400"
                />
                <div className="flex gap-1" role="img" aria-label={`Rated ${r.rating} out of 5`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < r.rating ? 'fill-gold-400 text-gold-400' : 'text-white/20'}
                    />
                  ))}
                </div>
              </div>

              <blockquote className="mt-5 flex-1 text-base leading-relaxed break-words text-navy-50">
                <p>{r.message}</p>
              </blockquote>

              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <p className="font-semibold break-words text-white">{r.name}</p>
                <p className="mt-0.5 text-sm break-words text-navy-200">{r.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
