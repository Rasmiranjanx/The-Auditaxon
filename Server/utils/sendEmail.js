const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  await resend.emails.send({
    from: "The Audit Axon <onboarding@resend.dev>",
    to: toEmail,
    subject: "Reset your password - The Audit Axon",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
};

module.exports = sendPasswordResetEmail;