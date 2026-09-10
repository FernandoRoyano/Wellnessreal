// Test adaptativo: segmenta contexto, intención y prioridades. No diagnostica.

export type TestAnswers = Record<string, string>

export type QuestionId =
  | 'situacion' | 'objetivo'
  | 'esfuerzo_actual' | 'bloqueo_recomposicion'
  | 'energia' | 'sueno'
  | 'confianza' | 'confusion'
  | 'tipo_apoyo' | 'disponibilidad'
  | 'fuerza' | 'proteina' | 'revision' | 'barrera'

export type IntentId = 'entender' | 'recomponer' | 'energia' | 'guia'
export type ProfileId = 'buena_base' | 'falta_estructura' | 'mucho_esfuerzo' | 'construir_base'

export interface TestQuestion {
  id: QuestionId
  question: string
  personalizedQuestion?: Partial<Record<IntentId, string>>
  hint?: string
  options: { value: string; label: string }[]
}

export interface TestResult {
  profile: ProfileId
  intent: IntentId
  requiresMedicalReview: boolean
  emoji: string
  title: string
  summary: string
  priorities: string[]
  nextStep: string
  cta: { label: string; href: string; description: string }
}

const QUESTIONS: Record<QuestionId, TestQuestion> = {
  situacion: {
    id: 'situacion', question: '¿Cuál es tu situación con la tiroides?',
    options: [
      { value: 'medicada', label: 'Tengo hipotiroidismo o Hashimoto y sigo tratamiento' },
      { value: 'reciente', label: 'Me lo han diagnosticado hace poco' },
      { value: 'sospecha', label: 'Lo sospecho, pero no tengo diagnóstico' },
      { value: 'sin-diagnostico', label: 'No tengo un problema tiroideo diagnosticado' },
    ],
  },
  objetivo: {
    id: 'objetivo', question: '¿Qué te gustaría conseguir principalmente?',
    hint: 'Tu respuesta adaptará las siguientes preguntas a lo que más te importa.',
    options: [
      { value: 'recomponer', label: 'Mejorar mi composición corporal' },
      { value: 'energia', label: 'Organizarme mejor cuando tengo poca energía' },
      { value: 'entender', label: 'Entrenar sin miedo ni confusión' },
      { value: 'guia', label: 'Tener un plan y seguimiento profesional' },
    ],
  },
  esfuerzo_actual: {
    id: 'esfuerzo_actual', question: 'Para mejorar tu composición corporal, ¿qué estás haciendo ahora?',
    options: [
      { value: 'mucho-cardio', label: 'Mucho cardio o intento moverme todo lo posible' },
      { value: 'fuerza', label: 'Entreno fuerza con cierta regularidad' },
      { value: 'dieta', label: 'Me centro sobre todo en comer menos' },
      { value: 'irregular', label: 'Voy probando cosas, pero sin continuidad' },
    ],
  },
  bloqueo_recomposicion: {
    id: 'bloqueo_recomposicion', question: '¿Qué es lo que más te frustra de ese proceso?',
    options: [
      { value: 'sin-cambios', label: 'No veo cambios aunque me esfuerzo' },
      { value: 'hambre', label: 'No puedo sostener las dietas o paso hambre' },
      { value: 'bascula', label: 'La báscula condiciona demasiado cómo me siento' },
      { value: 'sin-plan', label: 'No sé si lo que hago tiene sentido' },
    ],
  },
  energia: {
    id: 'energia', question: 'Pensando en tu energía, ¿cómo suelen ser tus días?',
    options: [
      { value: 'bien', label: 'Bastante estables' },
      { value: 'altibajos', label: 'Tengo bastantes altibajos' },
      { value: 'cansada', label: 'Arrastro cansancio casi siempre' },
      { value: 'impredecible', label: 'Nunca sé cómo voy a encontrarme' },
    ],
  },
  sueno: {
    id: 'sueno', question: 'Cuando tienes menos energía, ¿cómo está siendo tu descanso?',
    options: [
      { value: 'bien', label: 'Duermo y descanso bastante bien' },
      { value: 'regular', label: 'Duermo, pero no siempre descanso' },
      { value: 'mal', label: 'Duermo mal con frecuencia' },
      { value: 'variable', label: 'Cambia mucho según la semana' },
    ],
  },
  confianza: {
    id: 'confianza', question: '¿Qué te genera más dudas cuando piensas en entrenar?',
    options: [
      { value: 'exceso', label: 'No sé si entrenar puede agotarme más' },
      { value: 'tipo', label: 'No sé qué tipo de ejercicio me conviene' },
      { value: 'intensidad', label: 'No sé cuánto esfuerzo es adecuado' },
      { value: 'ninguna', label: 'No tengo miedo, pero encuentro información contradictoria' },
    ],
  },
  confusion: {
    id: 'confusion', question: '¿Sobre qué tema encuentras más información contradictoria?',
    options: [
      { value: 'fuerza-cardio', label: 'Fuerza frente a cardio' },
      { value: 'alimentacion', label: 'Alimentación y proteína' },
      { value: 'sintomas', label: 'Qué hacer cuando no me encuentro igual cada día' },
      { value: 'resultados', label: 'Qué resultados son realistas' },
    ],
  },
  tipo_apoyo: {
    id: 'tipo_apoyo', question: 'Si alguien te guiara, ¿qué ayuda tendría más valor para ti?',
    options: [
      { value: 'plan', label: 'Un plan de entrenamiento adaptado' },
      { value: 'ajustes', label: 'Seguimiento y ajustes cuando algo no funciona' },
      { value: 'habitos', label: 'Ordenar entrenamiento, alimentación y descanso' },
      { value: 'responsabilidad', label: 'Ayuda para mantener la constancia' },
    ],
  },
  disponibilidad: {
    id: 'disponibilidad', question: '¿Qué podrías sostener de forma realista ahora mismo?',
    options: [
      { value: 'tres', label: '3 o más sesiones por semana' },
      { value: 'dos', label: '2 sesiones por semana' },
      { value: 'una', label: '1 sesión y empezar progresivamente' },
      { value: 'incierta', label: 'Todavía no sé cómo encajarlo' },
    ],
  },
  fuerza: {
    id: 'fuerza', question: '¿Entrenas fuerza actualmente?',
    personalizedQuestion: {
      recomponer: 'Para ese objetivo, ¿qué lugar ocupa ahora el entrenamiento de fuerza?',
      energia: 'En las semanas con menos energía, ¿consigues mantener algo de fuerza?',
      entender: 'Ahora mismo, ¿tienes alguna rutina de fuerza como referencia?',
      guia: 'Para adaptar un plan a ti, ¿desde qué punto partiríamos con la fuerza?',
    },
    hint: 'Pesas, máquinas, gomas o ejercicios con tu propio peso.',
    options: [
      { value: 'regular', label: 'Sí, 2 o más días por semana' },
      { value: 'ocasional', label: 'A veces, pero sin continuidad' },
      { value: 'no', label: 'No, o hace mucho que no entreno fuerza' },
    ],
  },
  proteina: {
    id: 'proteina', question: '¿Incluyes una fuente de proteína en tus comidas principales?',
    options: [
      { value: 'habitual', label: 'Sí, de forma habitual' },
      { value: 'variable', label: 'En algunas comidas o algunos días' },
      { value: 'rara', label: 'Rara vez o no sabría decirlo' },
    ],
  },
  revision: {
    id: 'revision', question: '¿Cómo está tu seguimiento médico actualmente?',
    hint: 'No interpretaremos analíticas ni medicación. Solo permite recomendar un paso seguro.',
    options: [
      { value: 'actualizado', label: 'Tengo seguimiento y revisiones actualizadas' },
      { value: 'pendiente', label: 'Tengo una revisión pendiente o hace tiempo que no voy' },
      { value: 'sin-seguimiento', label: 'No tengo seguimiento actualmente' },
      { value: 'no-aplica', label: 'No tengo diagnóstico; no aplica en mi caso' },
    ],
  },
  barrera: {
    id: 'barrera', question: 'Para terminar: ¿qué crees que más te impide avanzar ahora?',
    personalizedQuestion: {
      recomponer: 'Para terminar: ¿qué te impide sostener un plan de recomposición corporal?',
      energia: 'Para terminar: ¿qué te impide adaptar el plan a tu energía real?',
      entender: 'Para terminar: ¿qué necesitas para entrenar con más confianza?',
      guia: 'Para terminar: ¿qué ha impedido que un plan anterior te funcionase?',
    },
    options: [
      { value: 'no-se-como', label: 'No sé exactamente qué hacer' },
      { value: 'constancia', label: 'Me cuesta mantener la constancia' },
      { value: 'cansancio', label: 'El cansancio cambia todos mis planes' },
      { value: 'tiempo', label: 'No encuentro tiempo suficiente' },
      { value: 'abandono', label: 'Empiezo con ganas y termino abandonando' },
      { value: 'sin-resultados', label: 'He probado muchas cosas sin ver resultados' },
    ],
  },
}

