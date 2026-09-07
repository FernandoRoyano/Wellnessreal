import { cookies } from 'next/headers'
import {
  ADMIN_COOKIE_NAME,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from '@/lib/admin-session'

export { ADMIN_COOKIE_NAME } from '@/lib/admin-session'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const secret = getAdminSessionSecret()

  if (!token || !secret) return false
  return verifyAdminSessionToken(token, secret)
}

export function getAdminCookieConfig(value: string) {
  return {
    name: ADMIN_COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24,
  }
}
