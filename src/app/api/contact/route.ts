import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'
import { escapeHtml, sanitizeHeader } from '@/lib/utils/escapeHtml'
import { captureLead } from '@/lib/leadCapture'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().transform(value => value.toLowerCase().trim()),
  phone: z.string().trim().min(9).max(30),
  subject: z.string().trim().min(5).max(200),
  message: z.string().trim().min(10).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(`contact:${getClientIp(request)}`, 5, 15 * 60 * 1000)
    if (!limit.success) return NextResponse.json({ error: 'Has enviado varias consultas. Espera unos minutos antes de repetir.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } })
    const parsed = contactSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const data = parsed.data
    await captureLead({ request, email: data.email, name: data.name, phone: data.phone, source: 'contacto' })
    const name = escapeHtml(data.name), email = escapeHtml(data.email), phone = escapeHtml(data.phone)
    const subject = escapeHtml(data.subject), message = escapeHtml(data.message)
    await sendEmail({
      to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
      replyTo: data.email,
      subject: `[WellnessReal] ${sanitizeHeader(data.subject)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #16122B; padding: 20px; text-align: center;">
            <h1 style="color: #FCEE21; margin: 0;">Nuevo mensaje de contacto</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #16122B; border-bottom: 2px solid #662D91; padding-bottom: 10px;">
              Datos del contacto
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Nombre:</td>
                <td style="padding: 10px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Teléfono:</td>
                <td style="padding: 10px 0;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Asunto:</td>
                <td style="padding: 10px 0;">${subject}</td>
              </tr>
            </table>

            <h3 style="color: #16122B; margin-top: 20px;">Mensaje:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #FCEE21; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background: #16122B; padding: 15px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">
              Este mensaje fue enviado desde el formulario de contacto de wellnessreal.es
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente'
    })

  } catch (error) {
    console.error('[Contact:POST] Error procesando la consulta', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
