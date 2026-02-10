import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieConfig } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    const cookieConfig = getAdminCookieConfig()
    const cookieStore = await cookies()
    cookieStore.set(cookieConfig.name, cookieConfig.value, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAge,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('wr_admin_session')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
