import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getGroups, createGroup, deleteGroup } from '@/lib/mailerlite'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || undefined
    const limit = Number(searchParams.get('limit')) || 50

    const result = await getGroups({ cursor, limit })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/email/groups]', err)
    return NextResponse.json({ error: 'Error al obtener grupos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nombre del grupo requerido' }, { status: 400 })
    }

    const result = await createGroup(name.trim())

    return NextResponse.json(result)
  } catch (err) {
    console.error('[POST /api/admin/email/groups]', err)
    return NextResponse.json({ error: 'Error al crear grupo' }, { status: 500 })
  }
}
