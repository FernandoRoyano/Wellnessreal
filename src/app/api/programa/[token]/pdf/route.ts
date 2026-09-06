import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createProgramPdf } from '@/lib/programa-pdf'
import type { Programa } from '@/lib/programa-schema'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { data: profile } = await supabase.from('cliente_perfil').select('id,nombre,estado_suscripcion,acceso_hasta,acceso_manual').eq('token', token).maybeSingle()
  if (!profile) return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })

  const active = ['active', 'trialing', 'past_due'].includes(profile.estado_suscripcion ?? '')
  const inWindow = profile.acceso_hasta ? new Date(profile.acceso_hasta) > new Date() : false
  if (!((active && inWindow) || profile.acceso_manual === true)) return NextResponse.json({ error: 'Acceso no disponible' }, { status: 403 })

  const { data: row } = await supabase.from('programas_generados').select('programa').eq('cliente_id', profile.id).eq('revisado', true).order('version', { ascending: false }).limit(1).maybeSingle()
  if (!row) return NextResponse.json({ error: 'El plan todavía no está aprobado' }, { status: 404 })

  const bytes = await createProgramPdf(row.programa as Programa, profile.nombre)
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="plan-wellnessreal.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
