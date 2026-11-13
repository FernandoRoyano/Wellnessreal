import { readFileSync, writeFileSync } from 'node:fs'

const [directory] = process.argv.slice(2)
if (!directory) throw new Error('[Science:prepare] Falta el directorio de respaldo')
const posts = JSON.parse(readFileSync(`${directory}/posts-backup.json`, 'utf8').replace(/^\uFEFF/, ''))
const updates = []
function tag(content, name, needle, replacement) {
  const found = [...content.matchAll(new RegExp(`<${name}\\b[^>]*>[\\s\\S]*?<\\/${name}>`, 'g'))].filter(match => match[0].replace(/<[^>]*>/g, '').includes(needle))
  if (found.length !== 1) throw new Error(`[Science:prepare] ${needle}: ${found.length} coincidencias`)
  return content.replace(found[0][0], replacement)
}
function reference(content, item) {
  const start = content.lastIndexOf('<h2>Bibliografía</h2>')
  if (start < 0) throw new Error('[Science:prepare] Falta bibliografía')
  const end = Math.max(content.indexOf('</ul>', start), content.indexOf('</ol>', start))
  if (end < 0) throw new Error('[Science:prepare] Lista de fuentes inválida')
  return content.slice(0, end) + `<li>${item}</li>\n` + content.slice(end)
}
function edit(slug, transform) {
  const before = posts.find(post => post.slug === slug)
  if (!before) throw new Error(`[Science:prepare] No existe ${slug}`)
  let content = transform(before.content)
  content = content.replace(/<p\b[^>]*>[\s\S]*?<\/p>/g, paragraph => /^Revisión (editorial|educativa)/.test(paragraph.replace(/<[^>]*>/g, '')) ? '' : paragraph)
  content += '<p>Revisión editorial de fuentes y alcance: 13 de noviembre de 2026. Se conserva la fecha original de publicación. Información educativa; no sustituye una valoración sanitaria individual.</p>'
  if (content.includes('\uFFFD') || /<h1\b/i.test(content)) throw new Error(`[Science:prepare] HTML o codificación inválida: ${slug}`)
  updates.push({ slug, id: before.id, expected_updated_at: before.updated_at, fields: { content } })
}
const creatineUrl = 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1921827/full'
const biotinUrl = 'https://cima.aemps.es/cima/dochtml/ft/64018/FT_64018.html'
const biotin = `<h2>Biotina: una interferencia con algunas pruebas</h2><p>Los productos para pelo y uñas pueden contener biotina. La <a href="${biotinUrl}">ficha técnica de levotiroxina de la AEMPS</a> advierte que puede alterar algunos inmunoanálisis tiroideos y dar resultados falsamente altos o bajos. Informa al profesional y al laboratorio de los productos que tomas antes de una extracción. Ellos decidirán si hay que modificar algo y durante cuánto tiempo; no ajustes la levotiroxina por tu cuenta ni copies un plazo universal de suspensión.</p>`

