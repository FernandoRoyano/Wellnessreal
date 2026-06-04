import type { NextRequest } from 'next/server'
import { upsertLead, type LeadSource } from '@/lib/db/leads'

interface AttributionInBody {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landing_page?: string
  fbc?: string
  fbp?: string
}

/**
 * Captura un lead desde un endpoint público. No bloquea ni rompe
 * si Supabase falla — solo loguea. Devuelve el lead o null.
 *
 * Llamar antes de las acciones secundarias (email, MailerLite, etc).
 */
export async function captureLead(params: {
  request: NextRequest
  email: string
  name?: string | null
  phone?: string | null
  source: LeadSource
  attribution?: AttributionInBody
  form_data?: Record<string, unknown> | null
  tags?: string[]
}) {
  try {
    const a = params.attribution || {}
    const ip = params.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const userAgent = params.request.headers.get('user-agent') || null

    const lead = await upsertLead({
      email: params.email,
      name: params.name ?? null,
      phone: params.phone ?? null,
      source: params.source,
      landing_page: a.landing_page || null,
      referrer: a.referrer || null,
      utm_source: a.utm_source || null,
      utm_medium: a.utm_medium || null,
      utm_campaign: a.utm_campaign || null,
      utm_term: a.utm_term || null,
      utm_content: a.utm_content || null,
      fbc: a.fbc || null,
      fbp: a.fbp || null,
      form_data: params.form_data || null,
      tags: params.tags || [],
      user_agent: userAgent,
      ip,
    })
    return lead
  } catch (err) {
    console.error('[captureLead] Error guardando lead:', err)
    return null
  }
}
