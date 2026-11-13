export const COMMUNITY_QUESTIONS = [
  { id: 'aplicar', title: '¿Qué idea has podido aplicar?', hint: 'Puedes contar una acción de organización o algo que hayas aprendido. No necesitas explicar tu historia personal.' },
  { id: 'organizar', title: '¿Qué te cuesta organizar esta semana?', hint: 'Por ejemplo, reservar tiempo, preparar material o elegir por dónde empezar. Evita datos clínicos o de otras personas.' },
  { id: 'continuar', title: '¿Qué te gustaría repetir o cambiar?', hint: 'Elige una cosa que haya encajado o una dificultad de organización. Puedes dejar el cuerpo vacío y editar el título.' },
] as const

interface WeeklyTopic {
  title: string
  space: string
  lesson: string
  resource: string
  file: string
  action: string
  question: typeof COMMUNITY_QUESTIONS[number]['id']
  article?: { slug: string; title: string }
}

const TOPICS: readonly WeeklyTopic[] = [
  { title: 'Hacer sitio a una primera acción', space: 'entrena-organizate', lesson: 'por-que-empezar-con-fuerza', resource: 'Planificador semanal', file: 'planificador-semanal-tiroides.pdf', action: 'Reserva un momento posible y escribe una alternativa. Puede ser para leer o preparar material, sin obligación de entrenar hoy.', question: 'organizar' },
  { title: 'Revisar lo que cabe en tu semana', space: 'entrena-organizate', lesson: 'organizar-dos-dias', resource: 'Registro semanal', file: 'registro-semanal-tiroides.pdf', action: 'Anota qué pudiste hacer y qué se interpuso. Elige una sola cosa para mantener o ajustar.', question: 'continuar' },
  { title: 'Simplificar una comida cotidiana', space: 'entrena-organizate', lesson: 'alimentacion-practica', resource: 'Planificador semanal', file: 'planificador-semanal-tiroides.pdf', action: 'Deja prevista una comida que ya sepas preparar y una alternativa sencilla. No es un menú ni una pauta clínica.', question: 'aplicar' },
  { title: 'Observar antes de añadir más', space: 'entrena-organizate', lesson: 'descanso-recuperacion', resource: 'Semáforo de energía', file: 'semaforo-energia-tiroides.pdf', action: 'Revisa cómo ha encajado tu semana. El recurso organiza observaciones; no diagnostica ni da permiso para ignorar síntomas.', question: 'continuar' },
  { title: 'Decidir antes de comprar un suplemento', space: 'entrena-organizate', lesson: 'alimentacion-practica', resource: 'Planificador semanal', file: 'planificador-semanal-tiroides.pdf', action: 'Elige una promesa publicitaria y escribe qué resultado promete y qué evidencia cita. La actividad no consiste en empezar o suspender productos ni en compartir analíticas.', question: 'aplicar', article: { slug: 'suplementos-mujeres-guia-evidencia', title: 'Suplementos: decidir con evidencia y contexto' } },
  { title: 'Revisar un plan que exige demasiado', space: 'entrena-organizate', lesson: 'descanso-recuperacion', resource: 'Registro semanal', file: 'registro-semanal-tiroides.pdf', action: 'Anota qué parte de tu organización podrías simplificar. Si hay síntomas o preocupación por la comida, la siguiente decisión necesita ayuda adecuada; no otro recorte ni una prueba en el foro.', question: 'organizar', article: { slug: 'dietas-extremas-frenan-tiroides', title: 'Dietas extremas, metabolismo y tiroides' } },
  { title: 'Adaptar la semana sin etiquetas rápidas', space: 'entrena-organizate', lesson: 'organizar-dos-dias', resource: 'Planificador semanal', file: 'planificador-semanal-tiroides.pdf', action: 'Prepara dos opciones de agenda: una para tu semana habitual y otra con menos tiempo. Comparte, si quieres, una idea de organización; la valoración de síntomas se hace en consulta.', question: 'continuar', article: { slug: 'menopausia-y-tiroides', title: 'Menopausia e hipotiroidismo: síntomas que se solapan' } },
  { title: 'Observar la respuesta al entrenamiento', space: 'entrena-organizate', lesson: 'descanso-recuperacion', resource: 'Semáforo de energía', file: 'semaforo-energia-tiroides.pdf', action: 'Revisa qué te ayuda a describir una sesión: ejercicio, cambios y respuesta posterior. El registro sirve para explicar lo ocurrido, no para decidir si un dolor es benigno o diagnosticarte.', question: 'aplicar', article: { slug: 'agujetas-cansancio-debilidad-tiroides', title: 'Agujetas, cansancio y debilidad: diferencias y límites' } },
]

export function getCommunityWeeklyPlan(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(part => part.type === type)?.value)
  const date = new Date(Date.UTC(get('year'), get('month') - 1, get('day')))
  const monday = date.getTime() - ((date.getUTCDay() + 6) % 7) * 86_400_000
  const week = Math.floor((monday - Date.UTC(2026, 10, 9)) / (7 * 86_400_000))
  const format = (value: number) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(value))
  return [0, 1].map(offset => {
    const index = ((week + offset) % TOPICS.length + TOPICS.length) % TOPICS.length
    const start = monday + offset * 7 * 86_400_000
    return { ...TOPICS[index], label: offset === 0 ? 'Esta semana' : 'La siguiente semana', period: `${format(start)} – ${format(start + 6 * 86_400_000)}` }
  })
}
