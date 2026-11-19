import React, { useEffect, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import BrandMark from './ui/BrandMark'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  // Presentational only: the bar turns solid once the page scrolls past the hero top.
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' },
  ]

  const solid = scrolled || isOpen

  // Transparent over the hero; frosted white once scrolled; opaque white while the
  // mobile menu is open so the bar and the white panel below it read as one surface.
  let barClass = 'border-transparent bg-transparent'
  if (isOpen) barClass = 'border-slate-200 bg-white shadow-sm'
  else if (scrolled) barClass = 'border-slate-200 bg-white/95 shadow-sm backdrop-blur'

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-200 ${barClass}`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        {/* Brand */}
        <a
          href="#home"
          onClick={() => setIsOpen(false)}
          className="-m-1 flex rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          <BrandMark onDark={!solid} />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 lg:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={[
                    'relative inline-flex min-h-10 items-center rounded-sm text-sm font-medium transition-colors duration-200',
                    'after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold-500 after:transition-transform after:duration-200',
                    'hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 focus-visible:after:scale-x-100',
                    solid ? 'text-navy-800 hover:text-navy-950' : 'text-white/90 hover:text-white',
                  ].join(' ')}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className={['btn btn-accent', !solid && 'focus-visible:ring-offset-navy-900']
              .filter(Boolean)
              .join(' ')}
          >
            Get in touch
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={[
            '-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold-500 lg:hidden',
            solid ? 'text-navy-800 hover:bg-navy-50' : 'text-white hover:bg-white/10',
          ].join(' ')}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page pt-2 pb-6">
            <ul className="divide-y divide-slate-100">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-sm py-3 text-base font-medium text-navy-800 transition-colors duration-150 hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                  >
                    {link.name}
                    <ChevronRight size={18} className="text-slate-400" />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="btn btn-accent mt-4 w-full"
            >
              Get in touch
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