export const THYROID_TEST_FIELD_ORDER: readonly string[] = [
  'situacion', 'objetivo', 'esfuerzo_actual', 'bloqueo_recomposicion',
  'energia', 'sueno', 'confianza', 'confusion', 'tipo_apoyo',
  'disponibilidad', 'fuerza', 'proteina', 'revision', 'barrera',
  'profile', 'requires_medical_review',
]

const RESULT_FIELD_LABELS: Record<string, string> = {
  profile: 'Perfil resultante',
  requires_medical_review: 'Revisión médica recomendada',
}

const PROFILE_LABELS: Record<ProfileId, string> = {
  buena_base: 'Buena base: toca afinar',
  falta_estructura: 'Tiene piezas sueltas: necesita estructura',
  mucho_esfuerzo: 'Mucho esfuerzo: necesita dirigirlo mejor',
  construir_base: 'Necesita construir una base',
}

export function getReadableThyroidTestField(key: string, value: unknown): {
  label: string
  value: string
} {
  if (key === 'profile') {
    return {
      label: RESULT_FIELD_LABELS[key],
      value: PROFILE_LABELS[value as ProfileId] ?? String(value),
    }
  }

  if (key === 'requires_medical_review') {
    return {
      label: RESULT_FIELD_LABELS[key],
      value: value === true || value === 'true' ? 'Sí' : 'No',
    }
  }

  const question = QUESTIONS[key as QuestionId]
  if (!question) {
    return { label: key.replaceAll('_', ' '), value: String(value) }
  }

  return {
    label: question.question,
    value: question.options.find((option) => option.value === value)?.label ?? String(value),
  }
}

