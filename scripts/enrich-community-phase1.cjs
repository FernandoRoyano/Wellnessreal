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

const covers = {
  'lee-esto-primero': '/images/fernando-royano-tiroides.webp',
  'quien-soy': '/images/fernando-royano-tiroides.webp',
  'como-funciona-esto': '/community/organizar-semana.webp',
  'tu-primera-victoria': '/community/alimentacion-practica.webp',
  'como-funciona-la-tiroides': '/blog/adelgazar-hipotiroidismo-guia.jpg',
  'entiende-tu-analitica-tiroides': '/blog/suplementos-tiroides-evidencia.jpg',
  'hashimoto-que-es': '/blog/gluten-hipotiroidismo-guia.jpg',
  'metabolismo-lento-no-roto': '/blog/hipotiroidismo-peso-contexto.png',
  'por-que-empezar-con-fuerza': '/community/fuerza-en-casa.webp',
  'entrenar-cuando-estas-cansada': '/blog/cansancio-hipotiroidismo-semaforo.png',
  'organizar-dos-dias': '/community/organizar-semana.webp',
  'progresar-sin-agotarte': '/blog/ejercicio-hipotiroidismo-mapa.png',
  'que-hacer-mala-semana': '/community/organizar-semana.webp',
  'alimentacion-practica': '/community/alimentacion-practica.webp',
}

