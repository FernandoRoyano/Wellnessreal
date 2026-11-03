import { supabase } from '@/lib/supabase'
import { readLifecycle } from '@/lib/thyroid-lifecycle'
import { programProgress } from '@/lib/program-calendar'

/** El registro del recorrido conserva su inicio aunque cambie la versión vigente. */
export async function getThyroidProgramProgress(clientId: string, email: string, now = Date.now()) {
  const [{ data: application, error: paymentError }, { data: firstApproval, error: approvalError }] = await Promise.all([
    supabase.from('asesoria_solicitudes').select('notas').eq('estado', 'pagada')
      .ilike('email', email.replace(/[\\%_]/g, '\\$&')).order('creado_en', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('programas_generados').select('revisado_en').eq('cliente_id', clientId).eq('revisado', true)
      .not('revisado_en', 'is', null).order('revisado_en', { ascending: true }).limit(1).maybeSingle(),
  ])
  if (paymentError || approvalError) throw new Error('[ThyroidProgress:read] No se pudo consultar el inicio del programa')
  const start = readLifecycle(application?.notas ?? null).startedAt ?? firstApproval?.revisado_en ?? null
  return { ...programProgress(start, now), hasThyroidPayment: Boolean(application) }
}
