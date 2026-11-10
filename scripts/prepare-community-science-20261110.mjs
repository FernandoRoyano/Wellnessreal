import { readFileSync, writeFileSync } from 'node:fs'

const [directory] = process.argv.slice(2)
if (!directory) throw new Error('[Editorial:communityScience] Indica el directorio de respaldo')
const read = name => JSON.parse(readFileSync(`${directory}/${name}-backup.json`, 'utf8').replace(/^\uFEFF/, ''))
const posts = read('posts')
const lessons = read('lessons')
const updates = []
const note = '<p>Revisión educativa de fuentes y alcance: 10 de noviembre de 2026. Se conserva la fecha original de publicación. No constituye una valoración sanitaria individual.</p>'
function getRow(rows, slug) {
  const row = rows.find(item => item.slug === slug)
  if (!row) throw new Error(`[Editorial:communityScience] No existe ${slug}`)
  return row
}
function replaceTag(content, tag, needle, replacement) {
  const matches = [...content.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'g'))]
    .filter(match => match[0].includes(needle) || match[0].replace(/<[^>]*>/g, '').includes(needle))
  if (matches.length !== 1) throw new Error(`[Editorial:communityScience] ${needle}: ${matches.length} coincidencias`)
  return content.replace(matches[0][0], replacement)
}
const exercise = '<p>Los metaanálisis difieren: <a href="https://pubmed.ncbi.nlm.nih.gov/37999992/">Duñabeitia y colaboradores (2023)</a> no detectaron cambios hormonales concluyentes; <a href="https://pubmed.ncbi.nlm.nih.gov/40446861/">Sundus y colaboradores (2025)</a> sí observaron cambios en TSH y T4, con distinta certeza. Esto no permite predecir tu respuesta ni ajustar medicación. Los beneficios físicos del ejercicio no equivalen a curar la tiroides.</p>'
for (const slug of ['adelgazar-con-hipotiroidismo', 'por-que-no-adelgazo-con-hipotiroidismo', 'recuperacion-tejidos-tiroides']) {
  let content = getRow(posts, slug).content
  content = replaceTag(content, 'p', 'https://pubmed.ncbi.nlm.nih.gov/37999992/', exercise)
  if (slug === 'adelgazar-con-hipotiroidismo') {
    content = replaceTag(content, 'p', 'Antes de cambiar la dieta o añadir más ejercicio', '<p>Comprueba que mantienes el seguimiento indicado. Si aparecen síntomas nuevos o importantes, pide revisión antes de aumentar la exigencia o intentar compensarlos con una dieta más restrictiva. Los síntomas no identifican por sí solos su causa; tampoco necesitas modificar una pauta estable para empezar a organizar mejor tus hábitos.</p>')
    content += '<h2>Un ejemplo para elegir el primer paso</h2><p><strong>Ejemplo didáctico:</strong> si una semana el peso sube tras cambiar entrenamiento o comidas, una medición no identifica grasa ganada ni un problema tiroideo. Observa el contexto y la tendencia si pesarte te resulta útil. Si aparecen síntomas intensos o cambios rápidos e inexplicados, la prioridad es consultar, no restringir más.</p>'
  }
  if (slug === 'por-que-no-adelgazo-con-hipotiroidismo') {
    content = replaceTag(content, 'li', 'tres o cuatro semanas', '<li>Compara tendencias en condiciones parecidas. Varias semanas pueden aportar contexto, pero no hay un plazo único que confirme un estancamiento; el ciclo menstrual y tu historia también influyen.</li>')
    content = replaceTag(content, 'p', 'Si no hay cambios, modifica una sola variable', '<p>Si no observas cambios, revisa el conjunto y decide con el profesional adecuado si procede ajustar una variable. No existe una obligación de recortar comida o aumentar actividad al cumplirse dos o tres semanas. Cambiar todo a la vez dificulta comprender la respuesta; los síntomas nuevos requieren su propia valoración.</p>')
  }
  if (slug === 'recuperacion-tejidos-tiroides') {
    content = replaceTag(content, 'p', 'Una revisión sobre recuperación del rendimiento', '<p>La <a href="https://pubmed.ncbi.nlm.nih.gov/36862831/">revisión de Choo y colaboradores sobre inmersión en agua fría</a> evaluó recuperación tras ejercicio. Sus resultados dependían del esfuerzo previo, el momento y la variable medida. No es un estudio del plazo de curación de lesiones ni permite recomendar baños fríos para recuperar tejidos con hipotiroidismo.</p>')
    content = replaceTag(content, 'p', 'Un estudio con datación por carbono 14', '<p>El tendón transmite fuerza del músculo al hueso. Un <a href="https://pubmed.ncbi.nlm.nih.gov/23401563/">estudio con carbono 14 en el núcleo del Aquiles adulto</a> encontró poco recambio de ese tejido. No midió todas las regiones del tendón ni el plazo de rehabilitación de una lesión; no debe utilizarse para calcular cuándo podrás volver a correr o cargar.</p>')
    content = replaceTag(content, 'li', 'Meneses-Echávez', '<li>Duñabeitia I et al. <a href="https://pubmed.ncbi.nlm.nih.gov/37999992/">Revisión sobre ejercicio en hipotiroidismo</a>. Scandinavian Journal of Clinical and Laboratory Investigation, 2023.</li>')
    content = replaceTag(content, 'li', 'DeFroda SF', '<li>Cottrell JA et al. <a href="https://pubmed.ncbi.nlm.nih.gov/27871408/">Biología de la curación ósea y ligamentosa</a>. Foot and Ankle Clinics, 2016.</li>')
    content = replaceTag(content, 'li', 'Moore E', '<li>Choo HC et al. <a href="https://pubmed.ncbi.nlm.nih.gov/36862831/">Inmersión en agua fría y recuperación del rendimiento</a>. Journal of Sports Sciences; DOI: 10.1080/02640414.2023.2178872.</li>')
    content = replaceTag(content, 'p', 'En el Método Tiroides organizamos', '<p>Para seguir aprendiendo, tienes la <a href="/comunidad/entrar">comunidad gratuita para mujeres con hipotiroidismo o Hashimoto</a>. Método BASE Tiroides es un paso opcional de pago para entrenamiento y hábitos; no diagnostica lesiones ni sustituye la rehabilitación sanitaria.</p>')
  }
  content += note
  updates.push({ table: 'posts', slug, fields: { content } })
}
{
  const slug = 'cansancio-e-hipotiroidismo'
  let content = getRow(posts, slug).content
  content = replaceTag(content, 'p', 'https://pubmed.ncbi.nlm.nih.gov/37999992/', '<p>La <a href="https://pubmed.ncbi.nlm.nih.gov/37999992/">revisión de Duñabeitia y colaboradores</a> reunió diez estudios de calidad baja a moderada, principalmente en mujeres con hipotiroidismo subclínico. No permite dar por seguro cualquier ejercicio en todas las situaciones clínicas.</p>')
  content = replaceTag(content, 'li', 'Comprar suplementos', '<li>Comprar suplementos para intentar resolver el cansancio sin una indicación. No conocer tus niveles no obliga a pedir todas las analíticas: decide qué estudiar con tu equipo sanitario.</li>')
  content += note
  updates.push({ table: 'posts', slug, fields: { content } })
}
const welcome = '<h2>Empieza con una cosa que puedas aplicar</h2><p>Aquí encontrarás explicaciones sobre tiroides, fuerza y hábitos. La comunidad es gratuita: no necesitas contratar para aprender, utilizar los recursos o plantear dudas generales.</p><h2>Tu primera visita</h2><ol><li>Lee esta bienvenida y marca la lectura como completada. El avance se guarda en este navegador.</li><li>Abre <a href="/comunidad/entrena-organizate/por-que-empezar-con-fuerza">Por qué empezar con fuerza</a>. Comprende una idea; no tienes que entrenar hoy.</li><li>Utiliza el <a href="/community/resources/planificador-semanal-tiroides.pdf">planificador semanal</a> para reservar un momento posible: leer, preparar material o moverte si tu situación lo permite. Escribe una alternativa.</li></ol><h2>Cómo continuar</h2><p>Vuelve a <a href="/comunidad/mi-semana">Mi semana</a> para revisar qué pudiste aplicar y elegir el siguiente paso. Algunas lecciones se abren progresivamente desde tu registro y muestran el tiempo restante. Estar al día no obliga a repetir todo.</p><h2>Comunidad y acompañamiento</h2><p>Método BASE Tiroides es un programa opcional de pago con evaluación, plan adaptado y seguimiento durante doce semanas. Las lecciones escritas se pueden usar sin esperar a vídeos; los directos solo se anuncian cuando hay fecha confirmada.</p><p>En <a href="/comunidad/preguntas-apoyo">Preguntas y apoyo</a> puedes compartir una idea o duda general. No publiques analíticas, medicación ni datos de salud privados. El diagnóstico y el tratamiento corresponden a tu equipo sanitario.</p>'
getRow(lessons, 'lee-esto-primero')
updates.push({ table: 'lessons', slug: 'lee-esto-primero', fields: { content: welcome } })
{
  const slug = 'por-que-empezar-con-fuerza'
  let content = getRow(lessons, slug).content
  content = replaceTag(content, 'p', 'Elige dos huecos de 30 a 45 minutos', '<p>Abre el <a href="/community/resources/planificador-semanal-tiroides.pdf">planificador</a> y reserva un momento que puedas sostener. Puede ser para preparar el material o leer una explicación antes de entrenar. Si ya tienes una pauta adecuada a tu situación, organiza tus sesiones a partir de ella; no es obligatorio empezar con dos bloques de 30 a 45 minutos.</p>')
  content += '<p>Para continuar, vuelve a <a href="/comunidad/mi-semana">Mi semana</a>. Completar la lectura no significa haber realizado una sesión ni estar preparada para aumentar la carga.</p>'
  updates.push({ table: 'lessons', slug, fields: { content } })
}
for (const update of updates) {
  if (update.fields.content.includes('\uFFFD') || /<h1\b/i.test(update.fields.content)) throw new Error(`[Editorial:communityScience] HTML inválido: ${update.slug}`)
}
writeFileSync(`${directory}/prepared-updates.json`, JSON.stringify(updates, null, 2))
console.log(`Preparados ${updates.length} cambios: cuatro artículos y dos lecciones. Sin escritura en Supabase.`)
