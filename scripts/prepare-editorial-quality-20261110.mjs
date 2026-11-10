import { readFileSync, writeFileSync } from 'node:fs'
import { marked } from 'marked'

const [backupFile, outputFile] = process.argv.slice(2)
if (!backupFile || !outputFile) throw new Error('[Editorial:prepare] Indica copia de seguridad y archivo de salida')
const posts = JSON.parse(readFileSync(backupFile, 'utf8').replace(/^\uFEFF/, ''))
const getPost = slug => {
  const post = posts.find(item => item.slug === slug)
  if (!post) throw new Error(`[Editorial:prepare] No existe ${slug}`)
  return post
}
const updates = []
for (const [slug, title, excerpt, minutes] of [
  ['creatina-mujeres-guia-evidencia', 'Creatina para mujeres: beneficios, límites y cómo decidir si te interesa', 'Qué puede aportar la creatina a una mujer que entrena, qué límites tiene la evidencia y cómo decidir sin convertir un suplemento en una obligación.', '7 min de lectura'],
  ['suplementos-mujeres-guia-evidencia', 'Suplementos para mujeres: cómo decidir con evidencia y contexto', 'Valora suplementos según tu objetivo, alimentación y salud: qué revisar, qué límites tiene la evidencia y cuándo consultar.', '6 min de lectura'],
]) {
  getPost(slug)
  const markdown = readFileSync(`content/blog/${slug}.md`, 'utf8').replace(/^\uFEFF/, '')
  const body = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)?.[1]
  if (!body) throw new Error(`[Editorial:prepare] Frontmatter inválido: ${slug}`)
  updates.push({ slug, fields: { title, excerpt, read_time: minutes, content: marked.parse(body, { gfm: true, breaks: true }) } })
}

function replaceParagraph(content, needle, replacement) {
  const matches = [...content.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/g)].filter(match => match[0].includes(needle))
  if (matches.length !== 1) throw new Error(`[Editorial:replaceParagraph] ${needle}: ${matches.length} coincidencias`)
  return content.replace(matches[0][0], replacement)
}
function replaceSection(content, title, body) {
  const start = Math.max(content.indexOf(`<h2>${title}</h2>`), content.indexOf(`<h3>${title}</h3>`))
  if (start < 0) throw new Error(`[Editorial:replaceSection] Falta ${title}`)
  const next = content.indexOf('<h2>', start + 5)
  if (next < 0) throw new Error(`[Editorial:replaceSection] Falta el siguiente apartado de ${title}`)
  return content.slice(0, start) + body + '\n' + content.slice(next)
}
function replaceListItem(content, needle, replacement) {
  const matches = [...content.matchAll(/<li\b[^>]*>[\s\S]*?<\/li>/g)].filter(match => match[0].includes(needle))
  if (matches.length !== 1) throw new Error(`[Editorial:replaceListItem] ${needle}: ${matches.length} coincidencias`)
  return content.replace(matches[0][0], `<li>${replacement}</li>`)
}

