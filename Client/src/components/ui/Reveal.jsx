import React, { useEffect, useRef, useState } from 'react'

const shouldSkipReveal = () =>
  typeof window === 'undefined' ||
  !('IntersectionObserver' in window) ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Progressive scroll-triggered reveal container using IntersectionObserver.
 * Falls back cleanly to visible state when prefers-reduced-motion is enabled.
 */
const Reveal = ({ children, delay = 0, className = '', as: Tag = 'div' }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(shouldSkipReveal)

  useEffect(() => {
    if (visible) return undefined
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={['reveal-base', visible && 'reveal-visible', className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  )
}

export default Reveal
