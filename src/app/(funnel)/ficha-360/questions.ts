export type AnswerValue = string | string[] | Record<string, string>

export interface FormAnswers {
  [key: string]: AnswerValue
}

export interface Question {
  id: string
  label: string
  hint?: string
  type: 'single' | 'multiple' | 'text' | 'textarea' | 'scale'
  options?: string[]
  maxChoices?: number
  required?: boolean
  placeholder?: string
  showWhen?: (answers: FormAnswers) => boolean
}

export interface QuestionSection {
  id: string
  eyebrow: string
  title: string
  description: string
  questions: Question[]
}

const includesAnswer = (answers: FormAnswers, id: string, value: string) => {
  const answer = answers[id]
  return Array.isArray(answer) ? answer.includes(value) : answer === value
}

export const MEAL_ROWS = ['Desayuno', 'Media mañana', 'Comida', 'Merienda', 'Cena']
export const MEAL_OPTIONS = ['En casa', 'Fuera / trabajo', 'Variable', 'No la hago']

export const SECTIONS: QuestionSection[] = [
  {
    id: 'contacto',
    eyebrow: 'Empezamos',
    title: '¿Quién eres?',
    description: 'Solo necesito estos datos para identificar tu ficha y poder relacionarla contigo.',
    questions: [
      { id: 'nombre', label: 'Nombre y apellidos', type: 'text', required: true, placeholder: 'Tu nombre completo' },
      { id: 'email', label: 'Email', type: 'text', required: true, placeholder: 'tu@email.com' },
      { id: 'telefono', label: 'Teléfono', type: 'text', placeholder: '+34 600 000 000' },
    ],
  },
  {
    id: 'semana',
    eyebrow: 'Tu contexto',
    title: 'Tu semana real',
    description: 'No busco una semana perfecta, sino entender cómo es tu vida normalmente.',
    questions: [
      { id: 'actividad_laboral', label: '¿Cómo es tu trabajo o actividad principal?', type: 'single', required: true, options: ['Principalmente sentado/a', 'De pie buena parte del día', 'Físicamente activo', 'Estudio', 'No trabajo actualmente', 'Mi situación cambia mucho', 'Otro'] },
      { id: 'horario_trabajo', label: '¿Qué horario tienes normalmente?', type: 'single', required: true, options: ['Mañanas', 'Tardes', 'Noches', 'Jornada partida', 'Turnos rotativos', 'Horario flexible', 'Cada semana es diferente'] },
      { id: 'detalle_turnos', label: '¿Cómo suelen organizarse tus turnos?', type: 'text', placeholder: 'Ej: una semana de mañana y otra de tarde', showWhen: (a) => includesAnswer(a, 'horario_trabajo', 'Turnos rotativos') || includesAnswer(a, 'horario_trabajo', 'Cada semana es diferente') },
      { id: 'dia_normal', label: 'Cuéntame cómo es un día normal entre semana', hint: 'Desde que te levantas hasta que te acuestas: horarios, trabajo, comidas, desplazamientos y momentos para ti.', type: 'textarea', required: true, placeholder: 'Me levanto a las 7:00, entro a trabajar a las 9:00…' },
      { id: 'responsabilidades', label: '¿Qué condiciona más tu tiempo?', type: 'multiple', options: ['Hijos', 'Cuidado de familiares', 'Trabajo imprevisible', 'Desplazamientos largos', 'Estudios u oposiciones', 'Tareas domésticas', 'Vida social', 'Nada especialmente', 'Otro'] },
      { id: 'variabilidad_rutina', label: '¿Cuánto cambia tu rutina de lunes a viernes?', type: 'single', options: ['Es bastante estable', 'Cambia algún día', 'Cada día es diferente', 'Depende completamente de mis turnos'] },
      { id: 'fin_semana', label: 'Comparado con entre semana, ¿cómo son tus fines de semana?', type: 'single', options: ['Mantengo hábitos parecidos', 'Cambian algunas comidas u horarios', 'Cambian bastante', 'Son completamente imprevisibles'] },
    ],
  },
  {
    id: 'alimentacion',
    eyebrow: 'Alimentación',
    title: 'Cómo comes de verdad',
    description: 'No hay respuestas buenas o malas. Esto sirve para que las pautas encajen contigo.',
    questions: [
      { id: 'comidas_dia', label: 'En un día normal, ¿cuántas veces sueles comer?', type: 'single', required: true, options: ['2 veces', '3 veces', '4 veces', '5 o más', 'Depende mucho del día'] },
      { id: 'comidas_fuera_semana', label: '¿Cuántas comidas principales haces fuera de casa por semana?', type: 'single', required: true, options: ['Ninguna', '1–2', '3–4', '5–7', 'Más de 7', 'No tengo una semana habitual'] },
      { id: 'tipo_comida_fuera', label: 'Cuando comes fuera, ¿qué situación es más frecuente?', type: 'multiple', options: ['Llevo comida de casa', 'Menú del día', 'Bar o restaurante', 'Comedor de empresa', 'Pido a domicilio', 'Compro algo rápido', 'Como con familiares', 'Va cambiando'], showWhen: (a) => a.comidas_fuera_semana !== 'Ninguna' },
      { id: 'quien_cocina', label: '¿Quién suele comprar y preparar la comida?', type: 'single', options: ['Principalmente yo', 'Lo compartimos', 'Otra persona', 'Depende del día', 'Casi nunca cocinamos'] },
      { id: 'tiempo_cocinar', label: '¿Cuánto tiempo real quieres dedicar a cocinar?', type: 'single', options: ['Lo mínimo posible', '10–15 minutos', 'Hasta 30 minutos', 'Me gusta cocinar', 'Prefiero cocinar para varios días'] },
      { id: 'registro_ayer', label: '¿Qué comiste y bebiste ayer?', hint: 'Incluye comidas, picoteos y bebidas. No hacen falta cantidades exactas.', type: 'textarea', required: true, placeholder: 'Desayuno: …\nComida: …\nCena: …\nEntre horas y bebidas: …' },
      { id: 'momento_dificil', label: '¿Cuándo te cuesta más mantener una alimentación ordenada?', type: 'multiple', options: ['Al levantarme', 'Durante el trabajo', 'Al llegar a casa', 'Por la tarde', 'Por la noche', 'Fines de semana', 'Planes sociales', 'Cuando estoy estresado/a', 'No hay un momento concreto'] },
      { id: 'que_ocurre', label: '¿Qué suele ocurrir en esos momentos?', type: 'multiple', options: ['Me salto comidas', 'Como lo primero que encuentro', 'Pico sin hambre', 'Como más de lo que quería', 'Pido comida', 'Me apetece dulce', 'Me apetece salado', 'Pierdo el apetito', 'Otra situación'] },
      { id: 'mantener_comida', label: '¿Qué alimentos, comidas o planes quieres mantener sí o sí?', type: 'text', placeholder: 'Ej: la cena familiar, salir a comer el sábado…' },
      { id: 'no_gusta', label: '¿Qué alimentos no te gustan o no estás dispuesto/a a comer?', type: 'text', placeholder: 'Puedes escribir varios separados por comas' },
      { id: 'limitaciones_alimentarias', label: '¿Existe alguna limitación alimentaria que deba conocer?', type: 'multiple', options: ['Alergia diagnosticada', 'Intolerancia diagnosticada', 'Vegetariana', 'Vegana', 'Motivos religiosos o culturales', 'Pauta sanitaria', 'Ninguna', 'Otra'] },
      { id: 'detalle_limitacion', label: 'Cuéntame cuál y cómo la gestionas', type: 'text', showWhen: (a) => Array.isArray(a.limitaciones_alimentarias) && !a.limitaciones_alimentarias.includes('Ninguna') && a.limitaciones_alimentarias.length > 0 },
      { id: 'bebidas', label: '¿Qué bebidas forman parte de tu semana?', type: 'multiple', options: ['Agua', 'Café o té', 'Refrescos', 'Bebidas energéticas', 'Zumos', 'Alcohol entre semana', 'Alcohol el fin de semana', 'Otras'] },
    ],
  },
  {
    id: 'entrenamiento',
    eyebrow: 'Movimiento',
    title: 'Tu relación con el ejercicio',
    description: 'Quiero saber qué te atrae, qué te echa para atrás y qué has probado antes.',
    questions: [
      { id: 'actividades_previas', label: '¿Qué actividades o deportes has practicado?', type: 'multiple', options: ['Gimnasio o fuerza', 'Clases dirigidas', 'Running', 'Ciclismo', 'Natación', 'Deportes de equipo', 'Pádel o tenis', 'Artes marciales', 'Baile', 'Yoga o pilates', 'Entrenamiento en casa', 'Senderismo', 'Nunca entrené con regularidad', 'Otro'] },
      { id: 'historial_entreno', label: '¿Qué hiciste, durante cuánto tiempo y por qué lo dejaste?', type: 'textarea', placeholder: 'Ej: fui al gimnasio seis meses y lo dejé por el cambio de horario…', showWhen: (a) => Array.isArray(a.actividades_previas) && !a.actividades_previas.includes('Nunca entrené con regularidad') && a.actividades_previas.length > 0 },
      { id: 'entreno_disfruta', label: '¿Qué tipo de entrenamiento crees que disfrutarías más?', type: 'multiple', maxChoices: 3, options: ['Fuerza', 'Máquinas', 'Pesas libres', 'Circuitos dinámicos', 'Clases en grupo', 'Aire libre', 'Cardio', 'Deportes', 'Movilidad, yoga o pilates', 'Sesiones cortas e intensas', 'Sesiones tranquilas', 'Todavía no lo sé'] },
      { id: 'preferencia_compania', label: '¿Cómo prefieres entrenar?', type: 'single', options: ['Solo/a', 'Acompañado/a', 'Me da igual'] },
      { id: 'preferencia_lugar', label: '¿Dónde te apetece más entrenar?', type: 'single', options: ['En casa', 'En gimnasio', 'Al aire libre', 'Me da igual', 'Combinar varios'] },
      { id: 'preferencia_estructura', label: '¿Qué estructura te ayuda más?', type: 'single', options: ['Mucha variedad', 'Repetir una estructura conocida', 'Equilibrio entre ambas', 'Todavía no lo sé'] },
      { id: 'rechazo_ejercicios', label: '¿Hay ejercicios o formas de entrenar que no te gusten?', hint: 'También puedes contarme si algo te da inseguridad, vergüenza o miedo.', type: 'textarea' },
      { id: 'movimiento_diario', label: 'Además del entrenamiento, ¿cuánto te mueves?', type: 'single', options: ['Casi todo el día sentado/a', 'Camino algo, pero poco', 'Camino bastante', 'Mi trabajo es activo', 'Cambia mucho según el día'] },
      { id: 'barreras_constancia', label: '¿Qué suele hacer que pierdas la constancia?', type: 'multiple', options: ['Falta de tiempo', 'Cansancio', 'Dolor o molestias', 'No saber qué hacer', 'Aburrimiento', 'No ver resultados rápidos', 'Viajes o cambios', 'Trabajo', 'Responsabilidades familiares', 'Exigirme demasiado', 'No tener apoyo', 'Nunca lo intenté en serio', 'Otro'] },
    ],
  },
  {
    id: 'energia',
    eyebrow: 'Recuperación',
    title: 'Energía, sueño y estrés',
    description: 'El entrenamiento no ocurre aislado: depende de cómo llegas a cada día.',
    questions: [
      { id: 'energia_dia', label: '¿Cómo suele estar tu energía?', type: 'single', options: ['Bastante estable', 'Baja por la mañana', 'Baja después de comer', 'Baja por la tarde', 'Llego agotado/a a la noche', 'Cambia mucho'] },
      { id: 'estres', label: '¿Cómo valorarías tu estrés actual?', hint: '0 = prácticamente ninguno · 10 = me siento desbordado/a', type: 'scale', required: true },
      { id: 'origen_estres', label: '¿De dónde viene principalmente?', type: 'multiple', options: ['Trabajo', 'Familia o cuidados', 'Economía', 'Salud', 'Estudios', 'Falta de tiempo', 'Relaciones personales', 'No identifico una causa', 'Otro'] },
      { id: 'efecto_estres', label: '¿Cómo afecta el estrés a tus hábitos?', type: 'multiple', options: ['Como más', 'Como menos', 'Tengo más antojos', 'Duermo peor', 'Entreno menos', 'Me cuesta organizarme', 'Me siento más cansado/a', 'No los afecta especialmente'] },
      { id: 'horas_sueno', label: '¿Cuántas horas duermes normalmente?', type: 'single', options: ['Menos de 5', '5–6 horas', '6–7 horas', '7–8 horas', 'Más de 8', 'Cambia mucho'] },
      { id: 'descanso', label: 'Al despertar, ¿sueles sentirte descansado/a?', type: 'single', options: ['Casi siempre', 'Algunos días', 'Rara vez', 'Nunca'] },
    ],
  },
  {
    id: 'estrategia',
    eyebrow: 'Para adaptarlo a ti',
    title: 'Lo que hará que funcione',
    description: 'Estas respuestas me ayudan a decidir cómo acompañarte cuando la semana se complique.',
    questions: [
      { id: 'cambio_impacto', label: '¿Qué cambios tendrían más impacto ahora mismo?', type: 'multiple', maxChoices: 2, required: true, options: ['Más energía', 'Mejor relación con la comida', 'Perder grasa', 'Ganar fuerza o músculo', 'Reducir molestias', 'Dormir mejor', 'Tener una rutina', 'Mejorar rendimiento', 'Sentirme mejor con mi cuerpo', 'Recuperar confianza', 'Otro'] },
      { id: 'exito_tres_meses', label: 'Dentro de tres meses, ¿qué te haría pensar que esto está funcionando?', type: 'textarea', required: true, placeholder: 'Describe un cambio concreto que notarías en tu vida' },
      { id: 'mayor_dificultad', label: '¿Cuál es ahora mismo tu mayor dificultad?', type: 'single', required: true, options: ['Sé qué hacer, pero no lo mantengo', 'No sé cómo organizarme', 'Me falta tiempo', 'Me falta energía', 'Empiezo demasiado fuerte', 'La alimentación', 'El entrenamiento', 'Mis horarios cambian demasiado', 'Tengo miedo de hacerme daño', 'Otra'] },
      { id: 'minimo_entreno', label: 'En una semana complicada, ¿cuántas sesiones podrías mantener?', type: 'single', options: ['Ninguna', '1 sesión', '2 sesiones', '3 sesiones'] },
      { id: 'minimo_alimentacion', label: '¿Qué mínimo podrías mantener con la alimentación?', type: 'multiple', options: ['Cocinar algunas comidas', 'Elegir mejor fuera', 'Mantener horarios', 'Evitar parte del picoteo', 'Preparar comida con antelación', 'Otro'] },
      { id: 'acompanamiento', label: '¿Qué tipo de acompañamiento te ayuda más?', type: 'multiple', options: ['Que me digan exactamente qué hacer', 'Entender el motivo', 'Tener varias opciones', 'Revisiones frecuentes', 'Recordatorios', 'Poder preguntar', 'Que me pidan cuentas', 'Tener autonomía'] },
      { id: 'algo_mas', label: '¿Hay algo importante sobre ti que no te haya preguntado?', type: 'textarea', placeholder: 'Este espacio es tuyo (opcional)' },
    ],
  },
]

export function getVisibleQuestions(section: QuestionSection, answers: FormAnswers) {
  return section.questions.filter((question) => !question.showWhen || question.showWhen(answers))
}
