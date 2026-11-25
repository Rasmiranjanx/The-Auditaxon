import React, { useState } from 'react'
import { ChevronDown, ShieldCheck } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Scope',
    text: 'We understand your business structure, compliance calendar, and financial goals.',
  },
  {
    step: '02',
    title: 'Document & Risk Audit',
    text: 'Thorough review of ledgers, past filings, and statutory obligations to spot gaps early.',
  },
  {
    step: '03',
    title: 'Precision Execution',
    text: 'Timely preparation, dual-level verification, and filing of returns, audits, or registrations.',
  },
  {
    step: '04',
    title: 'Ongoing Advisory',
    text: 'Year-round partner support for notices, cash-flow planning, and regulatory changes.',
  },
]

const faqs = [
  {
    q: 'How do I schedule an initial consultation with The Auditaxon?',
    a: 'Use the inquiry form in the Contact section below, select a practice area from our Services, or call us directly during business hours (Monday to Saturday, 10:00 AM – 7:00 PM IST).',
  },
  {
    q: 'Do you serve clients outside Bhubaneswar and Odisha?',
    a: 'Yes. While our office is located in Hansapal, Bhubaneswar, we support businesses, startups, and individuals across India through secure digital documentation and online consultations.',
  },
  {
    q: 'What businesses do you assist with Company Registration and GST?',
    a: 'We work with solo founders, partnerships, LLPs, Private Limited companies, and established SMEs — handling everything from entity incorporation and MSME registration to monthly GST returns and annual audits.',
  },
  {
    q: 'How is client financial data kept confidential?',
    a: 'Every engagement follows strict professional ethics and chartered accountancy confidentiality standards. Financial records and documents are handled solely by authorized team members.',
  },
  {
    q: 'Can you help resolve pending tax notices or GST reconciliation issues?',
    a: 'Yes. Our Direct and Indirect Tax specialists audit mismatched ITC claims, reconcile GSTR filings, draft responses, and represent clients through assessment proceedings.',
  },
]

const ApproachFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="approach" className="section bg-paper">
      <div className="container-page">
        {/* 4-Step Engagement Process Band */}
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-gold-300/20 bg-navy-950 p-7 text-ivory shadow-xl sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-gold-400)_0%,transparent_55%)] opacity-[0.12]"
            />
            <div
              aria-hidden="true"
              className="pattern-hex pattern-fade pointer-events-none absolute inset-0"
            />

            <div className="relative">
              <div className="flex flex-col justify-between gap-4 border-b border-gold-300/15 pb-8 lg:flex-row lg:items-end">
                <div>
                  <p className="eyebrow eyebrow-on-dark">How we work</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
                    A disciplined engagement process
                  </h2>
                </div>
                <p className="inline-flex items-center gap-2 text-sm text-navy-200">
                  <ShieldCheck size={17} className="shrink-0 text-gold-300" aria-hidden="true" />
                  Structured workflows for zero missed deadlines
                </p>
              </div>

              <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((item) => (
                  <li
                    key={item.step}
                    className="rounded border border-gold-300/15 bg-white/[0.03] p-5 backdrop-blur-xs transition-colors duration-200 hover:border-gold-300/40 hover:bg-white/[0.06]"
                  >
                    <span className="font-display text-2xl font-semibold text-gold-300">
                      {item.step}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold text-ivory">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-navy-200/90">{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Frequently Asked Questions */}
        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="Clarity first"
              title="Frequently Asked Questions"
              lead="Straightforward answers on how we engage, onboard, and safeguard your compliance."
            />
            <div className="mt-6 rounded-lg border border-paper-edge bg-ivory p-5 shadow-2xs">
              <p className="text-sm font-semibold text-ink">Have a specific compliance question?</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Every business has unique statutory nuances. Reach out and a partner will respond
                with tailored guidance.
              </p>
              <a href="#contact" className="link mt-3 inline-flex items-center text-sm">
                Ask our advisory desk &rarr;
              </a>
            </div>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-7">
            <div className="divide-y divide-paper-edge overflow-hidden rounded-lg border border-paper-edge bg-white shadow-sm">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx
                const panelId = `faq-panel-${idx}`
                const buttonId = `faq-button-${idx}`
                return (
                  <div key={faq.q}>
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-ivory focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:outline-none focus-visible:ring-inset"
                      >
                        <span className="text-base font-semibold text-ink">{faq.q}</span>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className={[
                            'shrink-0 text-gold-600 transition-transform duration-200',
                            isOpen && 'rotate-180',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      </button>
                    </h3>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="border-t border-paper-edge/60 bg-paper/40 px-6 py-4 text-[15px] leading-relaxed text-slate-600"
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ApproachFAQ
