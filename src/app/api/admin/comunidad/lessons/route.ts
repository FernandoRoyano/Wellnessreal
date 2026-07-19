import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { createLesson, slugify } from '@/lib/db/comunidad'

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    if (!body.space_id || !body.title) {
      return NextResponse.json({ error: 'Faltan campos (space_id, title)' }, { status: 400 })
    }
    const lesson = await createLesson({ ...body, slug: body.slug || slugify(body.title) })
    return NextResponse.json({ success: true, lesson })
  } catch (err) {
    console.error('[POST /api/admin/comunidad/lessons]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
