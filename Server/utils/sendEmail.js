const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )

// Resend reports failures by returning { error } instead of throwing; turn that into a throw.
const send = async (payload) => {
  const { data, error } = await resend.emails.send({
    from: process.env.MAIL_FROM || 'The Auditaxon <onboarding@resend.dev>',
    ...payload,
  })
  if (error) throw new Error(`Email not sent: ${error.message || error.name || 'unknown error'}`)
  return data
}

const sendPasswordResetEmail = async (toEmail, resetUrl) =>
  send({
    to: toEmail,
    subject: 'Reset your password - The Auditaxon',
    html: `
      <h2>The Auditaxon - Password Reset Request</h2>
      <p>You requested a password reset for your administrator account.</p>
      <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
      <p><a href="${escapeHtml(resetUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resetUrl)}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  })

/**
 * Emails the firm (ADMIN_NOTIFY_EMAIL) about a new enquiry, application or review.
 * Best effort: a failure is logged but never breaks the visitor's submission.
 *
 * @param {string} subject
 * @param {Record<string, unknown>} fields  label -> value rows (empty values are skipped)
 * @param {string} [replyTo]                lets the firm reply straight to the visitor
 */
const notifyAdmin = (subject, fields, replyTo) => {
  const to = process.env.ADMIN_NOTIFY_EMAIL
  if (!to) return Promise.resolve()

  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(
      ([label, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#475569;vertical-align:top;white-space:nowrap"><strong>${escapeHtml(label)}</strong></td>` +
        `<td style="padding:6px 0;color:#0b1a33;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
    )
    .join('')

  const cleanSubject = String(subject).replace(/[\r\n]+/g, ' ')

  return send({
    to,
    subject: cleanSubject,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px">
        <h2 style="color:#032967;margin:0 0 12px">${escapeHtml(cleanSubject)}</h2>
        <table style="border-collapse:collapse">${rows}</table>
        <p style="color:#64748b;margin-top:16px">Manage it in the admin dashboard.</p>
      </div>
    `,
    ...(replyTo ? { replyTo } : {}),
  }).catch((err) => console.error('[EMAIL] Admin notification failed:', err.message))
}

module.exports = sendPasswordResetEmail
module.exports.notifyAdmin = notifyAdmin
