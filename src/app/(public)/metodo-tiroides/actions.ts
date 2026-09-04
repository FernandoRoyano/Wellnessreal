'use server'

import { z } from 'zod'
import { createAsesoriaSolicitud } from '@/lib/db/comunidad'

const applicationSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.').max(100),
  email: z.email('Escribe un email válido.'),
  phone: z.string().trim().min(9, 'Escribe un teléfono válido.').max(30),
  goal: z.string().trim().min(20, 'Cuéntame un poco más sobre lo que quieres conseguir.').max(1500),
  days: z.enum(['1', '2', '3', '4+']),
  liveAvailability: z.enum(['si', 'algunas', 'diferido']),
  limitations: z.string().trim().max(1000).optional(),
})

export interface ThyroidApplicationState {
  success: boolean
  error?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof applicationSchema>, string[]>>
}

export async function applyToThyroidProgram(
  _previous: ThyroidApplicationState,
  formData: FormData
): Promise<ThyroidApplicationState> {
  const parsed = applicationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    goal: formData.get('goal'),
    days: formData.get('days'),
    liveAvailability: formData.get('liveAvailability'),
    limitations: formData.get('limitations') || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos marcados.', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    await createAsesoriaSolicitud({
      memberId: null,
      nombre: parsed.data.name,
      email: parsed.data.email,
      telefono: parsed.data.phone,
      objetivo: parsed.data.goal,
      diasSemana: parsed.data.days,
      lesiones: parsed.data.limitations,
      disponibilidadDirecto: parsed.data.liveAvailability,
    })
    return { success: true }
  } catch (error) {
    console.error('[MetodoTiroides:applyToThyroidProgram]', error)
    return { success: false, error: 'No se pudo enviar la solicitud. Inténtalo de nuevo o escríbeme por WhatsApp.' }
  }
}
