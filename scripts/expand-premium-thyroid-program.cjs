const fs = require('node:fs')
const { createClient } = require('@supabase/supabase-js')

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
}

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const note = `<div class="lesson-note"><p><strong>Importante:</strong> este programa enseña a adaptar el entrenamiento y la organización. No diagnostica, no trata el hipotiroidismo y no sustituye a tu médico, endocrino o dietista-nutricionista. Si aparecen síntomas nuevos, dolor preocupante o un cambio importante de salud, consulta con el profesional correspondiente y avisa a Fernando para adaptar el entrenamiento.</p></div>`

const lessons = [
  {
    slug: 'empieza-aqui-programa',
    content: `<h2>No necesitas hacerlo perfecto; necesitas saber qué hacer después</h2><p>Durante 12 semanas vas a trabajar con una estructura común y un plan adaptado a ti. La parte común te evita improvisar. La adaptación decide cuántos días entrenas, qué variantes utilizas, cuánto volumen toleras y cómo encaja todo en tu semana.</p><h3>El recorrido completo</h3><ol><li><strong>Evaluación inicial:</strong> disponibilidad, experiencia, material, preferencias, limitaciones, sueño, hambre y contexto.</li><li><strong>Bloque 1:</strong> aprender movimientos y crear regularidad.</li><li><strong>Revisión:</strong> cada tres semanas comprobamos adherencia, energía, molestias y rendimiento.</li><li><strong>Bloques 2 y 3:</strong> progresar y ganar autonomía sin cambiar todo a la vez.</li><li><strong>Cierre:</strong> sales con un manual personal para continuar.</li></ol><h3>Qué haces hoy</h3><ul><li>Abre tu plan privado y comprueba que puedes realizar cada ejercicio.</li><li>Reserva en el calendario tus primeras dos o tres sesiones.</li><li>Elige una versión mínima para una semana complicada.</li><li>Presenta cualquier duda concreta en el foro.</li></ul><h3>Cómo saber si vas bien</h3><p>La primera señal no es el peso corporal. Es que puedes repetir la semana, comprendes mejor el esfuerzo y sabes ajustar una sesión sin abandonarla. Los resultados físicos se evalúan como tendencia, no por un día aislado.</p>${note}`,
  },
  {
    slug: 'tu-plan-y-calendario',
    content: `<h2>Convierte el plan en citas reales</h2><p>Una rutina escrita no sirve si solo existe como una intención. Abre tu calendario y trabaja hacia atrás desde tu semana real: turnos, familia, desplazamientos y horas de más energía.</p><h3>Orden recomendado</h3><ol><li>Elige primero los dos huecos con mayor probabilidad de cumplirse.</li><li>Si tienes un tercer o cuarto día, añádelo después; no sacrifiques los dos principales.</li><li>Deja, cuando puedas, un día de recuperación entre sesiones de cuerpo completo.</li><li>Prepara ropa y material la noche anterior.</li></ol><h3>Ejemplos</h3><ul><li><strong>Dos días:</strong> martes y viernes, cuerpo completo.</li><li><strong>Tres días:</strong> lunes, miércoles y sábado.</li><li><strong>Turnos variables:</strong> dos ventanas de 60 minutos y una alternativa de 25 minutos.</li></ul><h3>Tu versión mínima</h3><p>Si no tienes 45 minutos, realiza calentamiento, los tres primeros ejercicios y anota cómo te encontrabas. Si no puedes entrenar ese día, mueve la sesión; no intentes pagar una “deuda” acumulando entrenamientos.</p><h3>Antes de aprobar tu plan</h3><ul><li>¿El material existe de verdad?</li><li>¿Comprendes las alternativas?</li><li>¿Algún movimiento produce dolor?</li><li>¿La duración cabe sin correr?</li></ul>${note}`,
  },
  {
    slug: 'bloque-1-semanas-1-4',
    content: `<h2>Bloque 1: aprender y repetir</h2><p>Estas primeras semanas no son una prueba de dureza. Son una fase de recogida de información. Mantendrás los mismos patrones para que la técnica deje de consumir toda tu atención y podamos observar tu respuesta real.</p><h3>Objetivos del bloque</h3><ul><li>Completar al menos el 70% de las sesiones previstas.</li><li>Terminar la mayoría de series con unas tres repeticiones posibles, RIR 3.</li><li>Encontrar una variante cómoda para cada patrón.</li><li>Registrar energía y molestias sin convertir el registro en otro trabajo.</li></ul><h3>Regla de carga</h3><p>Empieza conservadora. Si el rango es 8–10 repeticiones, escoge un peso con el que puedas hacer 8 claramente y aún te queden unas tres. Cuando logres 10 en todas las series con el mismo margen, sube el mínimo posible.</p><h3>Lo que no cambiaremos todavía</h3><p>No sustituiremos ejercicios porque un día hayan resultado difíciles. Tampoco añadiremos cardio, series y peso simultáneamente. Primero necesitamos dos exposiciones comparables.</p><h3>Revisión del bloque</h3><p>Lleva al check-in sesiones previstas y realizadas, cargas principales, energía media, molestias y el principal obstáculo de organización. Con eso decidimos qué mantener, reducir o progresar.</p>${note}`,
  },
  {
    slug: 'bloque-2-semanas-5-8',
    content: `<h2>Bloque 2: progresar sin perder el control</h2><p>Ahora ya conoces los movimientos y podemos pedir un poco más. Progresar no significa salir destruida; significa producir una mejora medible conservando técnica y recuperación.</p><h3>Tres formas de progresar</h3><ol><li><strong>Repeticiones:</strong> pasar de 8 a 9 o 10 con la misma carga.</li><li><strong>Carga:</strong> subir el incremento más pequeño cuando completas el rango.</li><li><strong>Control:</strong> ejecutar mejor, con más recorrido y menos compensaciones.</li></ol><p>Elige una forma cada vez. Si aumentas peso, vuelve a la parte baja del rango.</p><h3>Semáforo de volumen</h3><ul><li><strong>Verde:</strong> completas, recuperas y mantienes rendimiento; progresa una variable.</li><li><strong>Amarillo:</strong> cumples pero acumulas fatiga; mantén.</li><li><strong>Rojo:</strong> baja el rendimiento dos sesiones, empeora el sueño o aparecen molestias; reduce una serie y revisa.</li></ul><h3>Actividad cotidiana</h3><p>Añade movimiento fuera del gimnasio solo si no compite con la recuperación. Un paseo de diez minutos unido a la comida suele ser más sostenible que fijar una cifra enorme de pasos de golpe.</p>${note}`,
  },
  {
    slug: 'bloque-3-semanas-9-12',
    content: `<h2>Bloque 3: convertir el método en tuyo</h2><p>El último bloque no consiste en depender más del programa. Consiste en comprender qué decisiones puedes tomar sola y cuáles merece la pena revisar.</p><h3>Lo que debes saber al terminar</h3><ul><li>Elegir una carga mediante el RIR, no por orgullo.</li><li>Sustituir un ejercicio por otro del mismo patrón.</li><li>Reducir una sesión cuando la energía no acompaña.</li><li>Distinguir una mala semana de una tendencia de varias semanas.</li><li>Volver al plan después de una interrupción sin compensar.</li></ul><h3>Tu mapa de ejercicios</h3><p>Guarda para cada patrón una opción principal y una alternativa: sentadilla, bisagra de cadera, empuje, tirón, trabajo unilateral y estabilidad. Si una máquina está ocupada, no necesitas rediseñar la sesión.</p><h3>Próximo bloque</h3><p>Al final decidiremos entre mantener, progresar, reducir o cambiar objetivo. La decisión se apoya en adherencia, rendimiento, recuperación, preferencias y medidas útiles; nunca en una única sensación o un único pesaje.</p>${note}`,
  },
  {
    slug: 'directos-y-revisiones',
    content: `<h2>Llega a la revisión con información útil</h2><p>El directo no debe convertirse en “creo que voy bien”. Cinco minutos de preparación permiten resolver mucho más.</p><h3>Antes de la revisión</h3><ul><li>Sesiones previstas y completadas.</li><li>Dos ejercicios que progresaron y uno que necesita ajuste.</li><li>Energía, sueño y hambre medias del 1 al 5.</li><li>Molestias: dónde, en qué movimiento y desde cuándo.</li><li>El obstáculo más repetido de la semana.</li><li>Una pregunta prioritaria.</li></ul><h3>Qué decisión buscamos</h3><p>La revisión termina con un cambio concreto o con la decisión consciente de mantener. Cambiar por cambiar destruye la referencia. Si el programa funciona y lo toleras, repetirlo también es una decisión profesional.</p><h3>Formato para preguntar</h3><p>“En el remo, con 12 kg, hice 10, 10 y 8 repeticiones a RIR 2. En la última serie perdí postura. ¿Mantengo carga?” aporta más que “el remo me cuesta”. No necesitas lenguaje técnico perfecto: contexto, datos y sensación.</p>${note}`,
  },
  {
    slug: 'recurso-planificador-semanal',
    content: `<h2>Planificador semanal de una página</h2><p>Complétalo cada domingo o al recibir tus turnos. Diez minutos bastan.</p><h3>1. Mis sesiones principales</h3><ul><li>Sesión A — día: ____ hora: ____ lugar: ____</li><li>Sesión B — día: ____ hora: ____ lugar: ____</li><li>Sesión C/D opcional — día: ____ hora: ____</li></ul><h3>2. Plan B</h3><ul><li>Si falla A, la moveré a: ____</li><li>Si solo tengo 25 minutos, haré: calentamiento + ejercicios ____ / ____ / ____</li><li>Si estoy en amarillo, quitaré: ____</li></ul><h3>3. Comidas ancla</h3><ul><li>Primera comida sencilla: ____</li><li>Comida que puedo preparar en cantidad: ____</li><li>Cena de emergencia: ____</li><li>Proteína rápida disponible: ____</li></ul><h3>4. Obstáculo previsible</h3><p>Si ocurre __________, entonces haré __________. Escribe una respuesta pequeña y controlable, no una promesa heroica.</p><h3>5. Cierre</h3><p>Al final de la semana marca: cumplido, adaptado o no realizado. “Adaptado” cuenta cuando aplicaste conscientemente tu versión mínima.</p>` + note,
  },
  {
    slug: 'recurso-semaforo-energia',
    content: `<h2>Semáforo de energía: decide después de calentar</h2><p>No uses el cansancio como diagnóstico ni como sentencia automática. Usa este sistema para elegir una dosis prudente.</p><h3>Verde</h3><p>Energía habitual, calentamiento normal y sin síntomas nuevos. Realiza el plan previsto respetando el RIR.</p><h3>Amarillo</h3><p>Has dormido peor, notas cansancio manejable o el calentamiento cuesta más. Haz diez minutos suaves y vuelve a valorar. Si mejoras, usa una o dos medidas: reduce una serie por ejercicio, baja 5–10% la carga o elimina el final cardiovascular.</p><h3>Rojo</h3><p>Agotamiento inusual, mareo, dolor no habitual, fiebre o empeoramiento durante el calentamiento. No fuerces. Descansa o haz movimiento suave si resulta agradable. Registra lo ocurrido.</p><h3>Patrones, no excusas</h3><p>Un día amarillo no exige cambiar el programa. Tres o más sesiones amarillas o rojas sí merecen revisar sueño, estrés, volumen, alimentación y situación clínica con quien corresponda.</p>${note}`,
  },
  {
    slug: 'recurso-registro-semanal',
    content: `<h2>Registro que se completa en menos de cinco minutos</h2><p>El objetivo es tomar mejores decisiones, no producir un informe perfecto.</p><h3>Datos básicos</h3><ul><li>Sesiones previstas / realizadas: ____ / ____</li><li>Energía media antes de entrenar (1–5): ____</li><li>Sueño medio (1–5): ____</li><li>Hambre o saciedad (1–5): ____</li><li>Pasos o paseos, si los utilizas: ____</li></ul><h3>Entrenamiento</h3><ul><li>Ejercicio que progresó: ____</li><li>Carga y repeticiones: ____</li><li>Ejercicio que necesita ajuste y motivo: ____</li><li>Molestias nuevas: ____</li></ul><h3>Contexto</h3><ul><li>Principal victoria: ____</li><li>Principal obstáculo: ____</li><li>Qué repetiré la próxima semana: ____</li><li>Pregunta para Fernando: ____</li></ul><h3>Cómo interpretar</h3><p>No cambies nada por un dato aislado. Busca tendencias de dos o tres semanas. Si baja el rendimiento, también baja la energía y empeora el sueño, hay más razones para ajustar que si únicamente un ejercicio salió peor un día.</p>${note}`,
  },
]

