const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const sourceNote = '<div class="lesson-note"><p><strong>Importante:</strong> este contenido es educativo. No sustituye una valoración médica ni sirve para cambiar medicación o suplementos.</p></div>'

const lessons = [
  {
    space: 'aprende-tiroides', slug: 'peso-grasa-retencion', title: 'Peso, grasa y retención: aprende a distinguirlos', sort_order: 4, drip_days: 14,
    cover_url: '/blog/hipotiroidismo-peso-contexto.png',
    content: `<h2>La báscula mezcla cosas distintas</h2><p>Un cambio de peso de un día a otro no equivale automáticamente a ganar o perder grasa. Agua, contenido digestivo, sal, carbohidratos, ciclo menstrual y hora de medición pueden mover la cifra.</p><h3>Mira tendencia, no un número aislado</h3><ol><li>Pésate en condiciones parecidas si decides hacerlo.</li><li>Compara medias semanales, no martes contra miércoles.</li><li>Añade contexto: cintura, ropa, fuerza, sueño y energía.</li></ol><p>El hipotiroidismo puede contribuir a un aumento de peso generalmente modesto y parte puede relacionarse con retención de sal y agua. Eso no significa que cualquier cambio de peso se explique solo por la tiroides.</p><blockquote>Tu tarea: durante dos semanas registra una media y una señal no relacionada con el peso. No cambies el plan por una medición suelta.</blockquote>${sourceNote}<h3>Fuentes para ampliar</h3><p><a href="https://www.thyroid.org/thyroid-and-weight/">American Thyroid Association: tiroides y peso</a> · <a href="https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism">NIDDK: hipotiroidismo</a></p>`,
  },
  {
    space: 'aprende-tiroides', slug: 'cansancio-que-revisar', title: 'Cansancio: qué observar y cuándo pedir ayuda', sort_order: 5, drip_days: 18,
    cover_url: '/blog/cansancio-hipotiroidismo-guia.jpg',
    content: `<h2>El cansancio es real, pero no señala una única causa</h2><p>La fatiga puede aparecer con hipotiroidismo, pero también con poco sueño, anemia, déficit energético, estrés, determinados fármacos u otros problemas de salud. Por eso conviene registrar antes de interpretar.</p><h3>Tu registro de contexto</h3><ul><li>Horas y calidad de sueño.</li><li>Energía antes y después de moverte.</li><li>Cambios recientes en síntomas o tratamiento.</li><li>Qué actividades has podido mantener.</li></ul><p>Consulta si aparece un empeoramiento marcado, síntomas nuevos o el cansancio impide tareas habituales. Y si tu tratamiento está ajustado pero sigues igual, merece una revisión clínica: no tienes que normalizar encontrarte mal.</p><p><a class="lesson-download-link" href="/community/resources/semaforo-energia-tiroides.pdf">Descargar el semáforo de energía</a></p>${sourceNote}<h3>Fuentes para ampliar</h3><p><a href="https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism">NIDDK: síntomas, diagnóstico y tratamiento</a></p>`,
  },
  {
    space: 'aprende-tiroides', slug: 'gluten-hashimoto-sin-miedo', title: 'Gluten y Hashimoto: decidir sin miedo', sort_order: 6, drip_days: 22,
    cover_url: '/blog/gluten-hipotiroidismo-guia.jpg',
    content: `<h2>No todo el mundo necesita retirar el gluten</h2><p>Tener Hashimoto no equivale a tener enfermedad celíaca. Una dieta sin gluten es necesaria cuando existe celiaquía o una indicación clínica clara, pero eliminar grupos enteros “por si acaso” puede encarecer y complicar la alimentación sin aportar un beneficio seguro.</p><h3>Antes de quitarlo</h3><ol><li>Si sospechas celiaquía, consulta antes de retirar el gluten: hacerlo puede alterar las pruebas.</li><li>Separa síntomas, diagnóstico y opinión de redes.</li><li>Si un profesional propone una prueba dietética, acordad objetivo, duración y cómo evaluar el resultado.</li></ol><blockquote>Una decisión útil tiene una razón, una forma de medirla y un momento para revisarla.</blockquote>${sourceNote}<h3>Fuentes para ampliar</h3><p><a href="https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis">NIDDK: diagnóstico de celiaquía</a></p>`,
  },
  {
    space: 'aprende-tiroides', slug: 'suplementos-con-criterio', title: 'Suplementos: una lista antes de comprar', sort_order: 7, drip_days: 26,
    cover_url: '/blog/suplementos-tiroides-evidencia.jpg',
    content: `<h2>“Natural” no significa necesario ni inocuo</h2><p>Antes de comprar un suplemento, pregunta qué problema concreto intenta resolver, qué evidencia lo respalda, qué dosis contiene y si puede interferir con tu medicación o analítica.</p><h3>Dos ejemplos importantes</h3><p>El yodo es necesario para fabricar hormonas tiroideas, pero el exceso puede causar problemas y empeorar algunos trastornos tiroideos. La biotina puede alterar ciertos resultados de laboratorio tiroideo; informa al profesional que solicita la analítica y sigue sus instrucciones.</p><h3>Tu filtro de cinco preguntas</h3><ol><li>¿Tengo una necesidad confirmada?</li><li>¿Qué beneficio real espero?</li><li>¿Qué dosis y duración se han estudiado?</li><li>¿Interfiere con mi tratamiento o pruebas?</li><li>¿Quién revisará si funcionó?</li></ol>${sourceNote}<h3>Fuentes para ampliar</h3><p><a href="https://ods.od.nih.gov/factsheets/Iodine-Consumer/">NIH: yodo</a> · <a href="https://www.thyroid.org/thyroid-function-tests/">American Thyroid Association: pruebas tiroideas</a></p>`,
  },
  {
    space: 'entrena-organizate', slug: 'primera-rutina-fuerza', title: 'Tu primera rutina de fuerza, paso a paso', sort_order: 2, drip_days: 5,
    cover_url: '/community/fuerza-en-casa.webp',
    content: `<h2>Una sesión que puedes repetir</h2><p>Hazla dos días no consecutivos. Empieza con cinco minutos de movimiento suave y realiza dos series de cada ejercicio, descansando lo necesario para mantener una ejecución estable.</p><ol><li><strong>Sentarte y levantarte de una silla:</strong> 8–12 repeticiones.</li><li><strong>Remo con banda o mochila:</strong> 8–12 por lado.</li><li><strong>Empuje en pared o mesa:</strong> 6–12 repeticiones.</li><li><strong>Puente de glúteo:</strong> 8–15 repeticiones.</li></ol><p>Termina cada serie sintiendo que podrías hacer dos o tres repeticiones más. Si un movimiento produce dolor, detente y busca una variante adecuada.</p><p><a class="lesson-download-link" href="/community/resources/primera-rutina-fuerza-tiroides.pdf">Descargar la rutina imprimible</a></p><blockquote>Tu objetivo no es acabar destrozada. Es poder volver a entrenar.</blockquote>${sourceNote}`,
  },
  {
    space: 'entrena-organizate', slug: 'descanso-recuperacion', title: 'Descanso y recuperación: lee tus señales', sort_order: 7, drip_days: 22,
    cover_url: '/community/organizar-semana.webp',
    content: `<h2>Recuperar también forma parte del entrenamiento</h2><p>La sesión inicia la adaptación; la recuperación permite sostenerla. Mira el conjunto: sueño, energía cotidiana, molestias, ganas de entrenar y rendimiento.</p><h3>Señales para mantener</h3><p>La técnica se conserva, recuperas entre sesiones y tu vida diaria no empeora. No necesitas subir el volumen cada semana.</p><h3>Señales para reducir temporalmente</h3><p>Varias sesiones seguidas rinden peor, el cansancio se acumula o aparecen molestias que cambian tu movimiento. Reduce una serie, mantén la carga o usa la versión mínima durante unos días.</p><p><a class="lesson-download-link" href="/community/resources/registro-semanal-tiroides.pdf">Descargar el registro semanal</a></p><blockquote>Tu tarea: registra una semana antes de sacar conclusiones. Busca patrones, no perfección.</blockquote>${sourceNote}`,
  },
]

