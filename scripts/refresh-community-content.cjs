const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
}

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function must(operation, promise) {
  const result = await promise
  if (result.error) throw new Error(`[community-refresh:${operation}] ${result.error.message}`)
  return result.data
}

const trainingLessons = [
  {
    slug: 'por-que-empezar-con-fuerza', title: 'Por qué empezar con fuerza', sort_order: 0, drip_days: 0,
    content: `<h2>Tu punto de partida no es castigarte: es recuperar capacidad</h2><p>Entrenar fuerza no significa empezar con barras enormes ni terminar agotada. Significa enseñar a tu cuerpo a producir fuerza con movimientos que puedas controlar.</p><p>Dos sesiones bien planteadas pueden ser un comienzo suficiente. La prioridad es repetirlas, aprender la técnica y terminar con la sensación de que podrías haber hecho un poco más.</p><h3>Tu regla esta semana</h3><p>Elige dos huecos de 30 a 45 minutos y protégelos en el calendario. Todavía no necesitas el plan perfecto; necesitas un espacio real donde pueda vivir.</p><div class="lesson-note"><p>Si tienes dolor, mareos, síntomas nuevos o tu tratamiento no está ajustado, habla con el profesional sanitario que lleva tu caso antes de aumentar la carga.</p></div>`,
  },
  {
    slug: 'entrenar-cuando-estas-cansada', title: 'Cómo entrenar cuando estás cansada', sort_order: 1, drip_days: 2,
    content: `<h2>No todos los días necesitan la misma versión de ti</h2><p>Organiza tus sesiones con un semáforo sencillo.</p><ul><li><strong>Verde:</strong> haces la sesión prevista.</li><li><strong>Amarillo:</strong> reduces una serie por ejercicio o bajas un poco el peso.</li><li><strong>Rojo:</strong> haces diez minutos de movilidad y paseo, y dejas el entrenamiento para otro día.</li></ul><p>Adaptar no es fallar. Fallar sería convertir cada día difícil en una semana perdida.</p><h3>La señal útil</h3><p>Si al calentar te encuentras mejor, continúa con una versión más corta. Si empeoras, paras. El objetivo es sumar semanas, no ganar una batalla contra el cansancio.</p>`,
  },
  {
    slug: 'organizar-dos-dias', title: 'Cómo organizar dos días de entrenamiento', sort_order: 2, drip_days: 4,
    content: `<h2>Dos días que trabajan todo el cuerpo</h2><p>Deja al menos un día entre sesiones. Por ejemplo: martes y viernes. En ambas combina cuatro patrones: sentarte y levantarte, empujar, tirar y mover la cadera.</p><ul><li><strong>Día A:</strong> sentadilla a una silla, remo, empuje y puente de glúteo.</li><li><strong>Día B:</strong> zancada asistida, jalón o remo, empuje inclinado y bisagra de cadera.</li></ul><p>Empieza con dos series por ejercicio. El peso correcto te permite terminar con buena técnica y sentir que todavía podrías hacer dos o tres repeticiones más.</p><div class="lesson-note"><p>Son ejemplos educativos, no una prescripción individual. Ajusta ejercicios y cargas si tienes lesiones o limitaciones.</p></div>`,
  },
  {
    slug: 'progresar-sin-agotarte', title: 'Cómo progresar sin agotarte', sort_order: 3, drip_days: 7,
    content: `<h2>Progresar no siempre es añadir más</h2><p>Primero repite el mismo entrenamiento hasta que resulte familiar. Después cambia una sola variable: una repetición más, un poco más de peso o una ejecución más controlada.</p><p>No subas peso, series y días a la vez. Es como tocar todos los botones cuando algo no funciona: luego no sabes qué produjo el cambio.</p><h3>Una progresión sencilla</h3><p>Trabaja dentro de un rango de 8 a 12 repeticiones. Cuando completes 12 con buena técnica y margen durante dos sesiones, aumenta ligeramente la carga y vuelve a 8.</p>`,
  },
  {
    slug: 'que-hacer-mala-semana', title: 'Qué hacer durante una mala semana', sort_order: 4, drip_days: 10,
    content: `<h2>Tu plan necesita una versión mínima</h2><p>Una semana complicada no se arregla intentando recuperar todo el domingo. Decide por adelantado cuál es tu mínimo viable:</p><ul><li>Una sesión corta de fuerza.</li><li>Dos paseos de veinte minutos.</li><li>Una fuente de proteína en tus comidas principales.</li><li>Volver al horario normal la semana siguiente, sin compensaciones.</li></ul><p>La constancia no es no fallar nunca. Es reducir el tiempo que tardas en volver.</p>`,
  },
  {
    slug: 'alimentacion-practica', title: 'Alimentación práctica sin dietas extremas', sort_order: 5, drip_days: 14,
    content: `<h2>Organiza antes de restringir</h2><p>Empieza por una estructura que puedas reconocer sin pesar cada ingrediente: una fuente de proteína, verduras o fruta, una porción de carbohidrato y una cantidad razonable de grasa.</p><p>Los carbohidratos no son el enemigo. Ajustar cantidades depende de tu actividad, apetito, preferencias y objetivo; eliminarlos por sistema no convierte una dieta en mejor.</p><h3>Hazlo fácil</h3><p>Elige tres desayunos, tres comidas y tres cenas que puedas repetir. Tener opciones decididas reduce mucho más caos que buscar recetas nuevas cada día.</p><div class="lesson-note"><p>Si tienes necesidades clínicas, alergias, trastornos digestivos o una relación complicada con la comida, trabaja con un dietista-nutricionista o el profesional sanitario adecuado.</p></div><p><a class="lesson-cta" href="/metodo-tiroides">Ver el Método BASE Tiroides y solicitar plaza →</a></p>`,
  },
]

