import { supabase } from '@/lib/supabase'

export interface ApplicationRecord {
  id: string
  nombre: string
  email: string
  member_id: string | null
  estado: string
  notas: string | null
}

/** Comparación e intercambio: conserva pagos, reservas y avisos concurrentes. */
export async function mutateApplication(
  id: string,
  change: (application: ApplicationRecord) => { notas: string; estado?: string } | null,
): Promise<ApplicationRecord> {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const { data, error } = await supabase.from('asesoria_solicitudes')
      .select('id,nombre,email,member_id,estado,notas').eq('id', id).single()
    if (error || !data) throw new Error('[Asesoria:mutate] No se pudo consultar la solicitud')
    const application = data as ApplicationRecord
    const patch = change(application)
    if (!patch) return application
    let query = supabase.from('asesoria_solicitudes').update(patch).eq('id', id).eq('estado', application.estado)
    query = application.notas === null ? query.is('notas', null) : query.eq('notas', application.notas)
    const { data: updated, error: updateError } = await query
      .select('id,nombre,email,member_id,estado,notas').maybeSingle()
    if (updateError) throw new Error('[Asesoria:mutate] No se pudo actualizar la solicitud')
    if (updated) return updated as ApplicationRecord
  }
  throw new Error('[Asesoria:mutate] La solicitud está siendo modificada; reintentar')
}
