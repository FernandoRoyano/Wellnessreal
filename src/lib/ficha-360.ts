export const FICHA_360_GROUPS = [
  { title: 'Tu semana real', ids: ['actividad_laboral', 'horario_trabajo', 'detalle_turnos', 'dia_normal', 'responsabilidades', 'variabilidad_rutina', 'fin_semana'] },
  { title: 'Alimentación', ids: ['ubicacion_comidas', 'comidas_dia', 'comidas_fuera_semana', 'tipo_comida_fuera', 'quien_cocina', 'tiempo_cocinar', 'registro_ayer', 'momento_dificil', 'que_ocurre', 'mantener_comida', 'no_gusta', 'limitaciones_alimentarias', 'detalle_limitacion', 'bebidas'] },
  { title: 'Entrenamiento', ids: ['actividades_previas', 'historial_entreno', 'entreno_disfruta', 'preferencia_compania', 'preferencia_lugar', 'preferencia_estructura', 'rechazo_ejercicios', 'movimiento_diario', 'barreras_constancia'] },
  { title: 'Energía, sueño y estrés', ids: ['energia_dia', 'estres', 'origen_estres', 'efecto_estres', 'horas_sueno', 'descanso'] },
  { title: 'Objetivo y estrategia', ids: ['cambio_impacto', 'exito_tres_meses', 'mayor_dificultad', 'minimo_entreno', 'minimo_alimentacion', 'acompanamiento', 'algo_mas'] },
] as const

export const FICHA_360_LABELS: Record<string, string> = {
  actividad_laboral: 'Actividad principal', horario_trabajo: 'Horario', detalle_turnos: 'Organización de turnos', dia_normal: 'Día normal', responsabilidades: 'Responsabilidades', variabilidad_rutina: 'Variabilidad semanal', fin_semana: 'Fines de semana', ubicacion_comidas: 'Lugar de las comidas', comidas_dia: 'Comidas al día', comidas_fuera_semana: 'Comidas fuera por semana', tipo_comida_fuera: 'Cómo come fuera', quien_cocina: 'Compra y cocina', tiempo_cocinar: 'Tiempo para cocinar', registro_ayer: 'Qué comió ayer', momento_dificil: 'Momentos difíciles', que_ocurre: 'Qué ocurre', mantener_comida: 'Quiere mantener', no_gusta: 'No le gusta', limitaciones_alimentarias: 'Limitaciones alimentarias', detalle_limitacion: 'Detalle de limitaciones', bebidas: 'Bebidas', actividades_previas: 'Actividades previas', historial_entreno: 'Historial de entrenamiento', entreno_disfruta: 'Entrenamiento preferido', preferencia_compania: 'Compañía', preferencia_lugar: 'Lugar', preferencia_estructura: 'Estructura', rechazo_ejercicios: 'Rechazos o inseguridades', movimiento_diario: 'Movimiento diario', barreras_constancia: 'Barreras de constancia', energia_dia: 'Energía', estres: 'Estrés (0–10)', origen_estres: 'Origen del estrés', efecto_estres: 'Efecto del estrés', horas_sueno: 'Horas de sueño', descanso: 'Descanso al despertar', cambio_impacto: 'Cambios de mayor impacto', exito_tres_meses: 'Éxito a tres meses', mayor_dificultad: 'Mayor dificultad', minimo_entreno: 'Mínimo de entrenamiento', minimo_alimentacion: 'Mínimo de alimentación', acompanamiento: 'Acompañamiento preferido', algo_mas: 'Algo más', telefono: 'Teléfono',
}

export type Ficha360Answer = string | string[] | Record<string, string>

export function formatFicha360Answer(value: Ficha360Answer): string {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return Object.entries(value).map(([key, item]) => `${key}: ${item}`).join(' · ')
  return value
}
