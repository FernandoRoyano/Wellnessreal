const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24
export const ADMIN_COOKIE_NAME = 'wr_admin_session'

interface AdminSessionPayload {
  version: 1
  expiresAt: number
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export function getAdminSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim() || null
}

export async function createAdminSessionToken(
  secret: string,
  ttlSeconds = ADMIN_SESSION_TTL_SECONDS
): Promise<string> {
  const payload: AdminSessionPayload = {
    version: 1,
    expiresAt: Date.now() + ttlSeconds * 1000,
  }
  const encodedPayload = bytesToBase64Url(encoder.encode(JSON.stringify(payload)))
  const key = await importSigningKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(encodedPayload))

  return `${encodedPayload}.${bytesToBase64Url(new Uint8Array(signature))}`
}

export async function verifyAdminSessionToken(token: string, secret: string): Promise<boolean> {
  try {
    if (token.length > 1024) return false

    const parts = token.split('.')
    if (parts.length !== 2) return false
    const [encodedPayload, encodedSignature] = parts
    if (!encodedPayload || !encodedSignature) return false

    const key = await importSigningKey(secret)
    const validSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(encodedSignature),
      encoder.encode(encodedPayload)
    )
    if (!validSignature) return false

    const payload = JSON.parse(
      decoder.decode(base64UrlToBytes(encodedPayload))
    ) as Partial<AdminSessionPayload>

    return (
      payload.version === 1 &&
      typeof payload.expiresAt === 'number' &&
      Number.isFinite(payload.expiresAt) &&
      payload.expiresAt > Date.now()
    )
  } catch {
    return false
  }
}
