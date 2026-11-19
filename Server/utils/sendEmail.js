const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  await resend.emails.send({
    from: process.env.MAIL_FROM || 'The Auditaxon <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Reset your password - The Auditaxon',
    html: `
      <h2>The Auditaxon - Password Reset Request</h2>
      <p>You requested a password reset for your administrator account.</p>
      <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
      <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  })
}

module.exports = sendPasswordResetEmail
