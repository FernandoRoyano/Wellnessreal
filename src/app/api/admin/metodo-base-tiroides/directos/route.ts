import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminAuthenticated } from '@/lib/auth'
import { createLesson, getLessonsAdmin, getSpacesAdmin, slugify } from '@/lib/db/comunidad'

export const dynamic = 'force-dynamic'

const CreateLiveSessionSchema = z.object({
  title: z.string().trim().min(3).max(120),
  topic: z.string().trim().min(2).max(80),
  format: z.enum(['recorded', 'live']).default('recorded'),
  block: z.coerce.number().int().min(1).max(4),
  date: z.union([z.literal(''), z.iso.date()]).default(''),
  videoUrl: z.url().max(500).refine((url) => url.startsWith('https://'), 'El enlace debe usar HTTPS'),
  summary: z.string().trim().max(1000).optional().default(''),
}).superRefine((data, context) => {
  if (data.format === 'live' && !data.date) {
    context.addIssue({ code: 'custom', path: ['date'], message: 'Los directos necesitan una fecha' })
  }
})

async function getPremiumSpace() {
  const spaces = await getSpacesAdmin()
  return spaces.find((space) => space.slug === 'metodo-base-tiroides' && space.access_tier === 'premium') ?? null
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const space = await getPremiumSpace()
    if (!space) return NextResponse.json({ error: 'El espacio premium no existe' }, { status: 404 })
    const lessons = await getLessonsAdmin(space.id)
    return NextResponse.json({
      spaceId: space.id,
      sessions: lessons.filter((lesson) => lesson.slug.startsWith('directo-') || lesson.slug.startsWith('clase-b')).reverse(),
    })
  } catch (error) {
    console.error('[MetodoBaseDirectos:list]', error)
    return NextResponse.json({ error: 'No se pudieron cargar los directos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const parsed = CreateLiveSessionSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Revisa los datos de la clase' }, { status: 400 })
    const space = await getPremiumSpace()
    if (!space) return NextResponse.json({ error: 'El espacio premium no existe' }, { status: 404 })
    const lessons = await getLessonsAdmin(space.id)
    const { title, topic, format, block, date, videoUrl, summary } = parsed.data
    const safeUrl = videoUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    const safeSummary = summary.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
    const dateLabel = date
      ? `<p><strong>${format === 'live' ? 'Directo' : 'Clase'} del ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`))}</strong></p>`
      : ''
    const slug = format === 'live'
      ? `directo-${date}-${slugify(topic)}`
      : `clase-b${block}-${slugify(title)}`
    const lesson = await createLesson({
      space_id: space.id,
      slug,
      title: `${title} · ${topic} · Bloque ${block}`,
      content: `${dateLabel}${safeSummary ? `<p>${safeSummary}</p>` : ''}<p><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Ver clase</a></p>`,
      sort_order: lessons.length,
      drip_days: 0,
      access_tier: 'premium',
      published: true,
    })
    return NextResponse.json({ session: lesson }, { status: 201 })
  } catch (error) {
    console.error('[MetodoBaseDirectos:create]', error)
    return NextResponse.json({ error: 'No se pudo publicar el contenido. Comprueba que no esté duplicado.' }, { status: 500 })
  }
}