edit('creatina-mujeres-guia-evidencia', content => {
  content = tag(content, 'p', 'Esto no demuestra que ninguna mujer pueda beneficiarse.', `<p>Una <a href="${creatineUrl}">revisión con metaanálisis de Lin, Zhu y Hong (2026)</a> amplió la búsqueda hasta marzo de 2026: incluyó 34 estudios y pudo sintetizar cuantitativamente 21. Sugiere efectos pequeños en algunos resultados de rendimiento, con certeza baja y mucha variación entre estudios. No permite prometer la misma mejora a todas las mujeres. Las medidas de composición corporal mezclan resultados diferentes y no deben interpretarse como una prueba global de pérdida de grasa.</p><p>La revisión de 2025 y el metaanálisis posterior utilizan métodos distintos. Contar cuántos estudios fueron significativos no responde exactamente a lo mismo que estimar un efecto conjunto. La decisión práctica sigue necesitando contexto: objetivo, entrenamiento, tolerancia y expectativas razonables.</p>`)
  const end = content.lastIndexOf('</ol>')
  return content.slice(0, end) + `<li>Lin Y, Zhu W, Hong B. <a href="${creatineUrl}">Effects of creatine supplementation on exercise performance, physiological outcomes, and body composition in females engaged in exercise or training: a systematic review and multilevel meta-analysis</a>. Frontiers in Nutrition. 2026.</li>` + content.slice(end)
})
edit('suplementos-mujeres-guia-evidencia', content => {
  content = tag(content, 'p', 'La creatina tiene aplicaciones deportivas estudiadas.', `<p>La creatina tiene aplicaciones deportivas estudiadas. La <a href="https://pubmed.ncbi.nlm.nih.gov/39861368/">revisión de 2025</a> encontró resultados heterogéneos en mujeres activas. Un <a href="${creatineUrl}">metaanálisis de 2026</a> sugiere efectos pequeños en algunos resultados, con certeza baja. No convierte su uso en obligatorio. La <a href="/blog/creatina-mujeres-guia-evidencia">guía de creatina</a> explica las diferencias entre estas revisiones y sus límites.</p>`)
  content = content.replace('<h2>Una compra con preguntas claras</h2>', biotin + '<h2>Una compra con preguntas claras</h2>')
  return content
})
edit('suplementos-tiroides', content => content.replace('<h2>“Aceleradores del metabolismo” y complejos thyroid support</h2>', biotin + '<h2>“Aceleradores del metabolismo” y complejos thyroid support</h2>'))
edit('omega-3-mujeres', content => {
  content = tag(content, 'h2', 'Qué es el omega 3', '<h2>ALA, EPA y DHA: funciones y fuentes diferentes</h2>')
  content = tag(content, 'p', 'es un término que mezcla cosas distintas.', '<p>La familia omega-3 incluye ALA, EPA y DHA. No son intercambiables y todos merecen su contexto:</p>')
  content = tag(content, 'li', 'ALA:', '<li><strong>ALA:</strong> es un ácido graso esencial que debes obtener de la alimentación, por ejemplo de nueces, lino o chía. Parte puede convertirse en EPA y DHA, pero la conversión es limitada y variable. Estos alimentos siguen teniendo valor nutricional; no son una versión inútil del pescado.</li>')
  content = tag(content, 'p', 'Cuando hablamos del suplemento útil', '<p>Al comparar un suplemento de pescado o algas, revisa cuánto EPA y DHA aporta y para qué lo necesitas. Eso no convierte al ALA en prescindible ni demuestra que debas comprar un suplemento.</p>')
  content = tag(content, 'li', 'Lo que importa es el EPA + DHA', '<li>En una etiqueta de aceite de pescado o algas, distingue EPA y DHA de la cantidad total de aceite. El ALA también es esencial y tiene sus propias fuentes alimentarias.</li>')
  return content
})
edit('vitamina-d-mujeres', content => {
  content = tag(content, 'p', 'Durante años, la recomendación implícita', '<p>Conviene distinguir resultados: <a href="https://pubmed.ncbi.nlm.nih.gov/30415629/">VITAL</a> estudió prevención de cáncer y eventos cardiovasculares; otro análisis del mismo ensayo estudió <a href="https://pubmed.ncbi.nlm.nih.gov/35939577/">fracturas</a>. <a href="https://pubmed.ncbi.nlm.nih.gov/35026158/">D-Health</a> evaluó mortalidad, entre otros desenlaces. No son pruebas idénticas ni permiten una conclusión única sobre todos los usos de la vitamina D.</p>')
  content = tag(content, 'p', 'En adultos no seleccionados por una carencia,', '<p>VITAL no mostró una reducción significativa de sus resultados principales de cáncer o eventos cardiovasculares, ni de fracturas en el análisis correspondiente. D-Health no redujo la mortalidad total; su <a href="https://pubmed.ncbi.nlm.nih.gov/37380191/">análisis cardiovascular</a> ofreció resultados que requieren cautela, con un intervalo de confianza compatible también con ausencia de efecto. Son poblaciones y preguntas concretas: no justifican suspender el tratamiento de una carencia ni generalizar un beneficio preventivo a toda persona.</p>')
  for (const item of [
    'Manson JE et al. <a href="https://pubmed.ncbi.nlm.nih.gov/30415629/">Vitamin D Supplements and Prevention of Cancer and Cardiovascular Disease</a>. NEJM. 2019.',
    'Neale RE et al. <a href="https://pubmed.ncbi.nlm.nih.gov/35026158/">The D-Health Trial: a randomised controlled trial of the effect of vitamin D on mortality</a>. 2022.',
    'Thompson B et al. <a href="https://pubmed.ncbi.nlm.nih.gov/37380191/">Vitamin D supplementation and major cardiovascular events: D-Health randomised controlled trial</a>. BMJ. 2023.',
  ]) content = reference(content, item)
  return content
})
edit('menopausia-y-tiroides', content => {
  content = tag(content, 'p', 'Registra durante unas semanas los cambios', '<p>Anota cuándo comenzaron los cambios del ciclo, sofocos, sueño, energía y otros síntomas, junto con la medicación y los informes previos que tengas. Esa cronología ayuda a explicar lo ocurrido; no necesitas esperar varias semanas para pedir una valoración.</p>')
  content = tag(content, 'p', 'Busca atención sin demorarlo si aparece sangrado vaginal', '<p>El <a href="https://www.nhs.uk/symptoms/post-menopausal-bleeding/">sangrado vaginal después de la menopausia requiere consulta</a>, aunque sea escaso o haya ocurrido una sola vez. No lo atribuyas sin más a la tiroides. Un sangrado muy abundante con mal estado general, dolor torácico, falta de aire o un empeoramiento intenso requiere atención urgente. Los síntomas persistentes que afectan a tu vida también merecen valoración.</p>')
  return reference(content, 'NHS. <a href="https://www.nhs.uk/symptoms/post-menopausal-bleeding/">Postmenopausal bleeding</a>. Consulta de fuentes: noviembre de 2026.')
})
edit('agujetas-cansancio-debilidad-tiroides', content => {
  content = tag(content, 'p', 'Tareas que antes podías hacer,', '<p>Tareas que antes podías hacer, como levantarte, subir escalones o sostener objetos, se vuelven claramente más difíciles. Una debilidad nueva o progresiva necesita valoración, sin intentar resolverla entrenando más. Si aparece de forma repentina, especialmente en un lado del cuerpo, o con dificultad para hablar o cambios en la cara, busca atención de emergencia inmediatamente: el <a href="https://www.nhs.uk/conditions/stroke/symptoms/">NHS describe estos signos de alarma</a>. No esperes a ver si desaparecen ni los atribuyas a agujetas.</p>')
  return reference(content, 'NHS. <a href="https://www.nhs.uk/conditions/stroke/symptoms/">Symptoms of a stroke</a>. Debilidad repentina y señales de alarma.')
})
edit('dietas-extremas-frenan-tiroides', content => {
  const needle = '<h2>Lo que no conviene concluir</h2>'
  if (!content.includes(needle)) throw new Error('[Science:prepare] Falta sección de dietas')
  return content.replace(needle, '<p>No existe un único umbral de disponibilidad energética que diagnostique REDs en todas las personas. Una cifra de calorías, el peso corporal o una T3 aislada no sustituyen la valoración clínica. El consenso del COI exige considerar el conjunto y descartar otras causas; no es un test para aplicártelo en casa.</p>' + needle)
})
edit('berberina-evidencia-cientifica', content => {
  if (!content.includes('Liang Y et al.')) throw new Error('[Science:prepare] Autor de berberina no encontrado')
  return content.replace('Liang Y et al.', 'Xie W et al.')
})

if (updates.length !== 9) throw new Error('[Science:prepare] Número de cambios inesperado')
writeFileSync(`${directory}/posts-updates.json`, JSON.stringify(updates, null, 2))
console.log(`Preparados ${updates.length} artículos; hierro revisado sin cambios. Sin escritura en la base de datos.`)
