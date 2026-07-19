import { NextResponse } from 'next/server'
import type { EmailOtpType, User } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { ensureMemberProfile } from '@/lib/db/comunidad'

/**
 * Callback del magic link / confirmación de registro.
 * Acepta los dos formatos que puede enviar Supabase:
 *   - PKCE:        ?code=...            -> exchangeCodeForSession
 *   - token_hash:  ?token_hash=&type=  -> verifyOtp
 * Todo con captura de errores: nunca devolvemos un 500, siempre redirigimos,
 * y registramos los parámetros recibidos para diagnosticar si algo falla.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/comunidad'

  try {
    const supabase = await createServerSupabase()

    let user: User | null = null
    let authError: string | null = null

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      user = data?.user ?? null
      authError = error?.message ?? null
    } else if (token_hash && type) {
      const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
      user = data?.user ?? null
      authError = error?.message ?? null
    } else {
      console.error('[auth:callback] sin code ni token_hash. params:', searchParams.toString())
      return NextResponse.redirect(`${origin}/comunidad/entrar?error=missing_code`)
    }

    if (authError || !user) {
      console.error('[auth:callback] verify:', authError, '| params:', searchParams.toString())
      return NextResponse.redirect(`${origin}/comunidad/entrar?error=auth`)
    }

    try {
      await ensureMemberProfile(user)
    } catch (profileErr) {
      // Suele indicar que faltan las migraciones (member_profiles no existe).
      console.error('[auth:callback] ensureMemberProfile:', profileErr)
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    console.error('[auth:callback:throw]', err)
    return NextResponse.redirect(`${origin}/comunidad/entrar?error=callback`)
  }
}
