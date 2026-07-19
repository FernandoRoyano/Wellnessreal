'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { getSessionMember, updateMemberProfile } from '@/lib/db/comunidad'

export interface MagicLinkResult {
  ok: boolean
  error?: string
}

/**
 * Envía un magic link al email para entrar en la comunidad.
 * El code verifier PKCE se guarda en cookies (cliente servidor) y se
 * consume en /auth/callback.
 */
export async function requestMagicLink(
  _prev: MagicLinkResult | null,
  formData: FormData
): Promise<MagicLinkResult> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Introduce un email válido.' }
  }

  const headerList = await headers()
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${headerList.get('x-forwarded-proto') ?? 'https'}://${headerList.get('host')}`

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  })

  if (error) {
    return { ok: false, error: '[comunidad:magicLink] No se pudo enviar el enlace. Inténtalo de nuevo.' }
  }

  return { ok: true }
}

/** Actualiza el perfil del miembro logueado. */
export async function updateProfileAction(formData: FormData) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const display_name = String(formData.get('display_name') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  if (!display_name) return

  await updateMemberProfile(member.id, { display_name, bio: bio || null })
  revalidatePath('/comunidad')
  revalidatePath('/comunidad/perfil')
  redirect('/comunidad')
}

/** Cierra la sesión del miembro y vuelve a la pantalla de entrada. */
export async function signOut() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/comunidad/entrar')
}
