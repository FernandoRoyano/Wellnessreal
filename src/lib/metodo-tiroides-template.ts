import type { DiaEntrenamiento, Programa } from '@/lib/programa-schema'

export const THYROID_TEMPLATE_VERSION = 'BASE-T12-v1'

const makeExercise = (nombre: string, series_reps: string, rir: string, alternativa: string, nota?: string) => ({ nombre, series_reps, rir, alternativa, nota })

const days: DiaEntrenamiento[] = [
  { nombre: 'Día A · Sentadilla, empuje y espalda', ejercicios: [
    makeExercise('Sentadilla goblet', '3 × 8-10', '3', 'Prensa de piernas', 'Técnica estable antes de subir carga.'),
    makeExercise('Press de pecho con mancuernas', '3 × 8-10', '3', 'Flexiones inclinadas'),
    makeExercise('Remo sentado', '3 × 10-12', '3', 'Remo con mancuerna'),
    makeExercise('Peso muerto rumano con mancuernas', '2 × 10', '3', 'Puente de glúteo'),
    makeExercise('Paseo del granjero', '3 × 30-40 s', '2-3', 'Plancha frontal'),
  ] },
  { nombre: 'Día B · Bisagra, tirón y estabilidad', ejercicios: [
    makeExercise('Peso muerto con kettlebell', '3 × 8-10', '3', 'Hip thrust'),
    makeExercise('Jalón al pecho', '3 × 8-12', '3', 'Remo con banda'),
    makeExercise('Zancada asistida', '2 × 8 por lado', '3', 'Step-up bajo'),
    makeExercise('Press de hombro sentado', '2 × 8-10', '3', 'Press inclinado con mancuernas'),
    makeExercise('Pallof press', '3 × 10 por lado', '—', 'Dead bug'),
  ] },
  { nombre: 'Día C · Pierna, torso y capacidad', ejercicios: [
    makeExercise('Prensa de piernas', '3 × 10-12', '3', 'Sentadilla a cajón'),
    makeExercise('Remo con mancuerna', '3 × 10 por lado', '3', 'Remo sentado'),
    makeExercise('Hip thrust', '3 × 10-12', '3', 'Puente de glúteo'),
    makeExercise('Press inclinado con mancuernas', '2 × 10', '3', 'Flexiones inclinadas'),
    makeExercise('Bicicleta o caminata con inclinación', '8-12 min a ritmo cómodo', '—', 'Caminata en llano', 'Debes poder mantener una conversación.'),
  ] },
  { nombre: 'Día D · Refuerzo de cuerpo completo', ejercicios: [
    makeExercise('Step-up bajo', '3 × 8 por lado', '3', 'Zancada asistida'),
    makeExercise('Jalón al pecho', '3 × 10', '3', 'Remo con banda'),
    makeExercise('Press de pecho en máquina', '3 × 10', '3', 'Flexiones inclinadas'),
    makeExercise('Curl femoral', '2 × 10-12', '3', 'Peso muerto rumano ligero'),
    makeExercise('Dead bug', '3 × 6 por lado', '—', 'Pallof press'),
  ] },
]

export function getThyroidBaseProgram(dayCount = 3): Programa {
  const normalizedDays = Math.min(4, Math.max(2, Math.round(dayCount)))
  return {
    mensaje_bienvenida: 'Este es tu punto de partida. No necesitas hacerlo perfecto: necesitas repetir una estructura que puedas sostener y ajustar con datos reales.',
    punto_partida: {
      objetivo_principal: 'Mejorar fuerza, composición corporal y energía con una rutina sostenible.',
      objetivos_secundarios: ['Crear regularidad', 'Progresar sin agotamiento', 'Ganar autonomía'],
      donde_entrena: 'Gimnasio o casa con material equivalente',
      dias_tiempo: `${normalizedDays} días por semana · 45-60 minutos`,
      consideraciones: 'Plantilla inicial: adaptar historial, material, preferencias y limitaciones antes de aprobar.',
    },
    entrenamiento: {
      introduccion: 'Bloque inicial de 3 semanas del programa maestro de 12 semanas. Deja al menos un día de recuperación entre sesiones cuando sea posible.',
      regla_rir: 'Termina la mayoría de series pudiendo hacer 3 repeticiones más con buena técnica (RIR 3). Si tu energía es especialmente baja, reduce una serie; no compenses entrenando al límite.',
      progresion: 'Mantén los ejercicios durante 3 semanas. Cuando completes el máximo de repeticiones en todas las series con el RIR indicado, sube la carga mínima disponible. En la semana 4 se revisan energía, adherencia, molestias y rendimiento antes del siguiente bloque.',
      calentamiento: ['5 minutos de movimiento suave', 'Movilidad breve de las articulaciones que vas a usar', '1-2 series de aproximación del primer ejercicio'],
      dias: days.slice(0, normalizedDays).map((day) => ({ ...day, ejercicios: day.ejercicios.map((exercise) => ({ ...exercise })) })),
      vuelta_calma: ['3-5 minutos de movimiento suave', 'Anota energía, esfuerzo y cualquier molestia'],
    },
    nutricion: {
      introduccion: 'Usa una estructura sencilla y repetible. No hay alimentos obligatorios ni una dieta especial por tener hipotiroidismo.',
      reglas: ['Incluye una fuente de proteína en cada comida principal', 'Añade verduras u hortalizas en comida y cena', 'Ajusta la ración de hidratos a hambre y actividad', 'Mantén horarios suficientemente regulares', 'No cambies medicación ni suplementos sin indicación sanitaria'],
      dia_tipo: ['Desayuno: proteína + fruta + cereal o pan', 'Comida: medio plato vegetal + proteína + hidrato', 'Merienda opcional según hambre', 'Cena: verdura + proteína + hidrato ajustado al día'],
      notas: 'Personalizar con alergias, preferencias, digestiones y número de comidas. La pauta no sustituye el seguimiento médico ni nutricional cuando sea necesario.',
    },
    seguimiento: {
      introduccion: 'Revisión cada 3 semanas. Ajustamos sobre lo que realmente has podido hacer, no sobre una semana perfecta.',
      que_registrar: ['Sesiones completadas', 'Carga y repeticiones principales', 'Energía antes y después (1-5)', 'Sueño y hambre (1-5)', 'Molestias o síntomas nuevos', 'Peso o perímetro, solo si ayudan al objetivo'],
    },
  }
}

export const THYROID_ADAPTATION_RULES = `Trabaja sobre la plantilla ${THYROID_TEMPLATE_VERSION}; no inventes un programa nuevo. Mantén su estructura, RIR, progresión de tres semanas, seguimiento y criterios de seguridad. Solo adapta nombre y objetivos; 2, 3 o 4 días; duración; variantes por material o lugar; ejercicios incompatibles con limitaciones; gustos; distribución de comidas, alergias y digestiones. No cambies medicación ni atribuyas síntomas al tiroides. Si una limitación requiere valoración, déjala explícita para revisión de Fernando. Devuelve el bloque inicial listo para revisar, no doce rutinas distintas.`
