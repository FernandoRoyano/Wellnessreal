import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { createProgramPdf } from '@/lib/programa-pdf'
import type { Programa } from '@/lib/programa-schema'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  const { data: row } = await supabase.from('programas_generados').select('programa,cliente:cliente_perfil(nombre)').eq('id', id).maybeSingle()
  if (!row) return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 })
  const client = Array.isArray(row.cliente) ? row.cliente[0] : row.cliente
  const name = client?.nombre ?? 'Cliente'
  const bytes = await createProgramPdf(row.programa as Programa, name)
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="plan-wellnessreal.pdf"',
      'Cache-Control': 'private, no-store',
    },
  })
}
