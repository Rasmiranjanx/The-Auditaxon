import React from 'react'
import { assets } from '../assets/assets'
import { Mail, MapPin } from 'lucide-react'
import siteConfig from '../config/site'

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
    strokeWidth="2"
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
    strokeWidth="2"
    width={props.size}
    height={props.size}
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const Footer = () => {
  return (
    <footer className="bg-black text-slate-400 pt-16 pb-8 px-6 md:px-20 lg:px-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={assets.AuditLogo}
              alt={siteConfig.name}
              className="h-10 w-10 rounded-full object-cover border border-white/30"
            />
            <span
              className="text-white text-lg font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {siteConfig.name}
            </span>
          </div>
          <p className="text-sm">{siteConfig.tagline}</p>
          <p className="text-xs text-slate-500 mt-2">
            ICAI FRN: {siteConfig.icai.firmRegistrationNumber}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="#home" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-white transition">
                Services
              </a>
            </li>
            <li>
              <a href="#team" className="hover:text-white transition">
                Team
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:text-white transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a
                href={`mailto:${siteConfig.contact.primaryEmail}`}
                className="hover:text-white transition"
              >
                {siteConfig.contact.primaryEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{siteConfig.location.addressLine2}</span>
            </li>
            <li className="text-xs text-slate-500 mt-1">
              Hours: {siteConfig.businessHours.display}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href={siteConfig.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href={siteConfig.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              <FacebookIcon size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