{
  const slug = 'tipos-proteina-polvo-guia-mujeres'
  let content = getPost(slug).content
  content = replaceParagraph(content, 'Certificación antidopaje (si compites)', '<p><strong>Controles independientes si compites.</strong> <a href="https://sport.wetestyoutrust.com/about">Informed Sport</a> analiza cada lote antes de su comercialización; <a href="https://choice.wetestyoutrust.com/about">Informed Choice</a> utiliza su propio programa de vigilancia y análisis de productos. No son el mismo procedimiento. Comprueba producto y lote en el programa correspondiente: reducen determinados riesgos, pero no garantizan ausencia absoluta de cualquier contaminante ni resultados deportivos.</p>')
  content = replaceParagraph(content, 'Lista de ingredientes corta.', '<p><strong>Ingredientes comprensibles.</strong> Revisa fuente de proteína, cantidad por ración, alérgenos y tolerancia. Que un ingrediente tenga un nombre poco familiar o que el producto incluya edulcorantes no demuestra por sí solo mala calidad. Desconfía de mezclas que ocultan las cantidades relevantes.</p>')
  content = content.replace('<h2>Bibliografía</h2>', '<h2>Un ejemplo para elegir sin complicarte</h2><p>Ejemplo didáctico: si toleras lácteos y buscas comodidad, compara una opción sencilla por cantidad de proteína, precio y tolerancia. Si tienes alergia a la proteína de leche, un aislado de suero no es una alternativa adecuada por tener menos lactosa. El <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/lactose-intolerance/definition-facts">NIDDK distingue alergia a la leche e intolerancia a la lactosa</a>. La elección depende de qué necesitas evitar, no solo de cuál parece más avanzada.</p><p>Revisión editorial de controles y criterios de compra: 10 de noviembre de 2026.</p><h2>Bibliografía</h2>')
  updates.push({ slug, fields: { content } })
}
{
  const slug = 'vitamina-d-mujeres'
  let content = getPost(slug).content
  content = replaceSection(content, 'Entonces, ¿cuándo tiene sentido para ti?', '<h2>Cuándo conviene valorarla</h2><p>La necesidad depende de la edad, la alimentación y la situación clínica. Pasar tiempo dentro de casa, tener piel oscura, obesidad o estar en menopausia no permite diagnosticar un déficit ni convierte una analítica o un suplemento en obligatorios.</p><p>La <a href="https://www.endocrine.org/clinical-practice-guidelines/vitamin-d-for-prevention-of-disease">guía de la Endocrine Society de 2024</a> desaconseja el cribado rutinario en adultos generalmente sanos sin indicaciones establecidas. También contempla recomendaciones específicas según edad y situaciones como embarazo. No todo uso se limita a corregir una cifra baja.</p>')
  content = content.replace('<h2>El mensaje clave: mídete antes de suplementar</h2>', '<h2>La decisión no empieza siempre por una analítica</h2>')
  content = replaceParagraph(content, '¿Significa eso que la vitamina D no sirve?', '<p>Eso no significa que la vitamina D carezca de utilidad. Corregir una carencia es una aplicación, pero las recomendaciones también contemplan situaciones por edad o condición clínica. Hay que distinguir mantener una ingesta adecuada, suplementar con una indicación y tratar un déficit.</p>')
  content = replaceSection(content, 'Cómo suplementar (si toca)', '<h2>Cómo organizar una pauta si está indicada</h2><p>Si un profesional indica suplementación, confirma producto, dosis, duración y seguimiento. No uses una dosis de mantenimiento publicada en internet para tratar un posible déficit. Si ya tomas un multivitamínico o varios productos, revisa la suma para evitar duplicidades.</p><p>La D2 y la D3 son formas utilizadas en suplementos. La elección y la pauta necesitan contexto; no hace falta añadir K2 o magnesio por sistema. La información de <a href="https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/">NIH sobre vitamina D</a> desarrolla formas, usos y límites de seguridad.</p>')
  content = content.replace('<li><strong>D3 (colecalciferol)</strong>, no D2.</li>', '<li>Forma y dosis acordes con la pauta indicada, no con una promesa publicitaria.</li>')
  content = content.replace('Lista de ingredientes corta, sin rellenos raros.', 'Ingredientes, alérgenos y cantidad por dosis claramente identificados.')
  content = replaceSection(content, 'Cuánto cuesta', '<h2>Comparar productos sin elegir una dosis por el precio</h2><p>Si ya existe una pauta profesional, compara productos que aporten esa cantidad y revisa caducidad, unidades por envase y coste real. Un bote más concentrado no es automáticamente más apropiado. No añadas otras vitaminas para justificar una fórmula más cara.</p>')
  content = content.replace('Su valor está en <strong>corregir déficit</strong>, no en sumar de más.', 'Sus usos dependen de la edad, las necesidades y la situación clínica.')
  content = replaceListItem(content, 'Forma:</strong> D3', 'Forma, dosis y seguimiento según la indicación profesional; no toda decisión requiere una analítica.')
  content = replaceListItem(content, 'Si estás <strong>bien', 'Un resultado dentro de un rango no justifica añadir vitamina D para obtener más energía. Interpreta el resultado con el profesional que la haya solicitado.')
  content = replaceParagraph(content, '¿Quieres dejar de ir dando palos', '<p>Si necesitas organizar entrenamiento y hábitos, puedes conocer el <a href="/servicios/entrenamiento-online">acompañamiento individual</a>. La valoración de síntomas y la pauta de vitamina D corresponden a tu equipo sanitario.</p>')
  content = content.replace('<h2>Bibliografía</h2>', '<p>Revisión editorial de indicaciones, cribado y pauta: 10 de noviembre de 2026.</p><h2>Bibliografía</h2>')
  updates.push({ slug, fields: { content } })
}
{
  const slug = 'omega-3-mujeres'
  let content = getPost(slug).content
  content = replaceParagraph(content, 'Choque de realidad:', '<p><strong>La dosis necesita contexto.</strong> No es correcto afirmar que una dosis mayor nunca aporta beneficios adicionales: existen tratamientos de prescripción para situaciones concretas. Tampoco deben trasladarse esas pautas a la población general. La <a href="https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/">revisión del NIH</a> describe resultados diferentes según formulación y población; algunos ensayos con dosis altas encontraron más fibrilación auricular en personas con enfermedad o riesgo cardiovascular. No aumentes la cantidad por una promesa de reducir inflamación.</p>')
  content = replaceSection(content, 'La trampa de la etiqueta (léela bien)', '<h2>Leer la etiqueta sin convertir un ejemplo en una dosis</h2><p>La cantidad de aceite de pescado no equivale a la de EPA y DHA. Un producto puede declarar 1.000 mg de aceite y contener 300 mg de EPA+DHA: es un ejemplo de composición, no una instrucción para multiplicar cápsulas. Comprueba además si la cifra corresponde a una cápsula o a varias.</p><p>La cantidad de EPA/DHA es un dato relevante, junto con ingredientes, alérgenos, conservación y la pauta que corresponda a tu situación. No es el único número que importa.</p>')
  content = replaceSection(content, 'Cómo elegir un suplemento de omega 3', '<h2>Cómo comparar calidad y tolerancia</h2><p>Revisa fabricante, composición, lote y conservación. Una forma química, un envase opaco o un sabor suave no demuestran por sí solos calidad, ausencia de oxidación o eficacia clínica. No utilices morder una cápsula como prueba de laboratorio.</p><p>Los productos de algas pueden aportar DHA o EPA; comprueba cuáles y en qué cantidad. Si hay un análisis independiente, revisa qué se ha medido y a qué producto o lote corresponde. Un sello no significa ausencia absoluta de cualquier contaminante.</p>')
  content = replaceSection(content, 'Cuánto cuesta', '<h2>Precio: compara el contenido que necesitas</h2><p>Calcula el coste según la cantidad de EPA y DHA y el producto que resulte adecuado para tu situación, no solo por cápsula. Un precio mayor no demuestra mejor tolerancia ni beneficio. Si existe una pauta de prescripción, no la sustituyas por un complemento aparentemente equivalente.</p>')
  content = content.replace('los omega 3 de cadena larga, los que de verdad tienen efectos en tu cuerpo.', 'omega 3 de cadena larga con funciones y aplicaciones estudiadas.')
  content = replaceListItem(content, 'Calidad:</strong> forma de triglicérido', 'Calidad: comprueba composición, fabricante, lote, conservación y alcance de los controles. La forma química por sí sola no garantiza calidad. Las algas son una opción si no consumes pescado.')
  content = replaceListItem(content, 'Para qué sirve (', 'Utilidad según contexto: los tratamientos para triglicéridos, el embarazo y la alimentación plantean necesidades distintas. Un resultado clínico no se puede trasladar a cualquier suplemento ni a todas las mujeres.')
  content = content.replace('<h2>Bibliografía</h2>', '<h2>Antes de decidir, concreta la pregunta</h2><p>Ejemplo didáctico: no comer pescado, tener triglicéridos altos y buscar aliviar síntomas son tres preguntas diferentes. La primera puede abordarse revisando alimentación y alternativas; la segunda y la tercera necesitan valoración clínica. No se resuelven todas con la misma cápsula ni con una cantidad universal.</p><p>Revisión editorial de dosis y límites: 10 de noviembre de 2026.</p><h2>Bibliografía</h2>')
  updates.push({ slug, fields: { content } })
}
for (const update of updates) {
  update.fields.content = update.fields.content.replaceAll('Fitness real para gente con vida real', 'Fuerza para la vida real')
  if (update.fields.content.includes('\uFFFD')) throw new Error(`[Editorial:prepare] Codificación inválida: ${update.slug}`)
  if (/<h1\b/i.test(update.fields.content)) throw new Error(`[Editorial:prepare] H1 duplicado: ${update.slug}`)
}
writeFileSync(outputFile, JSON.stringify(updates, null, 2))
console.log(`Preparados ${updates.length} artículos. No se ha modificado la base de datos.`)
