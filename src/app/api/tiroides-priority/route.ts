import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { captureLead } from '@/lib/leadCapture'
import { attachAnonymousEventsToLead, recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'

const PrioritySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().transform((value) => value.toLowerCase().trim()),
  _attribution: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
    referrer: z.string().optional(),
    landing_page: z.string().optional(),
    fbc: z.string().optional(),
    fbp: z.string().optional(),
  }).optional(),
  _funnel: z.object({
    anonymousId: z.string().min(8).max(100),
    sessionId: z.string().min(8).max(100),
  }).nullable().optional(),
})

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character)
}

export async function POST(request: NextRequest) {
  try {
    const parsed = PrioritySchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Revisa tu nombre y tu email.' }, { status: 400 })

    const { name, email, _attribution, _funnel } = parsed.data
    const lead = await captureLead({
      request,
      email,
      name,
      source: 'tiroides',
      attribution: _attribution,
      form_data: { funnel: 'thyroid-priority-list' },
      tags: ['via:tiroides', 'form:thyroid-priority'],
    })

    try {
      if (lead && _funnel?.anonymousId) await attachAnonymousEventsToLead(_funnel.anonymousId, lead.id)
      await recordThyroidFunnelEvent({
        eventName: 'thyroid_lead_capture',
        leadId: lead?.id ?? null,
        email,
        anonymousId: _funnel?.anonymousId,
        sessionId: _funnel?.sessionId,
        source: _attribution?.utm_source ?? null,
        medium: _attribution?.utm_medium ?? null,
        campaign: _attribution?.utm_campaign ?? null,
        metadata: { product: 'metodo_tiroides_priority' },
      })
    } catch (trackingError) {
      console.error('[ThyroidPriority:tracking]', trackingError)
    }

    const safeName = escapeHtml(name)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'
    await sendEmail({
      to: email,
      subject: 'Estás en la lista prioritaria · Método BASE Tiroides',
      html: `<div style="max-width:600px;margin:auto;padding:32px;background:#16122b;color:#fff;font-family:Arial,sans-serif"><p style="color:#fcee21;font-weight:700;letter-spacing:.08em">WELLNESSREAL</p><h1 style="font-size:26px;line-height:1.2">Ya estás dentro, ${safeName}</h1><p style="color:#d5d0df;line-height:1.7">Te avisaré antes de que se abran las solicitudes para la primera edición de Método BASE Tiroides.</p><p style="color:#d5d0df;line-height:1.7">Mientras tanto, puedes ver esta clase gratuita para aprender a decidir cuándo mantener, reducir o pausar una sesión.</p><a href="${baseUrl}/tiroides/clase/video" style="display:inline-block;margin-top:16px;padding:15px 24px;border-radius:10px;background:#fcee21;color:#16122b;text-decoration:none;font-weight:700">Ver la clase gratuita</a><p style="margin-top:28px;color:#8f889e;font-size:12px;line-height:1.6">Contenido educativo sobre entrenamiento y hábitos. No sustituye la valoración ni el tratamiento de un profesional sanitario.</p></div>`,
    })

    const apiKey = process.env.MAILERLITE_API_KEY
    const groupId = process.env.MAILERLITE_THYROID_PRIORITY_GROUP_ID
      || process.env.MAILERLITE_TIROIDES_GROUP_ID
      || process.env.MAILERLITE_GROUP_ID
    if (apiKey) {
      try {
        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ email, fields: { name }, groups: groupId ? [groupId] : [], status: 'active' }),
        })
        if (!response.ok) console.error('[ThyroidPriority:MailerLite]', response.status)
      } catch (mailerError) {
        console.error('[ThyroidPriority:MailerLite]', mailerError)
      }
    }

    return NextResponse.json({ success: true, leadId: lead?.id ?? null })
  } catch (error) {
    console.error('[ThyroidPriority:register]', error)
    return NextResponse.json({ error: 'No hemos podido completar el registro.' }, { status: 500 })
  }
}
