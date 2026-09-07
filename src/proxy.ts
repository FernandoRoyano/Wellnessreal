import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import {
  ADMIN_COOKIE_NAME,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from '@/lib/admin-session'
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase-env'

function redirectToCommunityLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/comunidad/entrar', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // La pantalla de entrada es pública; el resto del admin exige sesión firmada.
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.next()
    }

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const secret = getAdminSessionSecret()
    const authenticated = token && secret ? await verifyAdminSessionToken(token, secret) : false

    return authenticated
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/admin', request.url))
  }

  const publicCommunityRoute =
    pathname === '/comunidad/entrar' || pathname === '/comunidad/confirmar'
  const url = supabaseUrl()
  const anonKey = supabaseAnonKey()

  // Las rutas privadas fallan cerradas si no podemos verificar la sesión.
  if (!url || !anonKey) {
    return publicCommunityRoute ? NextResponse.next() : redirectToCommunityLogin(request)
  }

  try {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(url, anonKey, {
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

    if (!user && !publicCommunityRoute) return redirectToCommunityLogin(request)

    return response
  } catch (error) {
    console.error('[proxy:community-auth]', error)
    return publicCommunityRoute ? NextResponse.next() : redirectToCommunityLogin(request)
  }
}

export const config = {
  matcher: ['/admin/:path*', '/comunidad/:path*'],
}
