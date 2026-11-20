import React, { useState } from 'react'
import api from '../lib/api'
import siteConfig, { hasValue, isFirmOpenNow } from '../config/site'
import {
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

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

const infoLabelClass = 'text-xs font-semibold tracking-wider text-slate-600 uppercase'
const infoLinkClass = 'link -mx-1 -my-2 inline-block px-1 py-2 [overflow-wrap:anywhere]'

const InfoRow = ({ icon: Icon, label, aside, children }) => (
  <li className="flex items-start gap-4">
    <span className="icon-tile bg-white">
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
    </span>
    <div className="min-w-0 pt-0.5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <p className={infoLabelClass}>{label}</p>
        {aside}
      </div>
      <div className="mt-1 text-base leading-relaxed text-ink">{children}</div>
    </div>
  </li>
)

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: '' })

    try {
      await api.post('/contact', formData)
      setStatus({ loading: false, success: true, error: '' })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      })
    }
  }

  const openNow = isFirmOpenNow()

  return (
    <section id="contact" className="section bg-paper">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Ways to reach the firm */}
          <div className="lg:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="Contact"
              title="Contact Us"
              lead="Have a question or need our services? Reach out and we'll get back to you soon."
            />

            <ul className="mt-10 space-y-7">
              <InfoRow icon={Mail} label="Email">
                <a href={`mailto:${siteConfig.contact.primaryEmail}`} className={infoLinkClass}>
                  {siteConfig.contact.primaryEmail}
                </a>
              </InfoRow>

              {phoneNumbers.length > 0 && (
                <InfoRow icon={Phone} label="Phone">
                  {phoneNumbers.map((number) => (
                    <span key={number} className="block">
                      <a href={toTelHref(number)} className={infoLinkClass}>
                        {number}
                      </a>
                    </span>
                  ))}
                </InfoRow>
              )}

              <InfoRow icon={MapPin} label="Office">
                <address className="not-italic">
                  {officeLines.map((line) => (
                    <AddressLine key={line} text={line} />
                  ))}
                </address>
                {hasValue(mapsUrl) && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link -mx-1 -mb-2.5 inline-flex items-center gap-1 px-1 py-2.5 text-sm"
                  >
                    View on Google Maps
                    <ArrowUpRight size={15} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </InfoRow>

              <InfoRow
                icon={Clock}
                label="Business hours"
                aside={
                  <span className={`badge ${openNow ? 'badge-green' : 'badge-slate'}`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${openNow ? 'bg-emerald-500' : 'bg-slate-400'}`}
                      aria-hidden="true"
                    />
                    {openNow ? 'Open now' : 'Closed'}
                  </span>
                }
              >
                <p>{siteConfig.businessHours.workingDaysLabel}</p>
                <p className="text-sm text-slate-600">
                  {siteConfig.businessHours.workingHoursLabel}
                </p>
              </InfoRow>
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-10 border-t border-paper-edge pt-8">
                <p className={infoLabelClass}>Follow us</p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${siteConfig.name} on ${label}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-navy-800 shadow-sm transition-colors duration-200 hover:border-navy-300 hover:bg-navy-50 focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
                      >
                        <Icon size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Enquiry form */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-ink">Send us a message</h3>
              <p className="mt-2 text-sm text-pretty text-slate-600">
                All fields are required unless marked optional.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="form-label">
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="form-label">
                    Phone <span className="font-normal text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="Best number to reach you"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="form-label">
                    Subject <span className="font-normal text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    placeholder="e.g. GST registration"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-control resize-y"
                  ></textarea>
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="btn btn-primary w-full"
                  >
                    <Send size={16} aria-hidden="true" />
                    {status.loading ? 'Sending...' : 'Send Message'}
                  </button>

                  {status.success && (
                    <p role="status" className="alert alert-success">
                      <CircleCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </p>
                  )}
                  {status.error && (
                    <p role="alert" className="alert alert-error">
                      <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{status.error}</span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Office location: embedded Google Maps listing for the firm */}
        {hasValue(siteConfig.location.googleMapsEmbedUrl) && (
          <div className="card mt-12 overflow-hidden lg:mt-16">
            <iframe
              src={siteConfig.location.googleMapsEmbedUrl}
              title="Map showing The Auditaxon office in Hansapal, Bhubaneswar"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-72 w-full border-0 sm:h-96"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default Contact
