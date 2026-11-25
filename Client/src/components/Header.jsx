import React from 'react'
import Navbar from './Navbar'
import { ArrowRight, Award, Check, Clock, MapPin, ShieldCheck, Target } from 'lucide-react'
import siteConfig, { hasValue, isFirmOpenNow } from '../config/site'
import { requestServiceConsultation } from '../lib/inquire'

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
  { title: 'Precision', text: 'Rigorous checks on every return and report.', icon: Target },
  { title: 'Integrity', text: 'Independent, ethical advice you can rely on.', icon: ShieldCheck },
]

const Header = () => {
  const lead = [siteConfig.tagline, siteConfig.description].find(hasValue)
  const hours = siteConfig.businessHours.display
  const openNow = isFirmOpenNow()

  return (
    <header
      id="home"
      className="relative flex flex-col overflow-hidden bg-navy-950 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-900 pt-24 text-ivory sm:pt-28 lg:min-h-[92vh]"
    >
      <Navbar />

      {/* Background layers (decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-navy-700)_0%,transparent_60%)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pattern-hex pattern-fade pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--color-gold-400)_0%,transparent_55%)] opacity-[0.12]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-[8%] hidden h-96 w-96 rounded-full border border-gold-300/10 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/45 to-transparent"
      />

      <div className="relative container-page flex flex-1 flex-col">
        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          {/* Left column */}
          <div className="lg:col-span-7">
            <p
              className="eyebrow eyebrow-on-dark hero-enter max-sm:items-start max-sm:before:mt-2"
              style={{ animationDelay: '40ms' }}
            >
              <span>
                Chartered Accountants<span className="hidden sm:inline"> · </span>
                <br className="sm:hidden" />
                {siteConfig.location.city}
              </span>
            </p>

            <h1
              className="hero-enter mt-6 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-ivory sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '120ms' }}
            >
              <span className="block text-pretty">Numbers you can trust,</span>{' '}
              <span className="block bg-gradient-to-r from-gold-200 via-gold-300 to-gold-500 bg-clip-text text-transparent italic">
                guidance you can rely on.
              </span>
            </h1>

            {lead && (
              <p
                className="hero-enter mt-6 max-w-xl text-lg leading-relaxed text-pretty text-navy-100/90 sm:text-xl"
                style={{ animationDelay: '200ms' }}
              >
                {lead}
              </p>
            )}

            <div
              className="hero-enter mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
              style={{ animationDelay: '280ms' }}
            >
              <a
                href="#contact"
                className="btn btn-accent group px-6 py-3.5 shadow-lg shadow-navy-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-offset-navy-950"
              >
                Request a consultation
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#services"
                className="btn btn-outline-light px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore our services
              </a>
            </div>

            <div
              className="hero-enter mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-navy-200/85"
              style={{ animationDelay: '340ms' }}
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-gold-300" aria-hidden="true" />
                {siteConfig.location.city}, {siteConfig.location.state}
              </span>
              {hasValue(hours) && (
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${openNow ? 'bg-emerald-400' : 'bg-slate-400'}`}
                    aria-hidden="true"
                  />
                  {openNow ? 'Office open now · IST' : 'Monday – Saturday · IST'}
                </span>
              )}
            </div>
          </div>

          {/* Right column (lg+) */}
          <div
            className="hero-enter hidden lg:col-span-5 lg:block"
            style={{ animationDelay: '240ms' }}
          >
            <div className="relative overflow-hidden rounded-lg border border-gold-300/20 bg-navy-900/75 p-8 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.65)] backdrop-blur-md xl:ml-auto xl:max-w-md">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
              />

              <div className="flex items-baseline justify-between gap-2 border-b border-gold-300/15 pb-4">
                <h2 className="font-display text-2xl font-semibold text-ivory">How we can help</h2>
                <span className="text-[10px] font-semibold tracking-[0.22em] text-gold-300 uppercase">
                  Select to inquire
                </span>
              </div>

              <ul className="mt-4 space-y-1">
                {serviceTitles.map((title) => (
                  <li key={title}>
                    <button
                      type="button"
                      onClick={() => requestServiceConsultation(`${title} — Consultation`)}
                      className="group flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-[15px] text-navy-100 transition-colors duration-150 hover:bg-white/[0.06] hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:outline-none"
                    >
                      <span className="flex items-center gap-3">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-300/10 text-gold-300 ring-1 ring-gold-300/30 transition-colors duration-150 ring-inset group-hover:bg-gold-300 group-hover:text-navy-950">
                          <Check size={14} strokeWidth={2.25} />
                        </span>
                        {title}
                      </span>
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="-translate-x-1 text-gold-300 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </button>
                  </li>
                ))}
              </ul>

              {hasValue(hours) && (
                <div className="mt-5 border-t border-gold-300/15 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-navy-200 uppercase">
                      <Clock size={14} className="text-gold-300" />
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
                  <p className="mt-2 text-sm text-ivory">{hours}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pillars strip */}
        <ul
          className="hero-enter grid gap-6 border-t border-gold-300/15 py-8 md:grid-cols-3 md:gap-8 lg:py-10"
          style={{ animationDelay: '360ms' }}
        >
          {pillars.map(({ title, text, icon: Icon }) => (
            <li
              key={title}
              className="group -m-3 flex items-start gap-4 rounded-lg border border-transparent p-3 transition-colors duration-200 hover:border-gold-300/15 hover:bg-white/[0.025] md:flex-col md:gap-3 lg:flex-row lg:gap-4"
            >
              <span className="icon-tile-on-dark h-11 w-11 transition-colors duration-200 group-hover:bg-gold-300/15 group-hover:ring-gold-300/40">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-ivory">{title}</p>
                <p className="mt-0.5 text-[15px] leading-relaxed text-pretty text-navy-200 lg:text-sm">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

export default Header
