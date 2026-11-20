import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import BrandMark from './ui/BrandMark'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  // Presentational only: the bar turns solid once the page scrolls past the hero top.
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Presentational only: Escape closes the open mobile menu and returns focus to the toggle.
  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' },
  ]

  const solid = scrolled || isOpen
  // Focus indicators need 3:1 against their background: gold over the navy hero,
  // navy once the bar (or the mobile panel) is white.
  const focusOutline = solid ? 'focus-visible:outline-navy-700' : 'focus-visible:outline-gold-500'

  // Transparent over the hero; frosted white once scrolled; opaque white while the
  // mobile menu is open so the bar and the white panel below it read as one surface.
  let barClass = 'border-transparent bg-transparent'
  if (isOpen) barClass = 'border-slate-200 bg-white shadow-sm'
  else if (scrolled) barClass = 'border-slate-200 bg-white/95 shadow-sm backdrop-blur'

  return (
    <>
      {/* Scrim: dims the page under the open mobile menu; tapping it closes the menu */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden"
        />
      )}

      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-50 border-b transition duration-200 ${barClass}`}
      >
        <div className="container-page flex h-18 items-center justify-between gap-6">
          {/* Brand */}
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className={`-m-1 flex rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 ${focusOutline}`}
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
                      'hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:after:scale-x-100',
                      focusOutline,
                      solid
                        ? 'text-navy-800 hover:text-navy-950'
                        : 'text-white/90 hover:text-white',
                    ].join(' ')}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={[
                'btn btn-accent',
                solid ? 'focus-visible:ring-navy-800' : 'focus-visible:ring-offset-navy-900',
              ].join(' ')}
            >
              Get in touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            type="button"
            className={[
              '-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-2 lg:hidden',
              focusOutline,
              solid ? 'text-navy-800 hover:bg-navy-50' : 'text-white hover:bg-white/10',
            ].join(' ')}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls={isOpen ? 'mobile-menu' : undefined}
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
                      className="flex min-h-12 items-center justify-between rounded-sm py-3 text-base font-medium text-navy-800 transition-colors duration-150 hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
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
                className="btn btn-accent mt-4 w-full focus-visible:ring-navy-800"
              >
                Get in touch
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
