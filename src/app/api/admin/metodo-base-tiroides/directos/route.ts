import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminAuthenticated } from '@/lib/auth'
import { createLesson, getLessonsAdmin, getSpacesAdmin, slugify } from '@/lib/db/comunidad'

export const dynamic = 'force-dynamic'

const CreateLiveSessionSchema = z.object({
  title: z.string().trim().min(3).max(120),
  topic: z.string().trim().min(2).max(80),
  date: z.iso.date(),
  videoUrl: z.url().max(500).refine((url) => url.startsWith('https://'), 'El enlace debe usar HTTPS'),
  summary: z.string().trim().max(1000).optional().default(''),
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
      sessions: lessons.filter((lesson) => lesson.slug.startsWith('directo-')).reverse(),
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
    if (!parsed.success) return NextResponse.json({ error: 'Revisa fecha, temática y enlace del vídeo' }, { status: 400 })
    const space = await getPremiumSpace()
    if (!space) return NextResponse.json({ error: 'El espacio premium no existe' }, { status: 404 })
    const lessons = await getLessonsAdmin(space.id)
    const { title, topic, date, videoUrl, summary } = parsed.data
    const safeUrl = videoUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    const safeSummary = summary.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
    const lesson = await createLesson({
      space_id: space.id,
      slug: `directo-${date}-${slugify(topic)}`,
      title: `${title} · ${topic}`,
      content: `<p><strong>Directo del ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`))}</strong></p>${safeSummary ? `<p>${safeSummary}</p>` : ''}<p><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Ver grabación del directo</a></p>`,
      sort_order: lessons.length,
      drip_days: 0,
      access_tier: 'premium',
      published: true,
    })
    return NextResponse.json({ session: lesson }, { status: 201 })
  } catch (error) {
    console.error('[MetodoBaseDirectos:create]', error)
    return NextResponse.json({ error: 'No se pudo publicar el directo. Comprueba que no esté duplicado.' }, { status: 500 })
  }
}
