import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Cliente Supabase para navegador (componentes cliente).
 * Usa la anon key + sesión del usuario (magic link) guardada en cookies.
 */
export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Cliente Supabase para servidor (Server Components, Server Actions, Route Handlers).
 * Lee/escribe la cookie de sesión del miembro. En Server Components la escritura
 * de cookies no está permitida: se ignora con try/catch (el refresco de sesión lo
 * hace el middleware / route handlers).
 */
export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component: ignoramos, el middleware refresca la sesión.
        }
      },
    },
  })
}
