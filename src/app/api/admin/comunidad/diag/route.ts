import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'

// Diagnóstico de config de Supabase en el servidor (solo admin).
// NO expone valores: solo nombres presentes y longitudes, para detectar
// typos, variables vacías o ausentes sin filtrar secretos.
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const check = (k: string) => {
    const v = process.env[k]
    return v ? `OK (${v.length} chars)` : 'AUSENTE'
  }

  // Todos los nombres de env que contienen "SUPA" (revela typos).
  const nombresConSupa = Object.keys(process.env)
    .filter((k) => /supa/i.test(k))
    .sort()

  return NextResponse.json({
    nombresDetectadosConSupa: nombresConSupa,
    esperadas: {
      NEXT_PUBLIC_SUPABASE_URL: check('NEXT_PUBLIC_SUPABASE_URL'),
      SUPABASE_URL: check('SUPABASE_URL'),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: check('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      SUPABASE_ANON_KEY: check('SUPABASE_ANON_KEY'),
      SUPABASE_SERVICE_ROLE_KEY: check('SUPABASE_SERVICE_ROLE_KEY'),
    },
  })
}
