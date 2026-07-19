import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { ensureMemberProfile } from '@/lib/db/comunidad'

/**
 * Callback del magic link. Intercambia el ?code por una sesión (PKCE),
 * crea el perfil del miembro en el primer acceso y redirige a la comunidad.
 * Todo va con captura de errores: nunca devolvemos un 500, siempre redirigimos.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/comunidad'

  if (!code) {
    return NextResponse.redirect(`${origin}/comunidad/entrar?error=missing_code`)
  }

  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
      console.error('[auth:callback] exchange', error?.message)
      return NextResponse.redirect(`${origin}/comunidad/entrar?error=auth`)
    }

    try {
      await ensureMemberProfile(data.user)
    } catch (profileErr) {
      // El perfil se recrea en un login posterior; no bloqueamos el acceso,
      // pero lo registramos porque suele indicar migraciones sin ejecutar.
      console.error('[auth:callback] ensureMemberProfile', profileErr)
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    console.error('[auth:callback:throw]', err)
    return NextResponse.redirect(`${origin}/comunidad/entrar?error=callback`)
  }
}
