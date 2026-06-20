import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

// Remitente visible. Pon MAIL_FROM=info@wellnessreal.es (con el dominio
// verificado en Resend). Por defecto cae a la cuenta de Gmail.
function fromAddress(): string {
  const mailFrom = process.env.MAIL_FROM
  if (mailFrom) return mailFrom.includes('<') ? mailFrom : `WellnessReal <${mailFrom}>`
  return `WellnessReal <${process.env.GMAIL_USER}>`
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  const recipients = Array.isArray(to) ? to : [to]
  const from = fromAddress()

  // --- Resend (recomendado): envía desde tu dominio verificado, sin buzón ---
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })
    if (!res.ok) {
      const detail = await res.text()
      throw new Error(`[email:resend] ${res.status} ${detail}`)
    }
    return
  }

  // --- Fallback: Gmail SMTP (lo que había hasta ahora) ---
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
  await transporter.sendMail({
    from,
    to: recipients.join(', '),
    subject,
    html,
    replyTo,
  })
}
