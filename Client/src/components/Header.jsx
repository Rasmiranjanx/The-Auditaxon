import React from 'react'
import Navbar from './Navbar'
import { ArrowRight, Award, Check, Clock, ShieldCheck, Target } from 'lucide-react'
import siteConfig, { hasValue, isFirmOpenNow } from '../config/site'

const serviceTitles = [
  'Direct Tax',
  'Indirect Tax / GST',
  'Audit & Assurance',
  'Company Registration',
  'Bookkeeping',
  'Financial Advisory',
]

// The three pillars from the logo: Expertise · Precision · Integrity
const pillars = [
  { title: 'Expertise', text: 'Audit, tax and advisory under one roof.', icon: Award },
  { title: 'Precision', text: 'Every number checked, every detail accounted for.', icon: Target },
  { title: 'Integrity', text: 'Clear communication, no hidden surprises.', icon: ShieldCheck },
]

const Header = () => {
  const lead = [siteConfig.description, siteConfig.tagline].find(hasValue)
  const hours = siteConfig.businessHours.display
  const openNow = isFirmOpenNow()

  return (
    <header
      id="home"
      className="relative flex flex-col overflow-hidden bg-navy-900 pt-28 text-white lg:min-h-[92vh]"
    >
      <Navbar />

      {/* Background layers (decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-navy-700)_0%,transparent_60%)]"
      />
      <div aria-hidden="true" className="pattern-hex pattern-fade pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--color-gold-500)_0%,transparent_55%)] opacity-[0.14]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold-500/20" />

      <div className="relative container-page flex flex-1 flex-col">
        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          {/* Left column */}
          <div className="lg:col-span-7">
            <p className="eyebrow eyebrow-on-dark">
              <span>
                Chartered Accountants<span className="hidden sm:inline"> · </span>
                <br className="sm:hidden" />
                Bhubaneswar
              </span>
            </p>

            <h1 className="mt-6 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              <span className="block text-pretty">Numbers you can trust,</span>{' '}
              <span className="block text-gold-400 italic">guidance you can rely on.</span>
            </h1>

            {lead && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
                {lead}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#contact" className="btn btn-accent focus-visible:ring-offset-navy-900">
                Request a consultation
                <ArrowRight size={16} />
              </a>
              <a href="#services" className="btn btn-outline-light">
                Explore our services
              </a>
            </div>
          </div>

          {/* Right column (lg+) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="card-on-dark p-8 xl:ml-auto xl:max-w-md">
              <h2 className="font-display text-2xl font-semibold text-white">How we can help</h2>

              <ul className="mt-6 space-y-3.5">
                {serviceTitles.map((title) => (
                  <li key={title} className="flex items-center gap-3 text-[15px] text-navy-50">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 ring-1 ring-gold-400/30 ring-inset">
                      <Check size={14} strokeWidth={2.25} />
                    </span>
                    {title}
                  </li>
                ))}
              </ul>

              {hasValue(hours) && (
                <div className="mt-7 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-navy-200 uppercase">
                      <Clock size={14} className="text-gold-400" />
                      Office hours
                    </p>
                    <span
                      className={[
                        'badge',
                        openNow
                          ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/25'
                          : 'bg-white/5 text-navy-200 ring-white/15',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'h-1.5 w-1.5 rounded-full',
                          openNow ? 'bg-emerald-400' : 'bg-slate-400',
                        ].join(' ')}
                      />
                      {openNow ? 'Open now' : 'Closed'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white">{hours}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pillars strip */}
        <ul className="grid gap-6 border-t border-white/10 py-8 md:grid-cols-3 md:gap-8 lg:py-10">
          {pillars.map(({ title, text, icon: Icon }) => (
            <li key={title} className="flex items-start gap-4 md:flex-col md:gap-3 lg:flex-row lg:gap-4">
              <span className="icon-tile-on-dark h-11 w-11">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-pretty text-navy-200">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

export default Header
