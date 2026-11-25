import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock, LockKeyhole, Mail, MapPin, Phone } from 'lucide-react'
import siteConfig, { hasValue } from '../config/site'
import BrandMark from './ui/BrandMark'

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size}
    height={props.size}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size}
    height={props.size}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const FacebookIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size}
    height={props.size}
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Team', href: '#team' },
  { label: 'Process & FAQ', href: '#approach' },
  { label: 'Careers', href: '#careers' },
  { label: 'Leave a review', href: '#feedback' },
  { label: 'Contact', href: '#contact' },
]

const serviceTitles = [
  'Direct Tax',
  'Indirect Tax / GST',
  'Audit & Assurance',
  'Company Registration',
  'Bookkeeping',
  'Financial Advisory',
]

const socialLinks = [
  { label: 'LinkedIn', href: siteConfig.socialLinks.linkedin, Icon: LinkedinIcon },
  { label: 'Instagram', href: siteConfig.socialLinks.instagram, Icon: InstagramIcon },
  { label: 'Facebook', href: siteConfig.socialLinks.facebook, Icon: FacebookIcon },
].filter((social) => hasValue(social.href))

// Only confirmed details render; "TODO" placeholders in the site config stay hidden.
const phoneNumbers = [
  ...new Set([siteConfig.contact.phone, siteConfig.contact.mobile].filter(hasValue)),
]
const officeLines = [
  siteConfig.location.addressLine1,
  hasValue(siteConfig.location.addressLine2)
    ? siteConfig.location.addressLine2
    : `${siteConfig.location.city}, ${siteConfig.location.state}`,
].filter(hasValue)
const mapsUrl = siteConfig.location.googleMapsUrl
const firmRegistrationNumber = siteConfig.icai.firmRegistrationNumber
const toTelHref = (number) => `tel:${number.replace(/[^\d+]/g, '')}`

// Address lines wrap only after commas, so phrases such as "Puri Canal Rd" stay together.
const AddressLine = ({ text }) => (
  <span className="block text-balance">
    {text.split(', ').map((part, index, parts) => (
      <React.Fragment key={`${index}-${part}`}>
        {index > 0 && ' '}
        <span className={part.length <= 28 ? 'whitespace-nowrap' : undefined}>
          {index < parts.length - 1 ? `${part},` : part}
        </span>
      </React.Fragment>
    ))}
  </span>
)

// The first sentence of the firm description makes a compact intro line.
const sentenceEnd = siteConfig.description.indexOf('. ')
const shortDescription =
  sentenceEnd === -1 ? siteConfig.description : siteConfig.description.slice(0, sentenceEnd + 1)

const headingClass = 'text-sm font-semibold tracking-wide text-white'
const focusRing =
  'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none'
const linkBaseClass = `-mx-1.5 inline-flex min-h-10 min-w-10 items-center px-1.5 text-sm transition-colors duration-200 ${focusRing}`
const linkClass = `${linkBaseClass} text-navy-200 hover:text-white`
const iconClass = 'shrink-0 text-gold-400'

const Footer = () => {
  return (
    <footer className="border-t border-gold-300/20 bg-navy-950 pt-16 pb-8 text-navy-200">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-x-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a
              href="#home"
              aria-label={`${siteConfig.name}, back to top`}
              className="inline-flex rounded-lg focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950 focus-visible:outline-none"
            >
              <BrandMark onDark showTagline />
            </a>
            <p className="mt-6 text-sm font-medium text-white">{siteConfig.tagline}</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-navy-200/80">
              {shortDescription}
            </p>

            {socialLinks.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${label}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-navy-200 transition-colors duration-200 hover:border-white/40 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 focus-visible:outline-none"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick links */}
          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className={headingClass}>
              Quick links
            </h2>
            <ul className="mt-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className={headingClass}>
              Services
            </h2>
            <ul className="mt-3">
              {serviceTitles.map((title) => (
                <li key={title}>
                  <a href="#services" className={linkClass}>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h2 className={headingClass}>Contact</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.primaryEmail}`}
                  className={`${linkClass} gap-3`}
                >
                  <Mail size={16} className={iconClass} aria-hidden="true" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    {siteConfig.contact.primaryEmail}
                  </span>
                </a>
              </li>
              {phoneNumbers.map((number) => (
                <li key={number}>
                  <a href={toTelHref(number)} className={`${linkClass} gap-3`}>
                    <Phone size={16} className={iconClass} aria-hidden="true" />
                    <span>{number}</span>
                  </a>
                </li>
              ))}
              <li className="flex gap-3 py-2">
                <MapPin size={16} className={`${iconClass} mt-0.5`} aria-hidden="true" />
                <div className="min-w-0">
                  <address className="leading-relaxed not-italic">
                    {officeLines.map((line) => (
                      <AddressLine key={line} text={line} />
                    ))}
                  </address>
                  {hasValue(mapsUrl) && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkBaseClass} -mb-2 gap-1.5 font-medium text-gold-400 hover:text-gold-300`}
                    >
                      Get directions
                      <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
              <li className="flex gap-3 py-2">
                <Clock size={16} className={`${iconClass} mt-0.5`} aria-hidden="true" />
                <span>
                  <span className="block">{siteConfig.businessHours.workingDaysLabel}</span>
                  <span className="block text-navy-300">
                    {siteConfig.businessHours.workingHoursLabel}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-gold-300/15 pt-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between sm:pr-16">
          <p className="leading-relaxed">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            {hasValue(firmRegistrationNumber) && (
              <>
                <span className="mx-2 text-navy-500" aria-hidden="true">
                  ·
                </span>
                <span className="whitespace-nowrap">ICAI FRN: {firmRegistrationNumber}</span>
              </>
            )}
          </p>
          <Link
            to="/login"
            className="group inline-flex min-h-11 items-center gap-2.5 self-start rounded border border-gold-400/50 bg-gold-400/10 px-4 text-sm font-semibold text-gold-300 transition-colors duration-200 hover:border-gold-300 hover:bg-gold-400 hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 focus-visible:outline-none sm:self-auto"
          >
            <LockKeyhole size={16} aria-hidden="true" />
            Admin login
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
