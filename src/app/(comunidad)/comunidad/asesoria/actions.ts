'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSessionMember, isApproved, createAsesoriaSolicitud } from '@/lib/db/comunidad'

export interface SolicitudResult {
  ok: boolean
  error?: string
}

/** Solicitud de plaza para el Grupo Tiroides. Fernando cierra a mano. */
export async function solicitarPlazaAction(
  _prev: SolicitudResult | null,
  formData: FormData
): Promise<SolicitudResult> {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')
  if (!isApproved(member)) return { ok: false, error: 'Tu acceso aún no está aprobado.' }

  const objetivo = String(formData.get('objetivo') ?? '').trim()
  if (!objetivo) {
    return { ok: false, error: 'Cuéntame qué te gustaría conseguir.' }
  }

  try {
    await createAsesoriaSolicitud({
      memberId: member.id,
      nombre: member.display_name,
      email: member.email,
      telefono: String(formData.get('telefono') ?? '').trim() || undefined,
      objetivo,
      diasSemana: String(formData.get('dias_semana') ?? '').trim() || undefined,
      lesiones: String(formData.get('lesiones') ?? '').trim() || undefined,
      disponibilidadDirecto:
        String(formData.get('disponibilidad_directo') ?? '').trim() || undefined,
    })
  } catch (err) {
    console.error('[comunidad:solicitarPlaza]', err)
    return { ok: false, error: 'No se pudo enviar la solicitud. Inténtalo de nuevo.' }
  }

  revalidatePath('/comunidad/asesoria')
  return { ok: true }
}