const richerLessons = {
  'quien-soy': `<p>Antes de seguir, ponme cara. Son dos minutos:</p>
<div data-video-embed="" class="video-embed is-vertical"><iframe src="https://www.youtube.com/embed/48tqytciSS8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe></div>
<h2>Esta comunidad existe para hacer aplicables los consejos</h2>
<p><em>Come mejor. Haz fuerza. Descansa más.</em> Suena bien, pero no resuelve las preguntas importantes: cuánto, cómo empezar y qué hacer el día que no puedes con el plan completo.</p>
<p>Soy Fernando Royano, graduado en Ciencias del Deporte, y llevo <strong>14 años</strong> ayudando a personas a entrenar y organizar sus hábitos.</p>
<div class="lesson-note"><p><strong>El límite está claro:</strong> no tengo hipotiroidismo y no voy a fingir que sé exactamente cómo te sientes. Tampoco soy tu endocrino. Tu diagnóstico, tu medicación y tus analíticas los lleva el profesional sanitario que conoce tu caso.</p></div>
<h2>Lo que sí voy a hacer contigo</h2>
<p>Mi trabajo aquí es ayudarte a entender el entrenamiento y convertir consejos generales en decisiones que puedas aplicar en tu vida real.</p>
<h3>Dentro vas a encontrar tres cosas</h3>
<ul><li><strong>Explicaciones sencillas</strong> para entender mejor la tiroides sin perderte entre siglas y promesas.</li><li><strong>Una forma práctica de empezar a entrenar fuerza</strong>, incluso si ahora tienes poca energía.</li><li><strong>Un espacio donde preguntar</strong> y compartir lo que te está costando sin sentirte juzgada.</li></ul>
<h3>Tu primer paso</h3>
<p>El contenido se irá desbloqueando poco a poco para que puedas aplicar una cosa antes de pasar a la siguiente. No necesitas hacerlo todo hoy.</p>
<p>Continúa con la primera acción y después preséntate en el foro: cuánto tiempo llevas con hipotiroidismo o Hashimoto, qué es lo que más te cuesta ahora y qué te gustaría recuperar.</p>
<p><a class="lesson-cta" href="/comunidad/preguntas-apoyo">Presentarme en la comunidad →</a></p>`,
  'entrenar-cuando-estas-cansada': `<h2>No todos los días necesitan la misma versión de ti</h2>
<p>Hay días en los que entrenar te sienta bien y días en los que intentar cumplir el plan tal como estaba escrito solo añade más cansancio. La solución no es elegir entre hacerlo todo o no hacer nada. Es tener preparadas varias versiones de la misma sesión.</p>
<img src="/blog/cansancio-hipotiroidismo-semaforo.png" alt="Semáforo para adaptar el movimiento al nivel de energía del día" />
<h3>Haz una comprobación antes de empezar</h3>
<p>Valora cómo llegas, calienta entre cinco y diez minutos y observa qué ocurre. La sensación después del calentamiento da más información que la pereza antes de ponerte las zapatillas.</p>
<ul><li><strong>Verde:</strong> la energía es parecida a la habitual. Haz la sesión prevista sin buscar agotarte.</li><li><strong>Amarillo:</strong> notas más cansancio, pero puedes moverte con normalidad. Reduce una serie por ejercicio, baja algo la carga o acorta la sesión.</li><li><strong>Rojo:</strong> hay síntomas nuevos, mareo, dolor preocupante o agotamiento inusual. No fuerces. Descansa y valora si necesitas atención sanitaria.</li></ul>
<h3>Tu versión mínima</h3>
<p>Elige dos ejercicios que conozcas y haz una o dos series cómodas. También puede bastar un paseo suave o diez minutos de movilidad. Adaptar una sesión mantiene el hábito; castigarte por no poder hacerla completa suele romperlo.</p>
<div class="lesson-note"><p><strong>Tu tarea:</strong> escribe ahora qué harás en un día verde, amarillo y rojo. Cuando llegue un día difícil no tendrás que decidir desde cero.</p></div>
<p><a class="lesson-cta" href="/comunidad/preguntas-apoyo">Compartir mi semáforo en el foro →</a></p>`,
  'progresar-sin-agotarte': `<h2>Progresar no siempre es añadir más</h2>
<p>Tu cuerpo necesita un estímulo suficiente para adaptarse, pero también tiempo para recuperarse. Salir destruida de cada sesión no demuestra que el entrenamiento sea mejor.</p>
<img src="/blog/ejercicio-hipotiroidismo-mapa.png" alt="Mapa de fuerza, ejercicio aeróbico y movimiento diario como partes complementarias" />
<h3>Cambia una sola variable</h3>
<p>Primero repite el mismo entrenamiento hasta que resulte familiar. Después modifica una cosa: una repetición más, un poco más de peso o una ejecución más controlada. Si tocas todos los botones a la vez, luego no sabes qué produjo el cambio.</p>
<h3>Una progresión que puedes aplicar</h3>
<ol><li>Escoge un rango de 8 a 12 repeticiones.</li><li>Utiliza una carga con la que termines sintiendo que podrías hacer dos o tres repeticiones más.</li><li>Cuando completes 12 repeticiones con buena técnica durante dos sesiones, aumenta ligeramente la carga.</li><li>Vuelve a la parte baja del rango y repite el proceso.</li></ol>
<p>También progresas cuando el movimiento sale más estable, necesitas menos pausas o recuperas mejor al día siguiente.</p>
<div class="lesson-note"><p><strong>Tu tarea:</strong> elige un único ejercicio y anota carga, repeticiones y margen durante las próximas dos sesiones. No cambies nada más todavía.</p></div>`,
  'que-hacer-mala-semana': `<h2>Tu plan necesita una versión mínima</h2>
<p>Una semana complicada no se arregla intentando recuperar todo el domingo. Se gestiona decidiendo de antemano qué vas a conservar cuando no puedas con el plan completo.</p>
<img src="/community/organizar-semana.webp" alt="Mujer organizando dos sesiones de entrenamiento en su agenda semanal" />
<h3>Elige tus cuatro mínimos</h3>
<ul><li><strong>Entrenamiento:</strong> una sesión corta de fuerza con ejercicios conocidos.</li><li><strong>Movimiento:</strong> dos paseos de veinte minutos o varios bloques más pequeños.</li><li><strong>Alimentación:</strong> una fuente de proteína y algo vegetal en las comidas principales.</li><li><strong>Vuelta:</strong> retomar el horario normal la semana siguiente sin castigos ni compensaciones.</li></ul>
<h3>No conviertas una excepción en una identidad</h3>
<p>Una semana difícil no significa que seas inconstante. La constancia no es no fallar nunca; es reducir el tiempo que tardas en volver.</p>
<div class="lesson-note"><p><strong>Tu tarea:</strong> abre tu calendario y reserva un único hueco realista. Después escribe qué versión de veinte minutos podrías hacer si ese hueco se complica.</p></div>
<p><a class="lesson-cta" href="/comunidad/preguntas-apoyo">Contar mi plan mínimo en el foro →</a></p>`,
}

async function must(operation, promise) {
  const result = await promise
  if (result.error) throw new Error(`[community-phase1:${operation}] ${result.error.message}`)
  return result.data
}

async function run() {
  const slugs = Object.keys(covers)
  const lessons = await must('read-lessons', db.from('lessons').select('*').in('slug', slugs))
  fs.mkdirSync('tmp', { recursive: true })
  const backupPath = path.join('tmp', `community-phase1-backup-${new Date().toISOString().slice(0, 10)}.json`)
  if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, JSON.stringify(lessons, null, 2))

  for (const lesson of lessons) {
    const update = { cover_url: covers[lesson.slug] }
    if (richerLessons[lesson.slug]) update.content = richerLessons[lesson.slug]
    if (lesson.slug === 'quien-soy') update.title = 'Bienvenida: qué vas a encontrar aquí'
    await must(`update-${lesson.slug}`, db.from('lessons').update(update).eq('id', lesson.id))
  }

  process.stdout.write(JSON.stringify({ ok: true, updated: lessons.length, backup: backupPath }, null, 2))
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
