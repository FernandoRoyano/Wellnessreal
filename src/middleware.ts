import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseUrl, supabaseAnonKey } from '@/lib/supabase-env'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Zona admin: cookie estática (sistema existente) ──
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.next()
    }
    const sessionCookie = request.cookies.get('wr_admin_session')
    if (sessionCookie?.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // ── Zona comunidad: sesión de Supabase Auth (magic link) ──
  // Refrescamos la sesión y protegemos las rutas privadas. TODO va envuelto
  // en guardas para que un fallo de auth o una env var ausente NUNCA tumbe el
  // sitio con MIDDLEWARE_INVOCATION_FAILED (afectaría también a /admin).
  const url = supabaseUrl()
  const anon = supabaseAnonKey()
  const esEntrar = pathname === '/comunidad/entrar'

  // Sin configuración de Supabase no podemos verificar la sesión: dejamos pasar
  // y que la propia página resuelva el acceso.
  if (!url || !anon) return NextResponse.next()

  try {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !esEntrar) {
      const loginUrl = new URL('/comunidad/entrar', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  } catch {
    // Nunca tumbamos el sitio por un fallo de verificación de sesión.
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/comunidad/:path*'],
}
