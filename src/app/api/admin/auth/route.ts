import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminSessionToken, getAdminSessionSecret } from '@/lib/admin-session'
import { ADMIN_COOKIE_NAME, getAdminCookieConfig } from '@/lib/auth'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

const credentialsSchema = z.object({
  password: z.string().min(1).max(256),
})

function secureEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length)
  let difference = left.length ^ right.length

  for (let index = 0; index < maxLength; index++) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }

  return difference === 0
}

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(`admin-auth:${getClientIp(request)}`, 5, 15 * 60 * 1000)
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Inténtalo más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    }

    const parsed = credentialsSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Credenciales no válidas' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD?.trim()
    const sessionSecret = getAdminSessionSecret()
    if (!adminPassword || !sessionSecret) {
      console.error('[admin:auth] Faltan ADMIN_PASSWORD o el secreto de sesión')
      return NextResponse.json({ error: 'Acceso no disponible' }, { status: 503 })
    }

    if (!secureEqual(parsed.data.password, adminPassword)) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    const token = await createAdminSessionToken(sessionSecret)
    const cookieConfig = getAdminCookieConfig(token)
    const cookieStore = await cookies()
    cookieStore.set(cookieConfig.name, cookieConfig.value, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAge,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin:auth]', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_COOKIE_NAME)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin:logout]', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
