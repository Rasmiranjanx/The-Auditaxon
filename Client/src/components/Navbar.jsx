import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import siteConfig from '../config/site'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
  ]

  return (
    <div className="absolute top-0 left-0 w-full z-20">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-3">
          <img
            src={assets.AuditLogo}
            alt={siteConfig.name}
            className="h-16 w-16 rounded-full object-cover border border-white/30"
          />

          <span
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            {siteConfig.name}
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-7 text-white font-semibold">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="cursor-pointer text-white hover:text-gray-300 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Login */}
        <Link
          to="/login"
          className="hidden md:block bg-white px-8 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Login
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/90 flex flex-col items-center gap-6 py-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white text-lg font-semibold hover:text-gray-300 transition"
            >
              {link.name}
            </a>
          ))}

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="bg-white px-8 py-2 rounded-full mt-2 font-semibold hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navbar