const weeks = [
  ['Punto de partida', 'Aprender la técnica y terminar con margen.', 'Reserva tus sesiones y prueba cada ejercicio. Usa RIR 3: termina sabiendo que podrías hacer unas tres repeticiones más.', 'No cambies ejercicios por impaciencia. Anota cargas, repeticiones y cualquier movimiento que no entiendas.', 'Deja preparadas dos comidas completas que puedas repetir.'],
  ['Repetir antes de cambiar', 'Convertir lo desconocido en familiar.', 'Repite cargas si la técnica todavía requiere mucha atención. Si fue fácil y estable, añade una repetición por serie.', 'Prepara ropa y material el día anterior. Define dónde moverás una sesión si falla el hueco principal.', 'Mantén horarios razonablemente regulares y añade proteína a las comidas principales.'],
  ['Primera revisión', 'Decidir con tres semanas de información.', 'No busques récords. Completa el bloque y señala qué ejercicios progresaron, cuáles molestaron y cuáles no encajan.', 'Completa el registro y elige una sola pregunta prioritaria para Fernando.', 'Valora hambre, digestión y adherencia; no juzgues la semana por una comida.'],
  ['Construir una comida ancla', 'Reducir decisiones alimentarias sin hacer una dieta extrema.', 'Inicia el nuevo bloque con las cargas revisadas. Mantén RIR 2–3 y la misma técnica.', 'Elige una comida sencilla que puedas repetir incluso en días ocupados.', 'Combina proteína, vegetal o fruta, hidrato y una ración razonable de grasa. Adáptalo a alergias y preferencias.'],
  ['Progresar con margen', 'Mejorar una variable sin empeorar las demás.', 'Cuando completes el máximo del rango con RIR 2–3, sube el incremento mínimo y vuelve a la parte baja.', 'Marca solo los ejercicios que cumplen el criterio; no subas todo por calendario.', 'Comprueba si llegas al entrenamiento con hambre extrema y mueve una comida si es necesario.'],
  ['Segunda revisión', 'Ajustar el volumen a tu recuperación real.', 'Compara rendimiento, energía y molestias. Mantén lo que funciona; reduce una serie donde la recuperación sea insuficiente.', 'Diferencia “no pude por agenda” de “no recuperé”: requieren soluciones distintas.', 'Revisa qué comidas ancla funcionaron y crea una opción de emergencia.'],
  ['Movimiento cotidiano', 'Sumar actividad sin convertirla en castigo.', 'Conserva las sesiones. Añade un paseo de 10 minutos ligado a una comida si recuperas bien.', 'No persigas una cifra perfecta de pasos. Suma una acción que puedas repetir cinco días.', 'Hidrátate con normalidad y evita usar el paseo para compensar comida.'],
  ['Preparar una semana difícil', 'Diseñar el mínimo viable antes de necesitarlo.', 'Escribe una sesión de 20–25 minutos: calentamiento y tres ejercicios principales. Úsala si el tiempo es el obstáculo.', 'Decide tu Plan B con día, hora y lugar. Un plan sin hueco sigue siendo un deseo.', 'Deja disponibles dos cenas rápidas y una fuente de proteína lista.'],
  ['Tercera revisión', 'Detectar tendencias sin reaccionar por impulso.', 'Revisa las últimas tres semanas. Una mala sesión no es estancamiento; varias exposiciones comparables sí aportan información.', 'Mira adherencia, cargas, medidas útiles y contexto antes de proponer cambios.', 'No recortes comida automáticamente por un pesaje aislado. Observa tendencia y conducta.'],
  ['Más autonomía', 'Elegir cargas y alternativas con criterio.', 'Selecciona tú la carga de un ejercicio usando el RIR. Cambia una variante solo por material, dolor o mala adaptación, no por aburrimiento.', 'Escribe alternativa A y B para sentadilla, bisagra, empuje y tirón.', 'Construye una comida completa sin plantilla y comprueba después sus componentes.'],
  ['Tu manual personal', 'Identificar las condiciones que te ayudan a cumplir.', 'Anota tus mejores horarios, rango de cargas, ejercicios preferidos y señales para reducir volumen.', 'Escribe qué haces cuando viajas, tienes poco tiempo o pierdes una semana.', 'Guarda tres desayunos, tres comidas y tres cenas realistas.'],
  ['Revisión final y continuidad', 'Cerrar el proceso con un siguiente bloque definido.', 'Repite algunos datos iniciales comparables: cargas, repeticiones, adherencia y medidas que decidiste utilizar.', 'Resume qué mantienes, qué progresas, qué eliminas y cuál será tu frecuencia las próximas cuatro semanas.', 'Elige la estructura alimentaria que mejor hayas sostenido; no busques una dieta nueva para celebrar el final.'],
]

