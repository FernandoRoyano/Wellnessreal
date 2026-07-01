import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { Programa } from '@/lib/programa-schema'

// Detalle de un programa generado (incluye el JSON completo + datos del cliente).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { id } = await params

    const { data, error } = await supabase
      .from('programas_generados')
      .select('*, cliente:cliente_perfil(id, nombre, email, objetivo_principal, lesiones, donde_entrena, semana_actual, token, pagado_en, plan_tier, estado_suscripcion, acceso_hasta, acceso_manual, cancela_en)')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)

    // Versiones e historial del mismo cliente (para la línea de tiempo de revisión).
    const clienteId = data?.cliente_id
    const [{ data: versiones }, { data: eventos }] = await Promise.all([
      clienteId
        ? supabase
            .from('programas_generados')
            .select('id, version, vigente, revisado, origen, creado_en')
            .eq('cliente_id', clienteId)
            .order('version', { ascending: false })
        : Promise.resolve({ data: [] }),
      clienteId
        ? supabase
            .from('eventos_cliente')
            .select('id, creado_en, semana, tipo, contenido')
            .eq('cliente_id', clienteId)
            .order('creado_en', { ascending: false })
            .limit(30)
        : Promise.resolve({ data: [] }),
    ])

    return NextResponse.json({ programa: data, versiones: versiones || [], eventos: eventos || [] })
  } catch (err) {
    console.error('[GET /api/admin/programas/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

// Revisar / editar el programa antes de enviarlo.
//   body: { revisado?: boolean, programa?: Programa }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json()

    // --- Acceso manual del cliente (pruebas / cortesía), al margen de Stripe ---
    if (typeof body.acceso_manual === 'boolean' && body.cliente_id) {
      const { error: accErr } = await supabase
        .from('cliente_perfil')
        .update({ acceso_manual: body.acceso_manual })
        .eq('id', body.cliente_id)
      if (accErr) throw new Error(accErr.message)
      // Si solo se togglea el acceso, respondemos aquí.
      if (body.revisado === undefined && !body.programa) {
        return NextResponse.json({ ok: true, acceso_manual: body.acceso_manual })
      }
    }

    const update: Record<string, unknown> = {}
    if (typeof body.revisado === 'boolean') {
      update.revisado = body.revisado
      update.revisado_en = body.revisado ? new Date().toISOString() : null
    }
    if (body.programa) {
      update.programa = body.programa as Programa
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('programas_generados')
      .update(update)
      .eq('id', id)
      .select('id, onboarding_id, revisado')
      .single()

    if (error) throw new Error(error.message)

    // Mantener el estado del onboarding en sincronía cuando se marca como revisado.
    if (data?.onboarding_id && typeof body.revisado === 'boolean') {
      await supabase
        .from('onboarding_respuestas')
        .update({ estado: body.revisado ? 'revisado' : 'generado' })
        .eq('id', data.onboarding_id)
    }

    return NextResponse.json({ ok: true, programa: data })
  } catch (err) {
    console.error('[PATCH /api/admin/programas/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
