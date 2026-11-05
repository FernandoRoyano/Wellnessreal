import type { BrowserContext } from '@playwright/test'

export async function fixtureSession(context: BrowserContext, kind: 'free' | 'paid') {
  const id = kind === 'free' ? '30000000-0000-4000-8000-000000000000' : '40000000-0000-4000-8000-000000000000'
  const payload = { sub: id, email: `${kind}@example.com`, exp: 4102444800, aud: 'authenticated', role: 'authenticated' }
  const token = `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.fixture`
  const session = { access_token: token, refresh_token: 'fixture-refresh', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user: { id, email: payload.email } }
  await context.addCookies([{ name: 'sb-127-auth-token', value: `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`, domain: '127.0.0.1', path: '/' }])
}