const premiumLessons = [
  ['empieza-aqui-programa', 'Empieza aquí: tus 12 semanas', '<h2>Antes de entrenar, vamos a ordenar el proceso</h2><p>Aquí tendrás el calendario, las normas del grupo y los pasos de incorporación. Tu primera tarea será completar la evaluación inicial para que Fernando pueda adaptar el trabajo a tu contexto.</p>'],
  ['tu-plan-y-calendario', 'Tu plan y tu calendario', '<h2>El plan tiene que caber en tu vida</h2><p>En este módulo encontrarás cómo consultar tu planificación, registrar las sesiones y avisar cuando un ejercicio o un horario no encaje.</p>'],
  ['bloque-1-semanas-1-4', 'Bloque 1 · Semanas 1–4', '<h2>Construir la base</h2><p>Técnica, ritmo sostenible y dos hábitos que puedas mantener. En esta fase importa más repetir que acelerar.</p>'],
  ['bloque-2-semanas-5-8', 'Bloque 2 · Semanas 5–8', '<h2>Progresar con criterio</h2><p>Ajustamos cargas, volumen y organización según tu respuesta durante el primer bloque.</p>'],
  ['bloque-3-semanas-9-12', 'Bloque 3 · Semanas 9–12', '<h2>Consolidar y salir con autonomía</h2><p>El objetivo final es que entiendas cómo continuar, qué señales observar y cómo adaptar el plan cuando cambie tu semana.</p>'],
  ['directos-y-revisiones', 'Directos y revisiones', '<h2>Seguimiento del grupo</h2><p>Aquí se publicarán el horario y acceso a los directos, además de las instrucciones para las revisiones de las semanas 3, 6, 9 y 12.</p>'],
  ['recurso-planificador-semanal', 'Recurso · Planificador semanal', '<h2>Haz que el plan quepa antes de intentar cumplirlo</h2><p>Copia esta plantilla cada domingo y complétala con horarios reales.</p><h3>Mis dos o tres sesiones</h3><ul><li>Día y hora 1: __________</li><li>Día y hora 2: __________</li><li>Día y hora 3 (opcional): __________</li></ul><h3>Mi versión mínima</h3><p>Si la semana se complica, haré: ______________________________</p><h3>Comidas ancla</h3><ul><li>Desayuno o primera comida: __________</li><li>Comida principal: __________</li><li>Cena: __________</li></ul><h3>Obstáculo previsible y respuesta</h3><p>Si ocurre __________________, entonces haré __________________.</p>'],
  ['recurso-semaforo-energia', 'Recurso · Semáforo de energía', '<h2>Adapta la sesión sin improvisar</h2><h3>Verde · Energía normal</h3><p>Realiza la sesión prevista manteniendo el margen de esfuerzo indicado.</p><h3>Amarillo · Cansancio manejable</h3><p>Calienta diez minutos. Si mejoras, reduce una serie por ejercicio o la carga entre un 5% y un 10%.</p><h3>Rojo · Síntomas o agotamiento inusual</h3><p>No fuerces la sesión. Haz movilidad suave o paseo si te sienta bien y avisa a Fernando. Si hay síntomas nuevos o preocupantes, consulta con el profesional sanitario que lleva tu caso.</p><div class="lesson-note"><p>El semáforo no diagnostica nada. Sirve para tomar una decisión prudente sobre el entrenamiento de ese día.</p></div>'],
  ['recurso-registro-semanal', 'Recurso · Registro y revisión', '<h2>Datos sencillos para ajustar con criterio</h2><p>Completa esto antes de cada revisión.</p><ul><li>Sesiones previstas / realizadas: ____ / ____</li><li>Energía media del 1 al 5: ____</li><li>Calidad del sueño del 1 al 5: ____</li><li>Ejercicio que mejor ha ido: __________</li><li>Ejercicio o situación que necesita ajuste: __________</li><li>Molestias nuevas: __________</li><li>Principal victoria: __________</li><li>Principal obstáculo: __________</li><li>Pregunta para el directo: __________</li></ul><p>No necesitas datos perfectos. Necesitas información suficiente para decidir qué mantener y qué cambiar.</p>'],
]

