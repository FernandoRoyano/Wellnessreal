import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  // El remitente visible. Por defecto = la cuenta que autentica el envío
  // (GMAIL_USER), para que SPF/DKIM siempre cuadren. Si pones MAIL_FROM,
  // asegúrate de que ese buzón esté autenticado/verificado para el dominio,
  // o el correo irá a spam igual.
  const fromAddress = process.env.MAIL_FROM || process.env.GMAIL_USER
  const from = `WellnessReal <${fromAddress}>`

  await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
    replyTo,
  })
}
