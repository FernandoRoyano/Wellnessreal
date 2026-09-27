'use server'

import { z } from 'zod'
import { createAsesoriaSolicitud } from '@/lib/db/comunidad'
import { upsertLead } from '@/lib/db/leads'
import { attachAnonymousEventsToLead, recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'
import { getThyroidLaunchPhase } from '@/lib/metodo-tiroides'

const attributionSchema = z.object({
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(200).optional(),
  landing_page: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
}).optional()

const funnelSchema = z.object({
  anonymousId: z.string().min(8).max(100),
  sessionId: z.string().min(8).max(100),
}).optional()

const applicationSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.').max(100),
  email: z.email('Escribe un email válido.'),
  goal: z.string().trim().min(20, 'Cuéntame un poco más sobre lo que quieres conseguir.').max(1500),
  days: z.enum(['1', '2', '3', '4+']),
  limitations: z.string().trim().max(1000).optional(),
})

export interface ThyroidApplicationState {
  success: boolean
  error?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof applicationSchema>, string[]>>
}

export async function applyToThyroidProgram(
  _previous: ThyroidApplicationState,
  formData: FormData
): Promise<ThyroidApplicationState> {
  if (getThyroidLaunchPhase() !== 'applications') {
    return { success: false, error: 'Las solicitudes no están abiertas en este momento.' }
  }
  const parsed = applicationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    goal: formData.get('goal'),
    days: formData.get('days'),
    limitations: formData.get('limitations') || undefined,
  })
  let attribution: z.infer<typeof attributionSchema>
  try {
    attribution = attributionSchema.parse(JSON.parse(String(formData.get('_attribution') || '{}')))
  } catch {
    attribution = undefined
  }
  let funnel: z.infer<typeof funnelSchema>
  try {
    funnel = funnelSchema.parse(JSON.parse(String(formData.get('_funnel') || '{}')))
  } catch {
    funnel = undefined
  }

  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos marcados.', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    await createAsesoriaSolicitud({
      memberId: null,
      nombre: parsed.data.name,
      email: parsed.data.email,
      objetivo: parsed.data.goal,
      diasSemana: parsed.data.days,
      lesiones: parsed.data.limitations,
    })
    try {
      const lead = await upsertLead({
        email: parsed.data.email,
        name: parsed.data.name,
        source: 'valoracion',
        landing_page: attribution?.landing_page ?? '/metodo-tiroides',
        referrer: attribution?.referrer ?? null,
        utm_source: attribution?.utm_source ?? null,
        utm_medium: attribution?.utm_medium ?? null,
        utm_campaign: attribution?.utm_campaign ?? null,
        form_data: { funnel: 'metodo-tiroides-application' },
        tags: ['via:tiroides', 'form:metodo-tiroides'],
      })
      if (funnel?.anonymousId) {
        await attachAnonymousEventsToLead(funnel.anonymousId, lead.id)
      }
      await recordThyroidFunnelEvent({
        eventName: 'thyroid_valuation_submit',
        leadId: lead.id,
        anonymousId: funnel?.anonymousId,
        sessionId: funnel?.sessionId,
        source: attribution?.utm_source ?? null,
        medium: attribution?.utm_medium ?? null,
        campaign: attribution?.utm_campaign ?? null,
        metadata: { product: 'metodo_tiroides', value: 349 },
      })
    } catch (trackingError) {
      console.error('[MetodoTiroides:trackApplication]', trackingError)
    }
    return { success: true }
  } catch (error) {
    console.error('[MetodoTiroides:applyToThyroidProgram]', error)
    return { success: false, error: 'No se pudo enviar la solicitud. Inténtalo de nuevo o escríbeme por WhatsApp.' }
  }
}
