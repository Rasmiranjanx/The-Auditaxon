import React from 'react'
import {
  Calculator,
  ReceiptIndianRupee,
  ClipboardCheck,
  Building2,
  BookOpenText,
  ChartLine,
} from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

const services = [
  {
    icon: Calculator,
    title: 'Direct Tax',
    description: 'Income tax planning, filing, and advisory for individuals and businesses.',
  },
  {
    icon: ReceiptIndianRupee,
    title: 'Indirect Tax / GST',
    description: 'GST registration, return filing, and compliance management.',
  },
  {
    icon: ClipboardCheck,
    title: 'Audit & Assurance',
    description: 'Statutory, internal, and tax audits conducted with precision.',
  },
  {
    icon: Building2,
    title: 'Company Registration',
    description: 'End-to-end support for incorporating and structuring your business.',
  },
  {
    icon: BookOpenText,
    title: 'Bookkeeping',
    description: 'Accurate, up-to-date books so you always know where you stand.',
  },
  {
    icon: ChartLine,
    title: 'Financial Advisory',
    description: 'Strategic guidance to help your business grow with confidence.',
  },
]

const Services = () => {
  return (
    <section id="services" className="section bg-paper text-pretty">
      <div className="container-page">
        <SectionHeader
          eyebrow="What we do"
          title="Our Services"
          lead="Comprehensive financial and compliance solutions tailored to your business needs."
          className="text-balance"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <li
                key={index}
                className="group card card-interactive relative flex gap-4 overflow-hidden p-5 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-gold-500 before:transition-transform before:duration-200 hover:before:scale-x-100 sm:flex-col sm:gap-6 sm:p-7"
              >
                <span className="icon-tile transition-colors duration-200 group-hover:bg-navy-800 group-hover:text-gold-400 group-hover:ring-navy-800">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{service.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600 sm:mt-2">
                    {service.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Services
