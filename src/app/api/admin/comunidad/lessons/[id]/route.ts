import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getLessonAdmin, updateLesson, deleteLesson } from '@/lib/db/comunidad'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    const lesson = await getLessonAdmin(id)
    if (!lesson) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    return NextResponse.json({ lesson })
  } catch (err) {
    console.error('[GET /api/admin/comunidad/lessons/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    const patch = await request.json()
    const lesson = await updateLesson(id, patch)
    return NextResponse.json({ success: true, lesson })
  } catch (err) {
    console.error('[PATCH /api/admin/comunidad/lessons/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    await deleteLesson(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/comunidad/lessons/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
