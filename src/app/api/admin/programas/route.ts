import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// Lista de programas generados (los que Fernando revisa antes de enviar).
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filtro = searchParams.get('filtro') // 'pendientes' | 'revisados' | null

    let query = supabase
      .from('programas_generados')
      .select('id, version, vigente, revisado, revisado_en, modelo, origen, creado_en, cliente:cliente_perfil(id, nombre, email, acceso_manual, estado_suscripcion, acceso_hasta)')
      .eq('vigente', true)
      .order('creado_en', { ascending: false })

    if (filtro === 'pendientes') query = query.eq('revisado', false)
    if (filtro === 'revisados') query = query.eq('revisado', true)

    const { data, error } = await query
    if (error) throw new Error(error.message)

    const pendientes = (data || []).filter((p) => !p.revisado).length

    return NextResponse.json({ programas: data || [], pendientes })
  } catch (err) {
    console.error('[GET /api/admin/programas]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
