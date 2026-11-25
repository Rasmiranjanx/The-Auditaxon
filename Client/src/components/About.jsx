import React from 'react'
import { ArrowRight, Handshake, MonitorCog, ShieldCheck, Target } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import siteConfig, { hasValue } from '../config/site'

const values = [
  {
    number: '01',
    icon: Target,
    title: 'Precision',
    description: 'Every number checked, every detail accounted for.',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Transparency',
    description: 'Clear communication, no hidden surprises in your finances.',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Client-First',
    description: 'Your goals shape how we approach every engagement.',
  },
  {
    number: '04',
    icon: MonitorCog,
    title: 'Modern Approach',
    description: "Efficient, tech-enabled processes built for today's businesses.",
  },
]

const About = () => {
  return (
    <section id="about" className="section bg-ivory text-pretty">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
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

            <blockquote className="mt-7 border-l-2 border-gold-500 pl-4 font-display text-lg leading-relaxed text-ink/80 italic">
              &ldquo;Partner-led accountability ensures every audit report, tax strategy, and
              compliance filing meets rigorous statutory standards.&rdquo;
            </blockquote>

            <div className="mt-7 flex flex-wrap items-center gap-6">
              <a href="#services" className="btn btn-primary group focus-visible:ring-offset-2">
                Explore our services
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <a href="#team" className="link inline-flex min-h-10 items-center text-sm">
                Meet the partners
              </a>
            </div>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Reveal key={value.title} as="li" delay={index * 70}>
                  <div className="group card-luxury relative flex h-full gap-4 overflow-hidden p-5 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-gold-500 before:transition-transform before:duration-300 hover:before:scale-x-100 sm:flex-col sm:gap-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <span className="icon-tile transition-colors duration-200 group-hover:bg-navy-900 group-hover:text-gold-300 group-hover:ring-navy-900">
                        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden font-display text-xl font-semibold text-paper-edge transition-colors duration-200 group-hover:text-gold-400 sm:inline"
                      >
                        {value.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">{value.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600 sm:mt-2">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
