import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { ensureMemberProfile } from '@/lib/db/comunidad'

/**
 * Callback del magic link. Intercambia el ?code por una sesión (PKCE),
 * crea el perfil del miembro en el primer acceso y redirige a la comunidad.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/comunidad'

  if (!code) {
    return NextResponse.redirect(`${origin}/comunidad/entrar?error=missing_code`)
  }

  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/comunidad/entrar?error=auth`)
  }

  try {
    await ensureMemberProfile(data.user)
  } catch {
    // El perfil se puede recrear en un login posterior; no bloqueamos el acceso.
  }

  return NextResponse.redirect(`${origin}${next}`)
}
