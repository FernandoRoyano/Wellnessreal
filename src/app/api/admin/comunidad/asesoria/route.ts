import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import {
  getAsesoriaSolicitudes,
  setAsesoriaEstado,
  deleteAsesoriaSolicitud,
} from '@/lib/db/comunidad'

export const dynamic = 'force-dynamic'

const VALID = ['nueva', 'contactada', 'aceptada', 'descartada'] as const

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const solicitudes = await getAsesoriaSolicitudes()
    return NextResponse.json({ solicitudes })
  } catch (err) {
    console.error('[GET /api/admin/comunidad/asesoria]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id, estado } = await request.json()
    if (!id || !VALID.includes(estado)) {
      return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 })
    }
    await setAsesoriaEstado(id, estado)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/comunidad/asesoria]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Falta el id' }, { status: 400 })
    }
    await deleteAsesoriaSolicitud(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/comunidad/asesoria]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
