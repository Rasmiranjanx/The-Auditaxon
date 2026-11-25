import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import BrandMark from './ui/BrandMark'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Team', href: '#team' },
  { name: 'Careers', href: '#careers' },
  { name: 'Contact', href: '#contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const toggleRef = useRef(null)

  useEffect(() => {
    const sectionIds = [
      'home',
      'about',
      'services',
      'team',
      'approach',
      'feedback',
      'careers',
      'contact',
    ]
    const hrefMap = {
      home: '',
      about: '#about',
      services: '#services',
      team: '#team',
      approach: '',
      feedback: '',
      careers: '#careers',
      contact: '#contact',
    }

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 16)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0)

      if (docHeight > 0 && y >= docHeight - 60) {
        setActiveSection('#contact')
        return
      }

      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) {
          current = hrefMap[id] ?? ''
        }
      }
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the open mobile menu and returns focus to the toggle.
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

  const solid = scrolled || isOpen
  const focusOutline = solid ? 'focus-visible:outline-navy-700' : 'focus-visible:outline-gold-500'

  let barClass = 'border-transparent bg-transparent'
  if (isOpen) barClass = 'border-paper-edge bg-ivory shadow-sm'
  else if (scrolled)
    barClass =
      'border-paper-edge bg-ivory/95 shadow-[0_6px_28px_-10px_rgba(6,9,19,0.14)] backdrop-blur-md'

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-navy-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${barClass}`}
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
          <div className="hidden items-center gap-9 lg:flex">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'location' : undefined}
                      className={[
                        'relative inline-flex min-h-10 items-center rounded-sm text-sm font-medium transition-colors duration-200',
                        'after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold-500 after:transition-transform after:duration-200',
                        isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
                        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:after:scale-x-100',
                        focusOutline,
                        solid
                          ? isActive
                            ? 'text-navy-950 font-semibold'
                            : 'text-navy-800 hover:text-navy-950'
                          : isActive
                            ? 'text-white font-semibold'
                            : 'text-white/90 hover:text-white',
                      ].join(' ')}
                    >
                      {link.name}
                    </a>
                  </li>
                )
              })}
            </ul>

            <a
              href="#contact"
              className={[
                'btn btn-accent shadow-md transition-transform duration-200 hover:-translate-y-0.5',
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

        {/* Scroll progress gold hairline */}
        {scrolled && !isOpen && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500 transition-transform duration-100"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-menu" className="border-t border-paper-edge bg-ivory lg:hidden">
            <div className="container-page pt-2 pb-6">
              <ul className="divide-y divide-paper-edge/60">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href
                  return (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={[
                          'flex min-h-12 items-center justify-between rounded-sm py-3 text-base font-medium transition-colors duration-150 hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700',
                          isActive ? 'text-gold-700 font-semibold' : 'text-navy-800',
                        ].join(' ')}
                      >
                        {link.name}
                        <ChevronRight
                          size={18}
                          className={isActive ? 'text-gold-600' : 'text-slate-400'}
                        />
                      </a>
                    </li>
                  )
                })}
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
