/**
 * The Auditaxon - Central Firm Configuration
 * Single source of truth for all firm information, branding, contact info, and business hours.
 *
 * NOTE: Fields marked with "TODO" are placeholders that must be updated with
 * official firm registration records, physical office coordinates, and phone numbers.
 */

export const siteConfig = {
  name: 'The Auditaxon',
  shortName: 'Auditaxon',
  legalName: 'The Auditaxon & Associates',
  tagline: 'Strategic Taxation, Audit & Financial Advisory',
  description:
    'A premier Chartered Accountancy and financial consultancy firm in Bhubaneswar, Odisha, India. Delivering uncompromising precision in statutory audits, GST & direct tax compliance, corporate restructuring, and financial advisory.',

  // ICAI Firm Registration Details
  icai: {
    firmRegistrationNumber: 'TODO: Fill ICAI Firm Registration Number (FRN, e.g., 0XXXXXXN)',
    constitution: 'Partnership / Sole Proprietorship (TODO: Confirm constitution)',
  },

  // Contact Information
  contact: {
    primaryEmail: 'contact@theauditaxon.com',
    supportEmail: 'theauditaxon@gmail.com', // TODO: Confirm if retaining gmail or transitioning fully to domain email
    careersEmail: 'careers@theauditaxon.com',
    phone: '+91 94390 79089',
    mobile: '', // Optional second number; leave empty to show only `phone`
    whatsappNumber: '', // Country code, no plus (e.g. 919439079089); not shown on the site yet
    displayPhone: '+91 94390 79089',
  },

  // Physical Location & Jurisdiction
  location: {
    city: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    // Address formatted exactly as on the firm's Google Business Profile (keep these in sync for local SEO)
    pinCode: '752101',
    addressLine1: 'Lane no-31, Bharat Villa, Plot no- 464/10771, Puri Canal Rd, Hansapal',
    addressLine2: 'Bhubaneswar, Rudrapur, Odisha 752101',
    fullAddress:
      'Lane no-31, Bharat Villa, Plot no- 464/10771, Puri Canal Rd, Hansapal, Bhubaneswar, Rudrapur, Odisha 752101',
    // Google Maps listing for "The Auditaxon": share link (opens the live location / directions)
    googleMapsUrl: 'https://maps.app.goo.gl/sPjv5GfvwAbkCC4y7',
    // Keyless embed of the same listing (place ID / CID 0xac09386b1db5f195), pinned and labelled
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?origin=mfe&pb=!1m4!3m2!1m1!4s12396501482025120149!6i17',
    coordinates: {
      latitude: 20.3200456,
      longitude: 85.887973,
    },
  },

  // Business Hours (Indian Standard Time - IST / UTC+5:30)
  businessHours: {
    display: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
    timezone: 'Asia/Kolkata',
    workingDaysLabel: 'Monday to Saturday',
    workingHoursLabel: '10:00 AM – 7:00 PM IST',
    sunday: 'Closed',
    startHour: 10, // 10:00 AM
    endHour: 19, // 7:00 PM
    workingDays: [1, 2, 3, 4, 5, 6], // 1 = Mon, ..., 6 = Sat (0 = Sun)
  },

  // Social & Professional Profiles
  // Empty = hidden on the site. Paste the full page URL to show its icon in the Contact section and footer.
  socialLinks: {
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: '',
  },

  // Key Firm Milestones / Trust Statistics (Placeholders until confirmed)
  stats: {
    yearsOfExperience: '15+', // TODO: Confirm years of firm experience
    clientsServed: '500+', // TODO: Confirm total clients served
    auditedTurnover: '₹ 500 Cr+', // TODO: Confirm cumulative volume audited
    itrsFiled: '1,200+', // TODO: Confirm total ITRs filed
    retentionRate: '98%', // TODO: Confirm client retention rate
  },
}

/**
 * Returns true when a config value is filled in: not empty and not a "TODO" placeholder.
 * Components use this to hide unconfirmed details instead of rendering placeholder text.
 */
export const hasValue = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim() !== '' && !/\bTODO\b/i.test(value)
  return true
}

/**
 * Returns true if the firm is currently open based on IST (UTC+5:30) business hours.
 */
export const isFirmOpenNow = () => {
  try {
    const now = new Date()
    // Convert to IST
    const istString = now.toLocaleString('en-US', { timeZone: siteConfig.businessHours.timezone })
    const istDate = new Date(istString)
    const day = istDate.getDay() // 0 = Sunday
    const hour = istDate.getHours()

    const isWorkingDay = siteConfig.businessHours.workingDays.includes(day)
    const isWorkingHour =
      hour >= siteConfig.businessHours.startHour && hour < siteConfig.businessHours.endHour

    return isWorkingDay && isWorkingHour
  } catch {
    return false
  }
}

export default siteConfig
