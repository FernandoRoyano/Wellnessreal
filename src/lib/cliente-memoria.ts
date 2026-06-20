// ============================================================
//  Método BASE · Memoria del cliente
//  Ensambla todo lo que la IA necesita saber para un ajuste
//  quirúrgico: la ficha canónica + el plan vigente + el historial
//  reciente. La IA NUNCA parte de cero: parte de aquí.
// ============================================================

import { supabase } from '@/lib/supabase'
import type { Programa } from '@/lib/programa-schema'

export interface PerfilCliente {
  id: string
  nombre: string
  email: string
  objetivo_principal: string | null
  objetivos_secundarios: string[] | null
  donde_entrena: string | null
  horario_entreno: string | null
  material: string | null
  dias_semana: number | null
  minutos_sesion: number | null
  experiencia: string | null
  lesiones: string | null
  medicacion: string | null
  dormir_calidad: string | null
  dormir_horas: string | null
  comidas_dia: string | null
  alergias: string | null
  preferencias_comida: string | null
  no_le_gusta: string | null
  hambre: string | null
  digestion: string | null
  estilo_vida: string | null
  fase_actual: number | null
  semana_actual: number | null
  estado_programa: string | null
}

export interface EventoCliente {
  id: string
  creado_en: string
  semana: number | null
  tipo: string
  contenido: Record<string, unknown>
}

export interface ProgramaVigente {
  id: string
  version: number
  programa: Programa
}

export interface ContextoCliente {
  perfil: PerfilCliente
  programaVigente: ProgramaVigente | null
  eventos: EventoCliente[]
  texto: string
}

export async function construirContextoCliente(clienteId: string): Promise<ContextoCliente> {
  const [{ data: perfil, error: errPerfil }, { data: vigente }, { data: eventos }] = await Promise.all([
    supabase.from('cliente_perfil').select('*').eq('id', clienteId).single(),
    supabase
      .from('programas_generados')
      .select('id, version, programa')
      .eq('cliente_id', clienteId)
      .eq('vigente', true)
      .maybeSingle(),
    supabase
      .from('eventos_cliente')
      .select('id, creado_en, semana, tipo, contenido')
      .eq('cliente_id', clienteId)
      .order('creado_en', { ascending: false })
      .limit(15),
  ])

  if (errPerfil || !perfil) {
    throw new Error('[cliente-memoria] No se encontró el perfil del cliente.')
  }

  const p = perfil as PerfilCliente
  const eventosList = (eventos || []) as EventoCliente[]
  const programaVigente = (vigente as ProgramaVigente | null) ?? null

  // --- Texto para el prompt: ficha + historial legible ---
  const ficha = [
    `Nombre: ${p.nombre}`,
    `Objetivo principal: ${p.objetivo_principal ?? '—'}`,
    `Objetivos secundarios: ${(p.objetivos_secundarios ?? []).join(', ') || '—'}`,
    `Dónde entrena: ${p.donde_entrena ?? '—'} · Material: ${p.material ?? '—'}`,
    `Disponibilidad: ${p.dias_semana ?? '?'} días/sem · ${p.minutos_sesion ?? '?'} min/sesión · Franja: ${p.horario_entreno ?? '—'}`,
    `Experiencia: ${p.experiencia ?? '—'}`,
    `Lesiones / limitaciones: ${p.lesiones ?? 'ninguna reportada'}`,
    `Medicación: ${p.medicacion ?? 'ninguna'}`,
    `Sueño: ${p.dormir_calidad ?? '—'}${p.dormir_horas ? `, ${p.dormir_horas} h` : ''}`,
    `Comidas/día preferidas: ${p.comidas_dia ?? '—'}`,
    `Alergias: ${p.alergias ?? 'ninguna'} · Le gusta: ${p.preferencias_comida ?? '—'} · NO comerá: ${p.no_le_gusta ?? '—'}`,
    `Hambre/ansiedad: ${p.hambre ?? '—'} · Digestiones: ${p.digestion ?? '—'}`,
    `Estilo de vida: ${p.estilo_vida ?? '—'}`,
    `Fase actual: ${p.fase_actual ?? 1} · Semana actual: ${p.semana_actual ?? 1} · Estado: ${p.estado_programa ?? 'activo'}`,
  ].join('\n')

  const historial = eventosList.length
    ? eventosList
        .slice()
        .reverse()
        .map((e) => {
          const fecha = new Date(e.creado_en).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
          const detalle =
            typeof e.contenido?.texto === 'string'
              ? e.contenido.texto
              : typeof e.contenido?.mensaje === 'string'
              ? e.contenido.mensaje
              : Array.isArray(e.contenido?.resumen_cambios)
              ? (e.contenido.resumen_cambios as string[]).join('; ')
              : JSON.stringify(e.contenido)
          return `- [${fecha}] (${e.tipo}${e.semana ? `, sem ${e.semana}` : ''}) ${detalle}`
        })
        .join('\n')
    : '- (sin historial todavía)'

  const texto = `FICHA DEL CLIENTE (memoria canónica):\n${ficha}\n\nHISTORIAL RECIENTE (lo más antiguo primero):\n${historial}`

  return { perfil: p, programaVigente, eventos: eventosList, texto }
}
