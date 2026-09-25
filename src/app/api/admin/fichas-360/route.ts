import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const search = request.nextUrl.searchParams.get('search')?.trim().slice(0, 100) ?? ''
    let query = supabase
      .from('cliente_fichas_360')
      .select('id,nombre,email,telefono,respuestas,created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, '')
      query = query.or(`nombre.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,telefono.ilike.%${safeSearch}%`)
    }

    const { data, error } = await query
    if (error) throw new Error(`[Fichas360Admin:listar] ${error.message}`)
    return NextResponse.json({ fichas: data ?? [] })
  } catch (error) {
    console.error('[Fichas360Admin:GET]', error)
    return NextResponse.json({ error: 'No se pudieron cargar las fichas.' }, { status: 500 })
  }
}
