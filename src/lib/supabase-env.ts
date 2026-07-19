// ============================================================
//  Resolución de la config de Supabase para la comunidad.
//  Módulo PURO (sin imports) para poder usarse también en el
//  middleware (Edge). Acepta la anon key como variable normal
//  (SUPABASE_ANON_KEY, leída en runtime) o como NEXT_PUBLIC_
//  (incrustada en build). La normal evita los problemas de
//  incrustado/caché de build en Vercel.
// ============================================================

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
}

export function supabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
}

export function supabaseConfigStatus(): { ok: boolean; missing: string[] } {
  const missing: string[] = []
  if (!supabaseUrl()) missing.push('NEXT_PUBLIC_SUPABASE_URL (o SUPABASE_URL)')
  if (!supabaseAnonKey()) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY (o SUPABASE_ANON_KEY)')
  return { ok: missing.length === 0, missing }
}
