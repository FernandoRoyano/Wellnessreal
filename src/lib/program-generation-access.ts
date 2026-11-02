import { supabase } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { supabaseConfigStatus } from '@/lib/supabase-env'

export async function authorizeProgramGeneration(email: string, origin: string) {
  if (await isAdminAuthenticated()) return { allowed: true as const, admin: true as const, applicationId: null }
  if (!supabaseConfigStatus().ok) return { allowed: false as const, status: 503, error: 'El acceso no está disponible temporalmente. Contacta con info@wellnessreal.es.' }
  const auth = await createServerSupabase()
  const { data: { user }, error } = await auth.auth.getUser()
  if (error || !user?.email) return { allowed: false as const, status: 401, error: 'Entra en la comunidad con el correo de tu compra para completar el cuestionario.' }
  if (origin !== 'metodo-tiroides' || user.email.toLowerCase() !== email) {
    return { allowed: false as const, status: 403, error: 'Solo puedes completar tu propia evaluación.' }
  }
  const { data: application, error: paymentError } = await supabase
    .from('asesoria_solicitudes').select('id').ilike('email', email.replace(/[\\%_]/g, '\\$&')).eq('estado', 'pagada').limit(1).maybeSingle()
  if (paymentError) throw new Error('[ProgramGeneration:authorize] No se pudo verificar el pago')
  if (!application) return { allowed: false as const, status: 403, error: 'No encontramos un pago confirmado con tu cuenta.' }
  return { allowed: true as const, admin: false as const, applicationId: application.id as string }
}

/** Reserva atómica sobre la solicitud pagada; evita generar dos planes por doble envío. */
export async function claimProgramGeneration(applicationId: string): Promise<(() => Promise<void>) | null> {
  const { data, error } = await supabase.from('asesoria_solicitudes').select('notas').eq('id', applicationId).eq('estado', 'pagada').single()
  if (error) throw new Error('[ProgramGeneration:claim] No se pudo consultar la solicitud')
  const notes = data.notas as string | null
  const active = notes?.match(/\[generation:([0-9a-f-]+):(\d+)\]/)
  if (active && Date.now() - Number(active[2]) < 120_000) return null
  const marker = `[generation:${crypto.randomUUID()}:${Date.now()}]`
  const next = `${notes?.replace(/\[generation:[0-9a-f-]+:\d+\]/g, '').trim() ?? ''}\n${marker}`.trim()
  let claim = supabase.from('asesoria_solicitudes').update({ notas: next }).eq('id', applicationId).eq('estado', 'pagada')
  claim = notes === null ? claim.is('notas', null) : claim.eq('notas', notes)
  const { data: claimed, error: claimError } = await claim.select('id').maybeSingle()
  if (claimError) throw new Error('[ProgramGeneration:claim] No se pudo reservar la generación')
  if (!claimed) return null
  return async () => {
    const { data: latest } = await supabase.from('asesoria_solicitudes').select('notas').eq('id', applicationId).single()
    if (typeof latest?.notas !== 'string' || !latest.notas.includes(marker)) return
    await supabase.from('asesoria_solicitudes').update({ notas: latest.notas.replace(marker, '').trim() }).eq('id', applicationId).eq('notas', latest.notas)
  }
}