const BRANCHES: Record<IntentId, QuestionId[]> = {
  recomponer: ['esfuerzo_actual', 'bloqueo_recomposicion'],
  energia: ['energia', 'sueno'],
  entender: ['confianza', 'confusion'],
  guia: ['tipo_apoyo', 'disponibilidad'],
}
const COMMON_END: QuestionId[] = ['fuerza', 'proteina', 'revision', 'barrera']

export function getTestPath(answers: TestAnswers): QuestionId[] {
  const intent = answers.objetivo as IntentId | undefined
  return ['situacion', 'objetivo', ...(intent ? BRANCHES[intent] : []), ...COMMON_END]
}

export function getQuestion(questionId: QuestionId, answers: TestAnswers): TestQuestion {
  const question = QUESTIONS[questionId]
  const intent = answers.objetivo as IntentId | undefined
  return { ...question, question: (intent && question.personalizedQuestion?.[intent]) || question.question }
}

export function getNextQuestionId(currentId: QuestionId, answers: TestAnswers): QuestionId | null {
  const path = getTestPath(answers)
  return path[path.indexOf(currentId) + 1] ?? null
}

export function validateAndSanitizeAnswers(input: TestAnswers): TestAnswers | null {
  if (!input.objetivo || !(input.objetivo in BRANCHES)) return null
  const sanitized: TestAnswers = {}
  for (const questionId of getTestPath(input)) {
    const value = input[questionId]
    if (!QUESTIONS[questionId].options.some((option) => option.value === value)) return null
    sanitized[questionId] = value
  }
  return sanitized
}

function getProfile(answers: TestAnswers): ProfileId {
  const hasGoodBase = answers.fuerza === 'regular' && answers.proteina === 'habitual' &&
    answers.sueno !== 'mal' && answers.barrera !== 'abandono'
  if (hasGoodBase) return 'buena_base'
  if (answers.esfuerzo_actual === 'mucho-cardio' || answers.bloqueo_recomposicion === 'sin-cambios') return 'mucho_esfuerzo'
  if (answers.fuerza === 'no' && (answers.energia === 'cansada' || answers.sueno === 'mal' || answers.disponibilidad === 'una')) {
    return 'construir_base'
  }
  return 'falta_estructura'
}

