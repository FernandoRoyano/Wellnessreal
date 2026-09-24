import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

const AnswerSchema = z.union([z.string().max(5000), z.array(z.string().max(200)).max(30), z.record(z.string(), z.string().max(200))])
const SubmissionSchema = z.object({ answers: z.record(z.string().max(80), AnswerSchema) })

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character)
}

function formatValue(value: z.infer<typeof AnswerSchema>) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return Object.entries(value).map(([key, item]) => `${key}: ${item}`).join(' · ')
  return value
}

const LABELS: Record<string, string> = {
  actividad_laboral: 'Actividad principal', horario_trabajo: 'Horario', detalle_turnos: 'Organización de turnos', dia_normal: 'Día normal', responsabilidades: 'Responsabilidades', variabilidad_rutina: 'Variabilidad semanal', fin_semana: 'Fines de semana', ubicacion_comidas: 'Lugar de las comidas', comidas_dia: 'Comidas al día', comidas_fuera_semana: 'Comidas fuera/semana', tipo_comida_fuera: 'Cómo come fuera', quien_cocina: 'Compra y cocina', tiempo_cocinar: 'Tiempo para cocinar', registro_ayer: 'Qué comió ayer', momento_dificil: 'Momentos difíciles', que_ocurre: 'Qué ocurre', mantener_comida: 'Quiere mantener', no_gusta: 'No le gusta', limitaciones_alimentarias: 'Limitaciones alimentarias', detalle_limitacion: 'Detalle de limitaciones', bebidas: 'Bebidas', actividades_previas: 'Actividades previas', historial_entreno: 'Historial de entrenamiento', entreno_disfruta: 'Entrenamiento preferido', preferencia_compania: 'Compañía', preferencia_lugar: 'Lugar', preferencia_estructura: 'Estructura', rechazo_ejercicios: 'Rechazos o inseguridades', movimiento_diario: 'Movimiento diario', barreras_constancia: 'Barreras de constancia', energia_dia: 'Energía', estres: 'Estrés (0–10)', origen_estres: 'Origen del estrés', efecto_estres: 'Efecto del estrés', horas_sueno: 'Horas de sueño', descanso: 'Descanso al despertar', cambio_impacto: 'Cambios de mayor impacto', exito_tres_meses: 'Éxito a tres meses', mayor_dificultad: 'Mayor dificultad', minimo_entreno: 'Mínimo de entrenamiento', minimo_alimentacion: 'Mínimo de alimentación', acompanamiento: 'Acompañamiento preferido', algo_mas: 'Algo más', telefono: 'Teléfono',
}

const GROUPS = [
  { title: 'Semana real', ids: ['actividad_laboral', 'horario_trabajo', 'detalle_turnos', 'dia_normal', 'responsabilidades', 'variabilidad_rutina', 'fin_semana'] },
  { title: 'Alimentación', ids: ['ubicacion_comidas', 'comidas_dia', 'comidas_fuera_semana', 'tipo_comida_fuera', 'quien_cocina', 'tiempo_cocinar', 'registro_ayer', 'momento_dificil', 'que_ocurre', 'mantener_comida', 'no_gusta', 'limitaciones_alimentarias', 'detalle_limitacion', 'bebidas'] },
  { title: 'Entrenamiento', ids: ['actividades_previas', 'historial_entreno', 'entreno_disfruta', 'preferencia_compania', 'preferencia_lugar', 'preferencia_estructura', 'rechazo_ejercicios', 'movimiento_diario', 'barreras_constancia'] },
  { title: 'Energía, sueño y estrés', ids: ['energia_dia', 'estres', 'origen_estres', 'efecto_estres', 'horas_sueno', 'descanso'] },
  { title: 'Estrategia', ids: ['cambio_impacto', 'exito_tres_meses', 'mayor_dificultad', 'minimo_entreno', 'minimo_alimentacion', 'acompanamiento', 'algo_mas'] },
]

function emailSection(title: string, ids: string[], answers: Record<string, z.infer<typeof AnswerSchema>>) {
  const rows = ids.flatMap((id) => {
    const value = answers[id]
    if (!value || (Array.isArray(value) && value.length === 0)) return []
    return [`<tr><td style="padding:8px 12px;color:#662D91;font-weight:bold;vertical-align:top;width:32%">${escapeHtml(LABELS[id] ?? id)}</td><td style="padding:8px 12px;color:#333;white-space:pre-line">${escapeHtml(formatValue(value))}</td></tr>`]
  }).join('')
  return rows ? `<h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:28px">${title}</h2><table style="width:100%;border-collapse:collapse">${rows}</table>` : ''
}

export async function POST(request: NextRequest) {
  try {
    const parsed = SubmissionSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Hay respuestas que no tienen el formato esperado.' }, { status: 400 })
    const { answers } = parsed.data
    const nombre = typeof answers.nombre === 'string' ? answers.nombre.trim() : ''
    const email = typeof answers.email === 'string' ? answers.email.trim().toLowerCase() : ''
    if (nombre.length < 2 || !z.string().email().safeParse(email).success) return NextResponse.json({ error: 'Revisa el nombre y el email.' }, { status: 400 })

    const { error: databaseError } = await supabase.from('cliente_fichas_360').insert({ nombre, email, telefono: typeof answers.telefono === 'string' ? answers.telefono.trim() || null : null, respuestas: answers })
    if (databaseError) throw new Error(`[Ficha360:guardar] ${databaseError.message}`)

    const sections = GROUPS.map((group) => emailSection(group.title, group.ids, answers)).join('')
    await sendEmail({
      to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'], replyTo: email,
      subject: `[Ficha 360] ${nombre}`,
      html: `<div style="background:#f4f4f4;padding:24px;font-family:Arial,sans-serif"><div style="max-width:760px;margin:auto;background:white"><header style="background:#16122B;padding:24px"><h1 style="margin:0;color:#FCEE21;font-size:24px">Ficha 360 · ${escapeHtml(nombre)}</h1><p style="color:#ccc;margin:8px 0 0">${escapeHtml(email)}</p></header><main style="padding:24px">${sections}</main></div></div>`,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Ficha360:POST]', error)
    return NextResponse.json({ error: 'No se pudo guardar la ficha. Inténtalo de nuevo.' }, { status: 500 })
  }
}
