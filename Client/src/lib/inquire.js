const INQUIRE_EVENT = 'auditaxon:inquire'

/**
 * Smoothly scrolls to the Contact section and pre-fills the inquiry subject.
 * @param {string} subject
 */
export const requestServiceConsultation = (subject) => {
  window.dispatchEvent(new CustomEvent(INQUIRE_EVENT, { detail: { subject } }))
  const target = document.getElementById('contact')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export const subscribeToInquiry = (handler) => {
  const listener = (event) => {
    if (event.detail?.subject) handler(event.detail.subject)
  }
  window.addEventListener(INQUIRE_EVENT, listener)
  return () => window.removeEventListener(INQUIRE_EVENT, listener)
}
