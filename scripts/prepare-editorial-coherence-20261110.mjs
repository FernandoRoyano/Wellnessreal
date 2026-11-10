import { readFileSync, writeFileSync } from 'node:fs'
import { marked } from 'marked'

const [backupFile, outputFile] = process.argv.slice(2)
if (!backupFile || !outputFile) throw new Error('[Editorial:coherence] Indica copia y archivo de salida')
const posts = JSON.parse(readFileSync(backupFile, 'utf8').replace(/^\uFEFF/, ''))
const updates = []
function getPost(slug) {
  const post = posts.find(item => item.slug === slug)
  if (!post) throw new Error(`[Editorial:coherence] No existe ${slug}`)
  return post
}
function replaceElement(content, tag, needle, replacement) {
  const matches = [...content.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'g'))]
    .filter(match => match[0].replace(/<[^>]*>/g, '').includes(needle))
  if (matches.length !== 1) throw new Error(`[Editorial:coherence] ${needle}: ${matches.length} coincidencias`)
  return content.replace(matches[0][0], replacement)
}
const revision = '<p>Revisión editorial de coherencia: 10 de noviembre de 2026. Se conserva la publicación original.</p>'
{
  const slug = 'hierro-mujeres'
  getPost(slug)
  const source = readFileSync(`content/blog/${slug}.md`, 'utf8')
  const body = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)?.[1]
  if (!body) throw new Error('[Editorial:coherence] Falta cuerpo de hierro')
  updates.push({ slug, fields: {
    title: 'Hierro en mujeres: déficit, analíticas y cuándo consultar',
    excerpt: 'Cómo se valora un posible déficit de hierro, por qué el cansancio no basta para identificarlo y qué revisar si te indican suplementación.',
    read_time: '5 min de lectura',
    content: marked.parse(body, { gfm: true, breaks: true }),
  } })
}
{
  const slug = 'vitamina-d-mujeres'
  let content = getPost(slug).content
  content = replaceElement(content, 'p', 'Calificación de evidencia:', '<p><strong>Evidencia según la pregunta.</strong> La vitamina D es necesaria, pero añadir un suplemento no mejora todos los resultados de salud. Hay que distinguir una ingesta adecuada, las indicaciones de prevención y el tratamiento de una carencia.</p>')
  content = replaceElement(content, 'p', 'La vitamina D no es solo', '<p>La vitamina D es un nutriente que también puede producirse en la piel mediante exposición a UVB. Después se transforma en el organismo hasta su forma hormonal activa. Participa en la regulación del calcio y la salud ósea, entre otras funciones. Que sea necesaria no significa que añadir un suplemento aporte beneficios a toda persona.</p>')
  content = replaceElement(content, 'p', 'Aquí va el primer matiz', '<p>El cristal limita el paso de UVB y no sirve para asegurar una síntesis suficiente. Además, influyen estación, latitud y otras circunstancias. El <a href="https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/">NIH explica estas diferencias</a>: vivir en un país soleado no permite conocer tu estado ni justifica buscar más exposición solar sin protección.</p>')
  content = replaceElement(content, 'p', '¿Qué encontraron?', '<p>En adultos no seleccionados por una carencia, los grandes ensayos no han mostrado un beneficio uniforme de suplementar para prevenir enfermedades. Sus resultados no equivalen a que la vitamina D carezca de indicaciones ni a que todos los ensayos hayan evaluado lo mismo. La edad, la población y el resultado estudiado importan.</p>')
  content = replaceElement(content, 'li', 'Si estás por debajo del rango', '<li>Si se solicita una analítica, interpreta el resultado con el profesional que la haya indicado. Una cifra aislada no determina por sí sola el tratamiento.</li>')
  content = replaceElement(content, 'p', 'Choque de realidad:', '<p><strong>Más no es mejor.</strong> Dosis excesivas de vitamina D pueden producir toxicidad e hipercalcemia. Que otra vitamina se elimine en mayor medida por la orina tampoco significa que sus dosis altas sean inocuas.</p>')
  content = replaceElement(content, 'li', 'El sol por la ventana', '<li>El estado de vitamina D depende de varias circunstancias; no puede deducirse solo del sol que ves por la ventana.</li>')
  content = replaceElement(content, 'p', 'Esta guía tiene fines informativos', '<p>Información educativa. No cambies una pauta profesional por una recomendación genérica ni tomes dosis altas por tu cuenta. Las pruebas y el seguimiento dependen de la indicación clínica.</p>')
  content = replaceElement(content, 'p', 'Si necesitas organizar entrenamiento y hábitos', '<p>Si eres una mujer con hipotiroidismo o Hashimoto y quieres aprender sobre fuerza y hábitos, tienes nuestra <a href="/comunidad/entrar">comunidad gratuita</a>. La valoración de síntomas y la pauta de vitamina D corresponden a tu equipo sanitario.</p>')
  content = content.replace('<h2>Bibliografía</h2>', '<h2>Un ejemplo para ordenar la decisión</h2><p><strong>Ejemplo didáctico:</strong> pasar el día en una oficina no basta para decidir una analítica o una dosis. Primero aclara si hay una indicación clínica o una recomendación por edad o situación. Si ya tienes una pauta profesional, confirma cómo seguirla; no la suspendas porque un artículo diga que los suplementos sobran.</p><h2>Bibliografía</h2>')
  updates.push({ slug, fields: {
    title: 'Vitamina D: cuándo valorarla y qué límites tiene la suplementación',
    excerpt: 'Qué sabemos sobre vitamina D, cuándo conviene valorar la suplementación y por qué una analítica no es un paso universal para toda persona sana.',
    content,
  } })
}
{
  const slug = 'suplementos-tiroides'
  let content = getPost(slug).content
  content = replaceElement(content, 'li', 'Si no sabes cómo están tus niveles, primero se mide.', '<li>No conocer tus niveles no obliga a pedir pruebas. El profesional decide si hacen falta según la pregunta clínica y el nutriente.</li>')
  content = replaceElement(content, 'li', 'Revisa analíticas y tratamiento.', '<li><strong>Revisa tu contexto y tratamiento con el equipo sanitario.</strong> Los síntomas no identifican qué nutriente falta ni obligan a pedir todas las pruebas.</li>')
  content = content.replace('<h2>Antes de suplementarte:', '<p>Para vitamina D, la <a href="https://www.endocrine.org/clinical-practice-guidelines/vitamin-d-for-prevention-of-disease">Endocrine Society</a> desaconseja el cribado rutinario en adultos generalmente sanos sin indicaciones establecidas. Esto no sustituye las pruebas que pueda requerir tu enfermedad tiroidea ni el seguimiento de la medicación.</p><h2>Antes de suplementarte:')
  content += revision
  updates.push({ slug, fields: {
    excerpt: 'Yodo, selenio, vitamina D y hierro: qué límites tiene la evidencia, cuándo consultar y por qué los síntomas no justifican comprar suplementos por tu cuenta.',
    content,
  } })
}
{
  const slug = 'tipos-proteina-polvo-guia-mujeres'
  let content = getPost(slug).content
  content = replaceElement(content, 'p', 'Rangos orientativos a fecha de redacción.', '<p>Estos importes son referencias del momento de redacción, no precios comprobados hoy ni una recomendación de marca. Compara composición, alérgenos, tolerancia y coste por cantidad de proteína; un precio mayor no demuestra mayor utilidad.</p>')
  updates.push({ slug, fields: {
    title: 'Proteína en polvo: tipos y criterios para elegir según tu caso',
    excerpt: 'Diferencias entre suero, aislado, caseína y opciones vegetales; cómo comparar composición, tolerancia y controles sin asumir que necesitas un batido.',
    content,
  } })
}
{
  const slug = 'omega-3-mujeres'
  let content = getPost(slug).content
  content = replaceElement(content, 'p', 'Calificación de evidencia:', '<p><strong>La utilidad depende del objetivo.</strong> No comer pescado puede justificar revisar la alimentación y alternativas, pero no demuestra por sí solo que necesites un suplemento. Las indicaciones clínicas, el embarazo y la ingesta habitual requieren decisiones diferentes.</p>')
  content = replaceElement(content, 'li', 'Salud general si no comes pescado:', '<li><strong>Si no comes pescado:</strong> revisa el conjunto de tu alimentación y las alternativas disponibles. Un complemento puede ser una opción según tus necesidades; no es automáticamente necesario ni equivale a todos los beneficios de comer pescado.</li>')
  content = replaceElement(content, 'p', 'Si quieres dejar de coleccionar botes', '<p>Para aprender sobre fuerza y hábitos si eres una mujer con hipotiroidismo o Hashimoto, puedes entrar en la <a href="/comunidad/entrar">comunidad gratuita</a>. Las decisiones clínicas sobre omega 3 deben revisarse con tu equipo sanitario.</p>')
  content += revision
  updates.push({ slug, fields: { content } })
}
{
  const slug = 'gluten-e-hipotiroidismo'
  getPost(slug)
  updates.push({ slug, fields: { excerpt: 'Qué sabemos sobre gluten, Hashimoto y celiaquía, cuándo consultar y por qué no conviene retirar alimentos antes de estudiar una sospecha.' } })
}
for (const update of updates) {
  for (const value of Object.values(update.fields)) {
    if (value.includes('\uFFFD')) throw new Error(`[Editorial:coherence] Codificación: ${update.slug}`)
  }
  if (update.fields.content && /<h1\b/i.test(update.fields.content)) throw new Error(`[Editorial:coherence] H1: ${update.slug}`)
}
writeFileSync(outputFile, JSON.stringify(updates, null, 2))
console.log(`Preparados ${updates.length} artículos; sin cambios en Supabase.`)
