import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getSpacesAdmin, createSpace, slugify } from '@/lib/db/comunidad'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const spaces = await getSpacesAdmin()
    return NextResponse.json({ spaces })
  } catch (err) {
    console.error('[GET /api/admin/comunidad/spaces]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    if (!body.name) {
      return NextResponse.json({ error: 'Falta el nombre del espacio' }, { status: 400 })
    }
    const space = await createSpace({ ...body, slug: body.slug || slugify(body.name) })
    return NextResponse.json({ success: true, space })
  } catch (err) {
    console.error('[POST /api/admin/comunidad/spaces]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
