import React from 'react'

/**
 * Consistent section heading used across the public site:
 * gold eyebrow label, serif title and an optional lead paragraph.
 *
 * @param {string}  eyebrow  Short uppercase label above the title (optional)
 * @param {node}    title    Section title
 * @param {node}    lead     Supporting paragraph (optional)
 * @param {'center'|'left'} align
 * @param {boolean} onDark   Use on navy backgrounds
 * @param {string}  as       Heading element for the title (default h2)
 */
const SectionHeader = ({
  eyebrow,
  title,
  lead,
  align = 'center',
  onDark = false,
  as: Heading = 'h2',
  className = '',
}) => {
  const centered = align === 'center'

  const wrapperClass = [centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className]
    .filter(Boolean)
    .join(' ')
  const eyebrowClass = ['eyebrow', centered && 'eyebrow-centered', onDark && 'eyebrow-on-dark']
    .filter(Boolean)
    .join(' ')
  const titleClass = ['section-title', eyebrow && 'mt-4', onDark && 'text-white']
    .filter(Boolean)
    .join(' ')
  const leadClass = ['section-lead mt-4', onDark && 'text-navy-100/80'].filter(Boolean).join(' ')

  return (
    <div className={wrapperClass}>
      {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
      <Heading className={titleClass}>{title}</Heading>
      {lead && <p className={leadClass}>{lead}</p>}
    </div>
  )
}

export default SectionHeader