for (const [index, [title, objective, training, organization, nutrition]] of weeks.entries()) {
  lessons.push({
    slug: `semana-${index + 1}`,
    content: `<h2>Semana ${index + 1}: ${title}</h2><p><strong>Objetivo:</strong> ${objective}</p><p>Esta semana tiene una prioridad. Mantén el resto suficientemente estable para saber qué funciona.</p><h3>Entrenamiento</h3><p>${training}</p><h3>Organización</h3><p>${organization}</p><h3>Alimentación y recuperación</h3><p>${nutrition}</p><h3>Checklist de cierre</h3><ul><li>¿Cuántas sesiones estaban previstas y cuántas realizaste?</li><li>¿Qué ejercicio mejoró y con qué carga o repeticiones?</li><li>¿Cómo estuvo tu energía antes y después?</li><li>¿Qué obstáculo se repitió?</li><li>¿Qué mantendrás exactamente la semana siguiente?</li></ul><h3>Criterio para avanzar</h3><p>Avanza cuando puedas repetir la estructura con técnica segura y margen de esfuerzo. Si no se cumple, adapta una variable y repite; no necesitas “recuperar” la semana.</p>${note}`,
  })
}

async function run() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('[expand-premium] Faltan variables de Supabase')
  const { data: space, error: spaceError } = await db.from('spaces').select('id').eq('slug', 'metodo-base-tiroides').single()
  if (spaceError) throw new Error(`[expand-premium:space] ${spaceError.message}`)

  const { data: before, error: beforeError } = await db.from('lessons').select('id,slug,title,content').eq('space_id', space.id)
  if (beforeError) throw new Error(`[expand-premium:backup] ${beforeError.message}`)
  fs.mkdirSync('tmp', { recursive: true })
  fs.writeFileSync('tmp/premium-thyroid-before-expanded.json', JSON.stringify(before, null, 2))

  for (const lesson of lessons) {
    const { error } = await db.from('lessons').update({ content: lesson.content }).eq('space_id', space.id).eq('slug', lesson.slug)
    if (error) throw new Error(`[expand-premium:${lesson.slug}] ${error.message}`)
  }

  const { data: after, error: afterError } = await db.from('lessons').select('slug,content').eq('space_id', space.id)
  if (afterError) throw new Error(`[expand-premium:verify] ${afterError.message}`)
  const stats = after.map((lesson) => ({ slug: lesson.slug, words: lesson.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length }))
  process.stdout.write(JSON.stringify({ ok: true, updated: lessons.length, minWords: Math.min(...stats.map((row) => row.words)), stats }, null, 2))
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
