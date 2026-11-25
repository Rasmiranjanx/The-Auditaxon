import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  Building2,
  Calculator,
  ChartLine,
  Check,
  ClipboardCheck,
  ReceiptIndianRupee,
  X,
} from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { requestServiceConsultation } from '../lib/inquire'

const CATEGORIES = [
  { id: 'all', label: 'All Practices' },
  { id: 'tax', label: 'Tax & Compliance' },
  { id: 'audit', label: 'Audit & Setup' },
  { id: 'advisory', label: 'Accounting & Advisory' },
]

const services = [
  {
    number: '01',
    category: 'tax',
    icon: Calculator,
    title: 'Direct Tax',
    description: 'Income tax planning, filing, and advisory for individuals and businesses.',
    idealFor: 'Salaried professionals, HNIs, partnership firms, and corporations',
    deliverables: [
      'Income Tax Return (ITR) computation & e-filing',
      'TDS compliance, quarterly returns & certifications',
      'Strategic tax planning & capital gains structuring',
      'Representation during scrutiny & assessments',
    ],
  },
  {
    number: '02',
    category: 'tax',
    icon: ReceiptIndianRupee,
    title: 'Indirect Tax / GST',
    description: 'GST registration, return filing, and compliance management.',
    idealFor: 'SMEs, traders, service providers, and multi-state enterprises',
    deliverables: [
      'New GST registration, amendments & LUT filings',
      'Monthly/quarterly GSTR-1, GSTR-3B & reconciliation',
      'Input Tax Credit (ITC) optimization & review',
      'Annual GSTR-9 returns & departmental notice support',
    ],
  },
  {
    number: '03',
    category: 'audit',
    icon: ClipboardCheck,
    title: 'Audit & Assurance',
    description: 'Statutory, internal, and tax audits conducted with precision.',
    idealFor: 'Private limited companies, LLPs, trusts, and growing enterprises',
    deliverables: [
      'Statutory audits under the Companies Act',
      'Tax audits under Section 44AB of the Income Tax Act',
      'Internal control reviews & risk assessments',
      'Financial statement verification & certification',
    ],
  },
  {
    number: '04',
    category: 'audit',
    icon: Building2,
    title: 'Company Registration',
    description: 'End-to-end support for incorporating and structuring your business.',
    idealFor: 'Founders, startups, joint ventures, and expanding business groups',
    deliverables: [
      'Private Limited, LLP, OPC & Partnership incorporation',
      'PAN, TAN, MSME / Udyam & Startup registrations',
      'ROC annual filings & secretarial compliance',
      'Entity structuring & MOA / AOA drafting support',
    ],
  },
  {
    number: '05',
    category: 'advisory',
    icon: BookOpenText,
    title: 'Bookkeeping',
    description: 'Accurate, up-to-date books so you always know where you stand.',
    idealFor: 'Businesses seeking audit-ready ledgers and monthly visibility',
    deliverables: [
      'Day-to-day ledger maintenance & bank reconciliation',
      'Accounts payable / receivable tracking',
      'Monthly MIS reports, P&L & balance sheet prep',
      'Year-end closing & audit-ready schedules',
    ],
  },
  {
    number: '06',
    category: 'advisory',
    icon: ChartLine,
    title: 'Financial Advisory',
    description: 'Strategic guidance to help your business grow with confidence.',
    idealFor: 'Decision-makers planning expansion, financing, or restructuring',
    deliverables: [
      'Cash flow forecasting & working capital planning',
      'Project reports & CMA data for bank financing',
      'Business valuation & profitability analysis',
      'Regulatory governance & compliance roadmaps',
    ],
  },
]

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedService, setSelectedService] = useState(null)
  const dialogRef = useRef(null)

  const filteredServices =
    activeCategory === 'all' ? services : services.filter((s) => s.category === activeCategory)

  useEffect(() => {
    if (!selectedService) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedService])

  return (
    <section id="services" className="section bg-paper text-pretty">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="What we do"
            title="Our Services"
            lead="Comprehensive financial and compliance solutions tailored to your business needs."
            className="text-balance"
          />

          {/* Interactive Practice Filter */}
          <div
            role="tablist"
            aria-label="Filter practice areas"
            className="mt-9 flex flex-wrap items-center justify-center gap-2"
          >
            {CATEGORIES.map((cat) => {
              const selected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveCategory(cat.id)}
                  className={[
                    'rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:outline-none sm:text-sm',
                    selected
                      ? 'bg-navy-900 text-ivory shadow-sm'
                      : 'border border-paper-edge bg-white text-slate-600 hover:border-gold-300 hover:text-navy-900',
                  ].join(' ')}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {filteredServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Reveal key={service.title} as="li" delay={index * 60}>
                <article className="group card-luxury relative flex h-full flex-col overflow-hidden p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-gold-500 before:transition-transform before:duration-300 hover:before:scale-x-100 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="icon-tile transition-colors duration-200 group-hover:bg-navy-900 group-hover:text-gold-300 group-hover:ring-navy-900">
                      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-xl font-semibold text-paper-edge transition-colors duration-200 group-hover:text-gold-400"
                    >
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2 border-t border-paper-edge/70 pt-4 text-sm text-slate-600">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check
                          size={15}
                          strokeWidth={2.25}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-gold-600"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-paper-edge/70 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-semibold tracking-wider text-slate-600 uppercase transition-colors hover:text-navy-900 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:outline-none"
                    >
                      View full scope
                    </button>

                    <button
                      type="button"
                      onClick={() => requestServiceConsultation(`${service.title} — Consultation`)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-gold-700 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:outline-none"
                    >
                      Inquire
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>

      {/* Service Scope Quick-View Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedService(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-lg border border-paper-edge bg-ivory shadow-2xl focus:outline-none"
          >
            <div className="border-b border-gold-300/15 bg-navy-950 px-6 py-5 text-ivory">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-gold-300 uppercase">
                    Practice Scope · {selectedService.number}
                  </p>
                  <h3
                    id="service-modal-title"
                    className="mt-1.5 font-display text-3xl font-semibold"
                  >
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  aria-label="Close service details"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-base leading-relaxed text-slate-600">
                {selectedService.description}
              </p>

              <div className="mt-5 rounded-lg border border-paper-edge bg-paper px-4 py-3">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Ideal for
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{selectedService.idealFor}</p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Key deliverables
                </p>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
                  {selectedService.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-gold-600"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="btn btn-outline"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = selectedService.title
                    setSelectedService(null)
                    requestServiceConsultation(`${title} — Consultation`)
                  }}
                  className="btn btn-accent"
                >
                  Request consultation
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Services
