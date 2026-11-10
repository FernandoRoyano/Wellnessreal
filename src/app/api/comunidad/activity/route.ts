import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionMember, isApproved } from '@/lib/db/comunidad'
import { recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'
import { rateLimit } from '@/lib/rateLimit'

const ActivitySchema = z.object({
  action: z.enum(['visit', 'resource']),
  consent: z.literal(true),
  tracking: z.object({ anonymousId: z.uuid(), sessionId: z.uuid() }),
})

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 })
  try {
    const member = await getSessionMember()
    if (!member || !isApproved(member)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (!rateLimit(`community-activity:${member.id}`, 30, 60_000).success) return NextResponse.json({ error: 'Demasiados intentos' }, { status: 429 })
    const parsed = ActivitySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Evento inválido' }, { status: 400 })
    const startedAt = Date.parse(process.env.COMMUNITY_ACTIVITY_SINCE ?? '')
    if (!Number.isFinite(startedAt) || startedAt > Date.now()) return new NextResponse(null, { status: 204 })
    const day = new Date().toISOString().slice(0, 10)
    const resource = parsed.data.action === 'resource'
    await recordThyroidFunnelEvent({
      eventName: resource ? 'community_resource_click' : 'community_active_day',
      ...parsed.data.tracking,
      externalId: `community:${resource ? 'resource' : 'active'}:${member.id}:${day}`,
      metadata: { member_id: member.id },
    })
    return new NextResponse(null, { status: 204 })
  } catch {
    console.error('[CommunityActivity:POST] No se pudo guardar la actividad')
    return NextResponse.json({ error: 'No se pudo registrar la actividad' }, { status: 500 })
  }
}