const weeklyProgram = [
  ['Semana 1 · Punto de partida', 'Aprender la técnica y completar dos sesiones sin buscar agotamiento.', 'Reserva dos huecos reales, registra energía antes y después y anota cualquier ejercicio que necesite adaptación.'],
  ['Semana 2 · Repetir antes de cambiar', 'Consolidar la rutina y reducir decisiones.', 'Repite la estructura, prepara el material con antelación y utiliza la versión amarilla si llegas cansada.'],
  ['Semana 3 · Primera revisión', 'Revisar adherencia, molestias y recuperación.', 'Completa el check-in: sesiones realizadas, energía, sueño, hambre, molestias y principal obstáculo.'],
  ['Semana 4 · Construir una comida ancla', 'Organizar una comida completa que puedas repetir.', 'Elige una comida diaria con proteína, vegetal, carbohidrato y grasa; no cambies todo el día a la vez.'],
  ['Semana 5 · Progresar con margen', 'Empezar a progresar sin perder técnica.', 'Añade una repetición cuando mantengas buena ejecución y termines con dos o tres repeticiones posibles.'],
  ['Semana 6 · Segunda revisión', 'Ajustar volumen y organización a tu respuesta.', 'Compara las dos primeras semanas con las dos últimas y completa el check-in antes del directo.'],
  ['Semana 7 · Movimiento fuera del entrenamiento', 'Aumentar actividad cotidiana sin convertirla en castigo.', 'Añade un paseo breve ligado a una rutina que ya exista y mide cumplimiento, no calorías.'],
  ['Semana 8 · Preparar una semana difícil', 'Crear una versión mínima del plan.', 'Define qué harás si solo dispones de veinte minutos y deja escrita tu sesión mínima.'],
  ['Semana 9 · Tercera revisión', 'Detectar estancamientos sin reaccionar por impulso.', 'Revisa tendencia, rendimiento, medidas y adherencia; no cambies el plan por un único peso.'],
  ['Semana 10 · Más autonomía', 'Aprender a escoger cargas y alternativas.', 'Usa el margen de repeticiones para elegir carga y registra qué variante te permite entrenar sin dolor.'],
  ['Semana 11 · Tu manual personal', 'Identificar lo que mejor funciona en tu contexto.', 'Escribe tus horarios, ejercicios, comidas ancla y señales para reducir o aumentar carga.'],
  ['Semana 12 · Revisión final y continuidad', 'Cerrar el proceso con un plan para las siguientes semanas.', 'Completa la revisión final, compara el punto de partida y define el siguiente bloque con Fernando.'],
].map(([title, objective, action], index) => ({
  slug: `semana-${index + 1}`,
  title,
  content: `<h2>${objective}</h2><p>Esta semana trabajamos una prioridad. Mantén el resto estable para poder saber qué te ayuda y qué necesita ajuste.</p><h3>Qué tienes que hacer</h3><p>${action}</p><h3>Qué registrar</h3><ul><li>Sesiones completadas.</li><li>Energía antes y después.</li><li>Molestias o ejercicios que no encajan.</li><li>La dificultad principal de la semana.</li></ul><div class="lesson-note"><p><strong>No ajustes medicación ni interpretes síntomas clínicos desde aquí.</strong> Si aparece un cambio de salud, consulta con el profesional sanitario que lleva tu caso y avisa a Fernando para adaptar el entrenamiento.</p></div>`,
}))

