// ============================================================
//  Método BASE · API de ajuste quirúrgico (admin)
//  Fernando reporta un cambio y el motor progresa el plan vigente.
//  La versión nueva queda SIN revisar: la aprueba antes de enviar.
//  La lógica vive en @/lib/ajustar-programa (compartida con el check-in).
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { generarAjuste, SinPlanVigenteError } from '@/lib/ajustar-programa'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { cliente_id, cambio, semana } = await req.json()
    if (!cliente_id || !cambio || !String(cambio).trim()) {
      return NextResponse.json(
        { error: 'Faltan datos (cliente_id y el cambio reportado).' },
        { status: 400 },
      )
    }

    const res = await generarAjuste({ cliente_id, cambio: String(cambio), semana })
    return NextResponse.json({ ok: true, ...res })
  } catch (e) {
    if (e instanceof SinPlanVigenteError) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    console.error('[ajustar-programa]', e)
    const message = e instanceof Error ? e.message : 'Error ajustando el programa.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