const PROFILE_COPY: Record<ProfileId, Pick<TestResult, 'emoji' | 'title' | 'summary'>> = {
  buena_base: { emoji: '🟢', title: 'Buena base: toca afinar', summary: 'Ya tienes varias piezas importantes en marcha. Tu oportunidad no parece estar en empezar de cero, sino en dar estructura y progresión a lo que haces.' },
  falta_estructura: { emoji: '🟡', title: 'Tienes piezas sueltas: toca ordenarlas', summary: 'Tus respuestas apuntan a que no necesitas añadir más cosas, sino convertir lo que ya intentas en un plan claro, sostenible y revisable.' },
  mucho_esfuerzo: { emoji: '🟠', title: 'Mucho esfuerzo: toca dirigirlo mejor', summary: 'Parece que ya estás poniendo energía en cambiar, pero no siempre dentro de una estrategia que puedas medir y sostener. El siguiente paso es priorizar, no exigirte más.' },
  construir_base: { emoji: '🔵', title: 'Primero, construye una base', summary: 'Tus respuestas sugieren que te conviene empezar con pocas acciones, bien elegidas y adaptadas a tu situación actual, antes de buscar un plan más exigente.' },
}

const INTENT_PRIORITY: Record<IntentId, string> = {
  recomponer: 'Medir el progreso con más señales que el peso y sostener una progresión de fuerza.',
  energia: 'Ajustar la carga de entrenamiento a tu recuperación sin abandonar por completo el movimiento.',
  entender: 'Tener criterios claros para entrenar sin depender de mensajes contradictorios.',
  guia: 'Traducir tu situación en un plan concreto con seguimiento y ajustes.',
}

export function buildTestResult(answers: TestAnswers): TestResult {
  const intent = answers.objetivo as IntentId
  const profile = getProfile(answers)
  const requiresMedicalReview = ['reciente', 'sospecha'].includes(answers.situacion) ||
    ['pendiente', 'sin-seguimiento'].includes(answers.revision)
  const copy = PROFILE_COPY[profile]
  const priorities = [
    INTENT_PRIORITY[intent],
    answers.fuerza === 'regular' ? 'Mantener la fuerza y progresar con un criterio claro.' : 'Construir una rutina de fuerza asumible desde tu punto de partida.',
    answers.barrera === 'tiempo' ? 'Diseñar el plan alrededor del tiempo que realmente tienes.' : 'Elegir una acción pequeña que puedas repetir incluso en semanas difíciles.',
  ]

  if (requiresMedicalReview) {
    return {
      profile, intent, requiresMedicalReview, ...copy,
      title: 'Primero, asegura el seguimiento médico',
      summary: `${copy.summary} Además, conviene revisar la parte médica antes de atribuir síntomas o cambios a la tiroides.`,
      priorities: ['Solicitar o actualizar tu revisión con el profesional sanitario correspondiente.', ...priorities.slice(0, 2)],
      nextStep: 'Este test no diagnostica ni interpreta analíticas. Cuando tu profesional confirme que puedes entrenar, empieza con una base progresiva y adaptada.',
      cta: { label: 'Entrar en la comunidad gratis', href: '/comunidad/entrar', description: 'Aprende a ordenar entrenamiento y hábitos mientras mantienes la parte médica donde corresponde.' },
    }
  }

  const wantsGuidance = intent === 'guia'
  return {
    profile, intent, requiresMedicalReview, ...copy, priorities,
    nextStep: wantsGuidance ? 'Por tu objetivo, tiene sentido valorar un plan adaptado y comprobar si WellnessReal encaja contigo.' : 'Empieza aplicando estas prioridades y utiliza la comunidad para resolver dudas y ganar consistencia.',
    cta: wantsGuidance
      ? { label: 'Ver el Método BASE Tiroides', href: `/metodo-tiroides?source=test-tiroides&profile=${profile}&intent=${intent}#solicitud`, description: 'Programa acompañado de 12 semanas. Primero revisamos tu solicitud; no pagarás nada ahora.' }
      : { label: 'Entrar en la comunidad gratis', href: '/comunidad/entrar', description: 'Contenido y apoyo para poner en práctica tu siguiente paso.' },
  }
}