async function run() {
  const backupData = await Promise.all([
    must('backup-spaces', db.from('spaces').select('*').order('sort_order')),
    must('backup-lessons', db.from('lessons').select('*').order('sort_order')),
    must('backup-threads', db.from('threads').select('*').order('creado_en')),
  ])
  fs.mkdirSync('tmp', { recursive: true })
  const backupPath = path.join('tmp', 'community-backup-before-v2.json')
  if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, JSON.stringify({ spaces: backupData[0], lessons: backupData[1], threads: backupData[2] }, null, 2))

  const spaces = await must('get-spaces', db.from('spaces').select('id,slug'))
  const bySlug = new Map(spaces.map((space) => [space.slug, space.id]))
  const startId = bySlug.get('empieza-aqui')
  const learnId = bySlug.get('aprende-tiroides')
  const forumId = bySlug.get('preguntas-apoyo')
  if (!startId || !learnId || !forumId) throw new Error('[community-refresh] Missing base spaces')

  await must('remove-duplicates', db.from('lessons').delete().eq('space_id', startId).in('slug', ['bienvenida', 'como-usar-la-comunidad', 'video-bienvenida']))
  const startOrder = ['lee-esto-primero', 'quien-soy', 'como-funciona-esto', 'tu-primera-victoria']
  for (const [sortOrder, slug] of startOrder.entries()) {
    await must(`order-${slug}`, db.from('lessons').update({ sort_order: sortOrder, drip_days: 0 }).eq('space_id', startId).eq('slug', slug))
  }

  await must('move-metabolism', db.from('lessons').update({ space_id: learnId, sort_order: 3, drip_days: 10 }).eq('slug', 'metabolismo-lento-no-roto'))
  const lessons = await must('get-lessons', db.from('lessons').select('id,slug,content'))
  const thyroidBasics = lessons.find((lesson) => lesson.slug === 'como-funciona-la-tiroides')
  if (thyroidBasics) {
    const safeContent = thyroidBasics.content
      .replace(/<p>Existe también una versión "freno"[\s\S]*?<\/p>/, '')
      .replace('y por eso responde tanto a cómo vives.', 'y su funcionamiento debe interpretarse con tus síntomas, analíticas y contexto clínico.')
    await must('revise-thyroid-basics', db.from('lessons').update({ content: safeContent }).eq('id', thyroidBasics.id))
  }
  const analytics = lessons.find((lesson) => lesson.slug === 'entiende-tu-analitica-tiroides')
  if (analytics) {
    const safeContent = analytics.content.replace('Los <strong>anti-TPO</strong> salen positivos en más del 90% de los casos de Hashimoto. Es el dato que separa un simple "tengo la tiroides lenta" de "tengo una enfermedad autoinmune detrás".', 'Los <strong>anti-TPO</strong> pueden ayudar al profesional sanitario a identificar un origen autoinmune. No se interpretan de forma aislada ni sirven para medir por sí solos cómo te encuentras.')
    await must('revise-analytics', db.from('lessons').update({ content: safeContent }).eq('id', analytics.id))
  }

  const trainingSpaceRows = await must('upsert-training-space', db.from('spaces').upsert({ slug: 'entrena-organizate', name: 'Entrena y organízate', description: 'Fuerza, energía y organización para aplicarlo en tu semana real.', icon: 'dumbbell', type: 'content', sort_order: 2, access_tier: 'free', published: true }, { onConflict: 'slug' }).select('id'))
  const trainingId = trainingSpaceRows[0].id
  await must('move-forum', db.from('spaces').update({ sort_order: 3 }).eq('id', forumId))
  for (const lesson of trainingLessons) {
    await must(`upsert-${lesson.slug}`, db.from('lessons').upsert({ ...lesson, space_id: trainingId, access_tier: 'free', published: true }, { onConflict: 'space_id,slug' }))
  }

  const salesLesson = lessons.find((lesson) => lesson.slug === 'ir-mas-rapido')
  if (salesLesson) await must('remove-old-sales-lesson', db.from('lessons').delete().eq('id', salesLesson.id))

  const premiumSpaceRows = await must('upsert-premium-space', db.from('spaces').upsert({ slug: 'metodo-base-tiroides', name: 'Método BASE Tiroides', description: 'Tu programa, seguimiento y recursos durante 12 semanas.', icon: 'sparkles', type: 'content', sort_order: 4, access_tier: 'premium', published: true }, { onConflict: 'slug' }).select('id'))
  const premiumId = premiumSpaceRows[0].id
  for (const [index, [slug, title, content]] of premiumLessons.entries()) {
    await must(`premium-${slug}`, db.from('lessons').upsert({ space_id: premiumId, slug, title, content, sort_order: index, drip_days: 0, access_tier: 'premium', published: true }, { onConflict: 'space_id,slug' }))
  }
  for (const [index, lesson] of weeklyProgram.entries()) {
    await must(`premium-${lesson.slug}`, db.from('lessons').upsert({ ...lesson, space_id: premiumId, sort_order: premiumLessons.length + index, drip_days: index * 7, access_tier: 'premium', published: true }, { onConflict: 'space_id,slug' }))
  }

  const author = await must('find-author', db.from('member_profiles').select('id').ilike('display_name', 'fernandoroyano').limit(1).maybeSingle())
  if (author) {
    await must('make-author-admin', db.from('member_profiles').update({ role: 'admin' }).eq('id', author.id))
    const starterThreads = [
      ['Preséntate: cuéntame tu situación', 'Cuánto llevas con hipotiroidismo o Hashimoto, qué es lo que más te cuesta ahora y qué te gustaría conseguir en los próximos meses. No hace falta que cuentes nada que no quieras compartir.'],
      ['¿Qué es lo que más te está costando?', 'Puede ser el cansancio, organizarte, saber cómo entrenar, mantener una rutina o distinguir información útil del ruido. Cuéntamelo y así podremos convertirlo en contenido práctico.'],
      ['Preguntas sobre entrenamiento y organización', 'Usa este hilo para dudas concretas sobre ejercicios, frecuencia, cargas y cómo adaptar una semana complicada. No sustituye una valoración médica ni sirve para ajustar medicación.'],
    ]
    for (const [title, body] of starterThreads) {
      const existing = await must(`thread-check-${title}`, db.from('threads').select('id').eq('space_id', forumId).eq('title', title).limit(1).maybeSingle())
      if (!existing) await must(`thread-create-${title}`, db.from('threads').insert({ space_id: forumId, author_id: author.id, title, body, pinned: true }))
    }
  }

  process.stdout.write(JSON.stringify({ ok: true, backup: 'tmp/community-backup-before-v2.json', trainingLessons: trainingLessons.length, premiumLessons: premiumLessons.length + weeklyProgram.length }, null, 2))
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
