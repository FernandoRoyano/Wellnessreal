'use server'

import { z } from 'zod'
import { createAsesoriaSolicitud } from '@/lib/db/comunidad'
import { recordThyroidApplicationLead } from '@/lib/thyroid-application-lead'
import { getThyroidLaunchPhase } from '@/lib/metodo-tiroides'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rateLimit'

const attributionSchema = z.object({
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(120).optional(),
  source_article: z.string().max(120).optional(),
  submission_page: z.enum(['/metodo-tiroides']).optional(),
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
  phone: z.string().trim().max(30).regex(/^\+?[\d\s().-]+$/, 'Escribe un teléfono válido.').refine(value => {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 9 && digits.length <= 15
  }, 'Escribe un teléfono válido con prefijo de país.'),
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
  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`thyroid-application:${ip}`, 5, 15 * 60 * 1000).success) {
    return { success: false, error: 'Espera unos minutos antes de enviar otra solicitud.' }
  }
  if (getThyroidLaunchPhase() !== 'applications') {
    return { success: false, error: 'Las solicitudes no están abiertas en este momento.' }
  }
  const parsed = applicationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
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
      telefono: parsed.data.phone,
      objetivo: parsed.data.goal,
      diasSemana: parsed.data.days,
      lesiones: parsed.data.limitations,
    })
    try {
      await recordThyroidApplicationLead({ ...parsed.data, origin: formData.get('_origin') === 'community' ? 'community' : 'public', attribution,
        tracking: funnel?.anonymousId && funnel.sessionId ? { anonymousId: funnel.anonymousId, sessionId: funnel.sessionId } : undefined,
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
