import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseAnonKey } from '@/lib/supabase-env'

/**
 * Cliente Supabase para navegador (componentes cliente).
 * En el navegador solo existen las vars NEXT_PUBLIC_*, así que aquí se usan
 * directamente. (Hoy no se usa: todas las operaciones van por servidor.)
 */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Cliente Supabase para servidor (Server Components, Server Actions, Route Handlers).
 * Resuelve la config en runtime (acepta SUPABASE_ANON_KEY o la NEXT_PUBLIC_).
 * Lee/escribe la cookie de sesión del miembro; en Server Components la escritura
 * de cookies no está permitida y se ignora con try/catch.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl()!, supabaseAnonKey()!, {
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
