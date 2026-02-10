import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'wr_admin_session'
const ADMIN_COOKIE_VALUE = 'authenticated'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)
  return sessionCookie?.value === ADMIN_COOKIE_VALUE
}

export function getAdminCookieConfig() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: ADMIN_COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  }
}
