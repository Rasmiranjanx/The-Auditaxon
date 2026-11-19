import React from 'react'
import siteConfig from '../../config/site'

// Hexagon logo mark (cropped from the full logo), served from /public.
const MARK_SRC = '/the-auditaxon-mark.svg'

const SIZES = {
  md: {
    badge: 'h-10 w-10',
    word: 'text-[13px] tracking-[0.22em]',
    tagline: 'text-[9px] tracking-[0.2em]',
  },
  lg: {
    badge: 'h-14 w-14',
    word: 'text-base tracking-[0.24em]',
    tagline: 'text-[10px] tracking-[0.22em]',
  },
}

/**
 * Brand lockup: logo mark in a white badge plus the "THE AUDITAXON" wordmark.
 * Wrap it in a link at the call site when it should navigate.
 *
 * @param {boolean} onDark        Light text for navy backgrounds
 * @param {'md'|'lg'} size
 * @param {boolean} showWordmark  Hide to render the mark alone
 * @param {boolean} showTagline   Adds "Expertise · Precision · Integrity" under the wordmark
 */
const BrandMark = ({
  onDark = false,
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
}) => {
  const s = SIZES[size] || SIZES.md

  return (
    <span className={['inline-flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <span
        className={[
          s.badge,
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1',
          onDark ? 'ring-white/20' : 'ring-slate-200',
        ].join(' ')}
      >
        <img
          src={MARK_SRC}
          alt={showWordmark ? '' : siteConfig.name}
          className="h-full w-full object-contain"
        />
      </span>

      {showWordmark && (
        <span className="flex flex-col gap-1.5 leading-none">
          <span
            className={[
              s.word,
              'font-semibold whitespace-nowrap uppercase',
              onDark ? 'text-white' : 'text-navy-800',
            ].join(' ')}
          >
            {siteConfig.name}
          </span>
          {showTagline && (
            <span
              className={[
                s.tagline,
                'font-medium whitespace-nowrap uppercase',
                onDark ? 'text-navy-200' : 'text-slate-500',
              ].join(' ')}
            >
              Expertise · Precision · Integrity
            </span>
          )}
        </span>
      )}
    </span>
  )
}

export default BrandMark
