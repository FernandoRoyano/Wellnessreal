// ============================================================
//  Test de tiroides · motor (preguntas, scoring y niveles)
//  Mecánica estilo osteofit: 8 preguntas -> nivel + siguiente paso.
//  NO es un diagnóstico: mide cuánto te frena y a dónde te lleva.
//  Punto único para tocar preguntas, puntos, banderas rojas y copy.
// ============================================================

export interface TestOption {
  value: string
  label: string
  /** Puntos que suma esta opción (más = más margen de mejora / más síntomas). */
  points: number
  /** Si true, esta respuesta fuerza el nivel más alto (bandera roja → médico). */
  redFlag?: boolean
}

export interface TestQuestion {
  id: string
  /** Pregunta corta para la cabecera del paso. */
  question: string
  /** Ayuda opcional bajo la pregunta. */
  hint?: string
  options: TestOption[]
  /** Si true, no puntúa: solo segmenta la intención para el copy. */
  segmentOnly?: boolean
}

export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 'situacion',
    question: '¿Cuál es tu situación con la tiroides?',
    options: [
      { value: 'medicada', label: 'Tengo hipotiroidismo o Hashimoto y tomo medicación', points: 0 },
      { value: 'sin-tratar', label: 'Me lo han diagnosticado hace poco o aún sin tratar', points: 2, redFlag: true },
      { value: 'sospecha', label: 'Lo sospecho, pero no tengo diagnóstico', points: 2, redFlag: true },
      { value: 'no', label: 'No la tengo, pero me interesa el tema', points: 0 },
    ],
  },
  {
    id: 'energia',
    question: '¿Cómo está tu energía en el día a día?',
    options: [
      { value: 'bien', label: 'Bien, llego con energía', points: 0 },
      { value: 'altibajos', label: 'Regular, tengo altibajos', points: 1 },
      { value: 'cansada', label: 'Arrastro cansancio casi siempre', points: 2 },
    ],
  },
  {
    id: 'peso',
    question: '¿Y con el peso o cómo te ves?',
    options: [
      { value: 'estable', label: 'Estable y a gusto', points: 0 },
      { value: 'cuesta', label: 'Me cuesta, pero voy tirando', points: 1 },
      { value: 'atascada', label: 'No se mueve haga lo que haga, o va a peor', points: 2 },
    ],
  },
  {
    id: 'sueno',
    question: '¿Cómo descansas?',
    options: [
      { value: 'bien', label: 'Duermo bien', points: 0 },
      { value: 'regular', label: 'Regular', points: 1 },
      { value: 'mal', label: 'Duermo mal casi siempre', points: 2 },
    ],
  },
  {
    id: 'fuerza',
    question: '¿Entrenas fuerza dos o más días por semana?',
    hint: 'Fuerza de verdad: pesas, gomas, tu propio peso… no solo caminar o clases suaves.',
    options: [
      { value: 'si', label: 'Sí, de forma regular', points: 0 },
      { value: 'aveces', label: 'A veces, o hago otras cosas', points: 1 },
      { value: 'no', label: 'No, o hace mucho que no', points: 2 },
    ],
  },
  {
    id: 'proteina',
    question: '¿Sueles comer proteína en cada comida?',
    hint: 'Carne, pescado, huevo, legumbre, lácteo…',
    options: [
      { value: 'siempre', label: 'Casi siempre, en la mayoría de comidas', points: 0 },
      { value: 'aveces', label: 'A veces', points: 1 },
      { value: 'raro', label: 'Rara vez, no me lo planteo', points: 2 },
    ],
  },
  {
    id: 'revision',
    question: '¿Cuándo fue tu última revisión con el endocrino o analítica?',
    options: [
      { value: 'reciente', label: 'Hace menos de 6 meses', points: 0 },
      { value: 'medio', label: 'Entre 6 meses y un año', points: 1 },
      { value: 'lejana', label: 'Hace más de un año, o no lo recuerdo', points: 2, redFlag: true },
      { value: 'nunca', label: 'Nunca me la he hecho', points: 2, redFlag: true },
    ],
  },
  {
    id: 'objetivo',
    question: 'Y sobre todo, ¿qué es lo que más te gustaría?',
    segmentOnly: true,
    options: [
      { value: 'entender', label: 'Entender qué me pasa y perder el miedo', points: 0 },
      { value: 'recomponer', label: 'Adelgazar o recomponer sin dietas de hambre', points: 0 },
      { value: 'energia', label: 'Tener energía y dejar de arrastrarme', points: 0 },
      { value: 'guia', label: 'Que alguien me guíe paso a paso', points: 0 },
    ],
  },
]

export type TestAnswers = Record<string, string>

export type NivelId = 'encaminada' | 'margen' | 'prioridad'

export interface Nivel {
  id: NivelId
  emoji: string
  titulo: string
  /** Resumen que ve en la pantalla de resultado. */
  resumen: string
  /** Bloque de "tu siguiente paso". */
  siguientePaso: string
  /** true → el resultado prioriza ir al médico (bandera roja). */
  derivaMedico: boolean
}

export const NIVELES: Record<NivelId, Nivel> = {
  encaminada: {
    id: 'encaminada',
    emoji: '🟢',
    titulo: 'Buena base, a afinar',
    resumen:
      'Tu tiroides no te está frenando de más y ya haces bastante bien. Estás en el punto en el que los detalles marcan la diferencia: afinar la fuerza, la proteína y el descanso para exprimir lo que ya tienes.',
    siguientePaso:
      'Entra en la comunidad gratuita: tienes contenido para entender tu tiroides a fondo y pulir lo que te falte, a tu ritmo.',
    derivaMedico: false,
  },
  margen: {
    id: 'margen',
    emoji: '🟡',
    titulo: 'Con margen (y mucho por ganar)',
    resumen:
      'Tu tiroides te está pasando factura y, sobre todo, te falta la base que de verdad mueve la aguja: fuerza y proteína. La buena noticia es que ahí es donde más rápido se notan los cambios. No te falta esfuerzo, te falta el método.',
    siguientePaso:
      'Empieza por la comunidad gratuita para montar la base paso a paso. Y cuando quieras que lo adaptemos del todo a tu caso, ahí está el Grupo Tiroides.',
    derivaMedico: false,
  },
  prioridad: {
    id: 'prioridad',
    emoji: '🟠',
    titulo: 'Toca priorizarte',
    resumen:
      'Estás arrastrando bastante, y por lo que cuentas conviene asegurarse de que la parte médica está bien atada antes de nada. Que quede claro: esto no es un diagnóstico. Es una señal de que mereces mirarlo con calma.',
    siguientePaso:
      'Tu primer paso es una revisión con tu médico o endocrino (una analítica lo aclara). Y en paralelo, no lo hagas sola: entra en la comunidad gratuita para entender lo que te pasa y acompañarte mientras tanto.',
    derivaMedico: true,
  },
}

/**
 * Calcula el nivel a partir de las respuestas.
 * - Cualquier bandera roja → 'prioridad'.
 * - Si no, por puntos: 0-3 encaminada · 4-8 margen · 9+ margen/prioridad.
 */
export function calcularNivel(answers: TestAnswers): NivelId {
  let puntos = 0
  let banderaRoja = false

  for (const q of TEST_QUESTIONS) {
    if (q.segmentOnly) continue
    const val = answers[q.id]
    const opt = q.options.find((o) => o.value === val)
    if (!opt) continue
    puntos += opt.points
    if (opt.redFlag) banderaRoja = true
  }

  if (banderaRoja) return 'prioridad'
  if (puntos <= 3) return 'encaminada'
  return 'margen'
}
