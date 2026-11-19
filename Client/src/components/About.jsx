import React from 'react'
import { ArrowRight, Handshake, MonitorCog, ShieldCheck, Target } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import siteConfig, { hasValue } from '../config/site'

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
    icon: Handshake,
    title: 'Client-First',
    description: 'Your goals shape how we approach every engagement.',
  },
  {
    icon: MonitorCog,
    title: 'Modern Approach',
    description: "Efficient, tech-enabled processes built for today's businesses.",
  },
]

const About = () => {
  return (
    <section id="about" className="section bg-white text-pretty">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeader
              align="left"
              eyebrow="About us"
              title="About The Auditaxon"
              lead="Founded to bring clarity and confidence to businesses navigating taxation, audit, and compliance — with the precision your finances deserve."
            />
            {hasValue(siteConfig.description) && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                {siteConfig.description}
              </p>
            )}
            <a
              href="#services"
              className="link mt-6 inline-flex min-h-10 items-center gap-2 focus-visible:ring-offset-2"
            >
              Explore our services
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <li key={index} className="card flex gap-4 p-5 sm:flex-col sm:gap-5 sm:p-6">
                  <span className="icon-tile">
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:mt-2">
                      {value.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
