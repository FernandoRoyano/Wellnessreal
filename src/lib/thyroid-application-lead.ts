import { upsertLead } from '@/lib/db/leads'
import { attachAnonymousEventsToLead, recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'
import type { CommunityTrackingContext } from '@/lib/community-tracking'
import { sanitizeArticleSource } from '@/lib/article-attribution'

export async function recordThyroidApplicationLead(input: {
  name: string
  email: string
  phone?: string
  origin: 'public' | 'community'
  attribution?: { landing_page?: string; referrer?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; source_article?: string; submission_page?: string }
  tracking?: CommunityTrackingContext
}): Promise<void> {
  const a = input.attribution
  const lead = await upsertLead({
    email: input.email, name: input.name, phone: input.phone,
    source: 'valoracion', landing_page: a?.landing_page ?? (input.origin === 'community' ? '/comunidad/asesoria' : '/metodo-tiroides'),
    referrer: a?.referrer ?? null, utm_source: a?.utm_source ?? null,
    utm_medium: a?.utm_medium ?? null, utm_campaign: a?.utm_campaign ?? null,
    utm_content: a?.utm_content ?? null,
    form_data: { funnel: 'metodo-tiroides-application', origin: input.origin,
      ...(sanitizeArticleSource(a?.source_article) ? { source_article: a?.source_article } : {}),
      ...(a?.submission_page === '/metodo-tiroides' ? { submission_page: a.submission_page } : {}),
    },
    tags: ['via:tiroides', 'form:metodo-tiroides', ...(input.origin === 'community' ? ['form:community-application'] : [])],
  })
  if (input.tracking?.anonymousId) await attachAnonymousEventsToLead(input.tracking.anonymousId, lead.id)
  await recordThyroidFunnelEvent({ eventName: 'thyroid_valuation_submit', leadId: lead.id,
    anonymousId: input.tracking?.anonymousId, sessionId: input.tracking?.sessionId,
    source: a?.utm_source ?? (input.origin === 'community' ? 'community' : null),
    medium: a?.utm_medium ?? null, campaign: a?.utm_campaign ?? null,
    metadata: { product: 'metodo_tiroides', source: input.origin },
  })
}
