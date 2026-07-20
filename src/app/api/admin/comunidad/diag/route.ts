import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// Diagnóstico de config de Supabase en el servidor (solo admin).
// NO expone valores: solo nombres presentes, longitudes y existencia de tablas,
// para detectar typos, variables vacías/ausentes o migraciones sin ejecutar.
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

  // ¿Existen las tablas de la comunidad? (confirma si las migraciones corrieron)
  const tabla = async (t: string) => {
    const { error } = await supabase.from(t).select('*', { head: true, count: 'exact' }).limit(1)
    return error ? `FALTA / ERROR: ${error.message}` : 'OK'
  }
  const tablas = {
    member_profiles: await tabla('member_profiles'),
    spaces: await tabla('spaces'),
    lessons: await tabla('lessons'),
    threads: await tabla('threads'),
    comments: await tabla('comments'),
    likes: await tabla('likes'),
  }

  // Transporte de email de la APP (distinto del SMTP del magic link, que va en
  // Supabase). Sin RESEND_API_KEY (o credenciales Gmail) la app no envía nada.
  const emailApp = {
    RESEND_API_KEY: check('RESEND_API_KEY'),
    MAIL_FROM: check('MAIL_FROM'),
    GMAIL_USER: check('GMAIL_USER'),
    GMAIL_APP_PASSWORD: check('GMAIL_APP_PASSWORD'),
    transporte: process.env.RESEND_API_KEY
      ? 'Resend (API)'
      : process.env.GMAIL_USER
        ? 'Gmail SMTP'
        : 'NINGUNO — la app no puede enviar emails',
    remitente: process.env.MAIL_FROM || process.env.GMAIL_USER || 'SIN DEFINIR',
  }

  return NextResponse.json({
    nombresDetectadosConSupa: nombresConSupa,
    esperadas: {
      NEXT_PUBLIC_SUPABASE_URL: check('NEXT_PUBLIC_SUPABASE_URL'),
      SUPABASE_URL: check('SUPABASE_URL'),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: check('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      SUPABASE_ANON_KEY: check('SUPABASE_ANON_KEY'),
      SUPABASE_SERVICE_ROLE_KEY: check('SUPABASE_SERVICE_ROLE_KEY'),
    },
    emailApp,
    tablas,
  })
}
