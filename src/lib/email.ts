import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
  idempotencyKey?: string
}

export class EmailDeliveryError extends Error {
  constructor(public status: number) {
    super(`[Email:send] El proveedor rechazó el envío (${status})`)
  }
}

// Remitente visible. Pon MAIL_FROM=info@wellnessreal.es (con el dominio
// verificado en Resend). Por defecto cae a la cuenta de Gmail.
function fromAddress(): string {
  const mailFrom = process.env.MAIL_FROM
  if (mailFrom) return mailFrom.includes('<') ? mailFrom : `WellnessReal <${mailFrom}>`
  return `WellnessReal <${process.env.GMAIL_USER}>`
}

export async function sendEmail({ to, subject, html, replyTo, idempotencyKey }: SendEmailOptions) {
  const recipients = Array.isArray(to) ? to : [to]
  const from = fromAddress()

  // --- Resend (recomendado): envía desde tu dominio verificado, sin buzón ---
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(15_000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
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
      throw new EmailDeliveryError(res.status)
    }
    return
  }

  // --- Fallback: Gmail SMTP (lo que había hasta ahora) ---
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
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

/** Solo para correos posteriores a una captura ya guardada. */
export async function sendLeadEmail(options: SendEmailOptions): Promise<boolean> {
  const deliveryId = crypto.randomUUID()
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await sendEmail({ ...options, idempotencyKey: deliveryId })
      return true
    } catch (error) {
      const smtpStatus = error && typeof error === 'object' && 'responseCode' in error
        ? Number(error.responseCode) : null
      const retryable = error instanceof EmailDeliveryError
        ? error.status === 429 || error.status >= 500
        : smtpStatus !== null && smtpStatus >= 400 && smtpStatus < 500
      const retry = retryable && attempt < 3
      console.error('[LeadEmail:delivery] Envío rechazado o no confirmado', {
        deliveryId, attempt, retry, status: error instanceof EmailDeliveryError ? error.status : smtpStatus,
      })
      if (!retry) return false
      await new Promise((resolve) => setTimeout(resolve, attempt * 500))
    }
  }
  return false
}
