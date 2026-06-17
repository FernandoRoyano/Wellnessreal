// Rate limiting en memoria (ventana fija) por clave (normalmente IP + ruta).
// Primera capa de defensa contra abuso/fuerza bruta sin dependencias externas.
//
// Aviso: en serverless el estado es por instancia, no global. Mitiga ráfagas
// desde una misma IP pero no es un límite distribuido perfecto. Para algo más
// estricto, migrar a Upstash Ratelimit / Vercel KV.

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export interface RateLimitResult {
  success: boolean
  remaining: number
  retryAfter: number // segundos hasta poder reintentar
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()

  // Limpieza oportunista para que el Map no crezca sin control
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (now > v.resetAt) store.delete(k)
    }
  }

  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count, retryAfter: 0 }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
