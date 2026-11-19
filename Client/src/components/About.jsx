import React from 'react'
import { Target, ShieldCheck, Users, Zap } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Precision',
    description: 'Every number checked, every detail accounted for.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparency',
    description: 'Clear communication, no hidden surprises in your finances.',
  },
  {
    icon: Users,
    title: 'Client-First',
    description: 'Your goals shape how we approach every engagement.',
  },
  {
    icon: Zap,
    title: 'Modern Approach',
    description: "Efficient, tech-enabled processes built for today's businesses.",
  },
]

const About = () => {
  return (
    <div
      id="about"
      className="min-h-screen py-20 px-6 md:px-20 lg:px-32 bg-white flex flex-col justify-center"
    >
      <div className="text-center mb-14">
        <h2
          className="text-3xl md:text-4xl font-bold text-slate-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          About The Auditaxon
        </h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          Founded to bring clarity and confidence to businesses navigating taxation, audit, and
          compliance — with the precision your finances deserve.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => {
          const Icon = value.icon
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-100 hover:shadow-lg transition"
            >
              <div className="bg-slate-900 text-white p-4 rounded-full mb-4">
                <Icon size={28} />
              </div>
              <h3 className="font-semibold text-lg text-slate-900">{value.title}</h3>
              <p className="text-slate-500 text-sm mt-2">{value.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default About
