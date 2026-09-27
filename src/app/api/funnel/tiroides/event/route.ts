import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { recordThyroidFunnelEvent, THYROID_FUNNEL_EVENTS } from '@/lib/db/thyroid-funnel'

const MetadataSchema = z.object({
  view_type: z.enum(['initial', 'engaged', 'cta_click']).optional(),
  cta_position: z.string().max(50).optional(),
  page: z.string().max(100).optional(),
  percent: z.number().min(0).max(100).optional(),
  action: z.string().max(50).optional(),
  position: z.string().max(50).optional(),
  source: z.string().max(100).optional(),
  product: z.string().max(100).optional(),
  value: z.number().nonnegative().max(100000).optional(),
})

const EventSchema = z.object({
  eventName: z.enum(THYROID_FUNNEL_EVENTS),
  leadId: z.uuid().nullable().optional(),
  anonymousId: z.string().min(8).max(100).nullable().optional(),
  sessionId: z.string().min(8).max(100).nullable().optional(),
  source: z.string().max(120).nullable().optional(),
  medium: z.string().max(120).nullable().optional(),
  campaign: z.string().max(200).nullable().optional(),
  metadata: MetadataSchema.optional(),
})

export async function POST(request: NextRequest) {
  try {
    const parsed = EventSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Evento inválido' }, { status: 400 })
    await recordThyroidFunnelEvent({ ...parsed.data, metadata: parsed.data.metadata ?? {} })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ThyroidFunnelEvent:POST] No se pudo registrar:', error)
    return NextResponse.json({ error: 'No se pudo registrar el evento' }, { status: 500 })
  }
}
