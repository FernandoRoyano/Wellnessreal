import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { captureLead } from '@/lib/leadCapture'
import { recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().transform((value) => value.toLowerCase().trim()),
  _attribution: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      referrer: z.string().optional(),
      landing_page: z.string().optional(),
      fbc: z.string().optional(),
      fbp: z.string().optional(),
    })
    .optional(),
})

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }
    return entities[character]
  })
}

export async function POST(request: NextRequest) {
  try {
    const parsed = registrationSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Revisa tu nombre y tu email.' }, { status: 400 })
    }

    const { name, email, _attribution } = parsed.data
    const lead = await captureLead({
      request,
      email,
      name,
      source: 'tiroides',
      attribution: _attribution,
      form_data: { funnel: 'thyroid-vsl' },
      tags: ['via:tiroides', 'form:thyroid-vsl'],
    })

    // La medición no puede tumbar el registro: si falla, el usuario debe
    // recibir igualmente el email con la clase.
    try {
      await recordThyroidFunnelEvent({
        eventName: 'thyroid_vsl_registration',
        leadId: lead?.id ?? null,
        email,
        source: _attribution?.utm_source ?? null,
        medium: _attribution?.utm_medium ?? null,
        campaign: _attribution?.utm_campaign ?? null,
        metadata: { landing_page: _attribution?.landing_page ?? '/tiroides/clase' },
      })
    } catch (eventError) {
      console.error('[ThyroidClass:event]', eventError)
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'
    const videoUrl = `${baseUrl}/tiroides/clase/video`

    await Promise.all([
      sendEmail({
        to: email,
        subject: 'Tu clase sobre entrenamiento y tiroides — WellnessReal',
        html: `
          <div style="max-width:600px;margin:auto;padding:32px;background:#16122b;color:#fff;font-family:Arial,sans-serif">
            <p style="color:#fcee21;font-weight:700;letter-spacing:.08em">WELLNESSREAL</p>
            <h1 style="font-size:26px;line-height:1.2">Tu clase ya está disponible, ${safeName}</h1>
            <p style="color:#d5d0df;line-height:1.7">En esta clase te explico cómo organizar fuerza, alimentación y descanso cuando tienes hipotiroidismo, sin convertir cada semana difícil en otro comienzo desde cero.</p>
            <a href="${videoUrl}" style="display:inline-block;margin-top:16px;padding:15px 24px;border-radius:10px;background:#fcee21;color:#16122b;text-decoration:none;font-weight:700">Ver la clase ahora</a>
            <p style="margin-top:28px;color:#8f889e;font-size:12px;line-height:1.6">Contenido educativo sobre entrenamiento y hábitos. No sustituye la valoración ni el tratamiento de un profesional sanitario.</p>
          </div>`,
      }),
      sendEmail({
        to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
        replyTo: email,
        subject: `[Clase Tiroides] ${safeName}`,
        html: `<p>Nuevo registro en la clase de tiroides.</p><p><strong>Nombre:</strong> ${safeName}<br><strong>Email:</strong> ${safeEmail}</p>`,
      }),
    ])

    const mailerLiteKey = process.env.MAILERLITE_API_KEY
    const mailerLiteGroupId = process.env.MAILERLITE_THYROID_VSL_GROUP_ID
    if (mailerLiteKey && mailerLiteGroupId) {
      try {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${mailerLiteKey}` },
          body: JSON.stringify({
            email,
            fields: { name, source: 'Clase Tiroides' },
            groups: [mailerLiteGroupId],
          }),
        })
      } catch (mailerLiteError) {
        console.error('[ThyroidClass:mailerLite]', mailerLiteError)
      }
    }

    return NextResponse.json({ success: true, leadId: lead?.id ?? null })
  } catch (error) {
    console.error('[ThyroidClass:register]', error)
    return NextResponse.json({ error: 'No hemos podido completar el registro.' }, { status: 500 })
  }
}