async function must(label, promise) {
  const result = await promise
  if (result.error) throw new Error(`[community-v2:${label}] ${result.error.message}`)
  return result.data
}

async function run() {
  const spaces = await must('spaces', db.from('spaces').select('id,slug'))
  const spaceIds = new Map(spaces.map((space) => [space.slug, space.id]))
  const backup = await must('backup', db.from('lessons').select('*').eq('access_tier', 'free'))
  fs.mkdirSync('tmp', { recursive: true })
  const backupPath = path.join('tmp', `community-v2-backup-${Date.now()}.json`)
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2))

  await must('reorder-organize', db.from('lessons').update({ sort_order: 3, drip_days: 7 }).eq('slug', 'organizar-dos-dias'))
  await must('reorder-progress', db.from('lessons').update({ sort_order: 4, drip_days: 10 }).eq('slug', 'progresar-sin-agotarte'))
  await must('reorder-bad-week', db.from('lessons').update({ sort_order: 5, drip_days: 14 }).eq('slug', 'que-hacer-mala-semana'))
  await must('reorder-food', db.from('lessons').update({ sort_order: 6, drip_days: 18 }).eq('slug', 'alimentacion-practica'))
  await must('add-planner', db.from('lessons').update({ content: `${backup.find((item) => item.slug === 'organizar-dos-dias')?.content ?? ''}<p><a class="lesson-download-link" href="/community/resources/planificador-semanal-tiroides.pdf">Descargar el planificador semanal</a></p>` }).eq('slug', 'organizar-dos-dias'))

  for (const lesson of lessons) {
    const spaceId = spaceIds.get(lesson.space)
    if (!spaceId) throw new Error(`[community-v2] Missing space ${lesson.space}`)
    const { space, ...row } = lesson
    await must(lesson.slug, db.from('lessons').upsert({ ...row, space_id: spaceId, access_tier: 'free', published: true }, { onConflict: 'space_id,slug' }))
  }
  process.stdout.write(JSON.stringify({ ok: true, createdOrUpdated: lessons.length, backupPath }, null, 2))
}

run().catch((error) => { console.error(error); process.exit(1) })
