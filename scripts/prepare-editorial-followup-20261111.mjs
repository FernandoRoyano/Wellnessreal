import { readFileSync, writeFileSync } from 'node:fs'

const [directory] = process.argv.slice(2)
if (!directory) throw new Error('[Editorial:followup] Indica el directorio de respaldo')
const posts = JSON.parse(readFileSync(`${directory}/posts-backup.json`, 'utf8').replace(/^\uFEFF/, ''))
const updates = []
function getPost(slug) {
  const row = posts.find(item => item.slug === slug)
  if (!row) throw new Error(`[Editorial:followup] No existe ${slug}`)
  return row
}
function replaceTag(content, tag, needle, replacement) {
  const matches = [...content.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'g'))]
    .filter(match => match[0].includes(needle) || match[0].replace(/<[^>]*>/g, '').includes(needle))
  if (matches.length !== 1) throw new Error(`[Editorial:followup] ${needle}: ${matches.length} coincidencias`)
  return content.replace(matches[0][0], replacement)
}
const community = '<p>Para seguir aprendiendo sobre fuerza y hábitos, tienes la <a href="/comunidad/entrar">comunidad gratuita para mujeres con hipotiroidismo o Hashimoto</a>. La comunidad no diagnostica ni interpreta analíticas. Método BASE Tiroides es un <a href="/metodo-tiroides">paso opcional de pago</a> para organizar y revisar el entrenamiento.</p>'
const revision = '<p>Revisión educativa de fuentes y alcance: 11 de noviembre de 2026. Se conserva la fecha original de publicación. No constituye una valoración sanitaria individual.</p>'
{
  const slug = 'dietas-extremas-frenan-tiroides'
  let content = getPost(slug).content
  content = replaceTag(content, 'p', 'Un enfoque más razonable suele incluir un déficit moderado', '<p>Si aparecen estas señales, no respondas recortando todavía más la comida o aumentando el ejercicio: primero conviene valorar su causa y el coste del plan con el profesional adecuado. Un déficit energético no es una respuesta universal al cansancio ni a una posible baja disponibilidad energética. Las necesidades dependen de la situación clínica y de la historia individual.</p>')
  content = replaceTag(content, 'p', 'En deporte, una baja disponibilidad energética', '<p>En deporte, una baja disponibilidad energética problemática se relaciona con alteraciones en distintos sistemas. El <a href="https://bjsm.bmj.com/content/57/17/1073">consenso del COI sobre REDs</a> incluye la T3 entre los indicadores que necesitan contexto y exclusión de otras causas. Está dirigido al ámbito deportivo: no permite diagnosticar REDs ni enfermedad tiroidea por un síntoma o una analítica aislada en cualquier lector.</p>')
  content = replaceTag(content, 'p', 'Si quieres perder grasa sin convertir', community)
  content += '<h2>Un ejemplo para ordenar la siguiente decisión</h2><p><strong>Ejemplo didáctico:</strong> has reducido mucho la comida, entrenas más y aparecen mareos o una caída importante del rendimiento. El siguiente paso no es buscar un nuevo recorte ni intentar corregir una hormona por tu cuenta. Explica los cambios a tu equipo sanitario. El registro de comidas y actividad sirve para contar lo ocurrido, no para autodiagnosticarte.</p>' + revision
  updates.push({ table: 'posts', slug, fields: { content } })
}
{
  const slug = 'menopausia-y-tiroides'
  let content = getPost(slug).content
  content = replaceTag(content, 'p', 'Los cambios en el patrón menstrual', '<p>Los cambios menstruales, sofocos y sudores nocturnos son característicos, pero varían entre personas. <a href="https://www.nice.org.uk/guidance/ng23/chapter/Recommendations">NICE NG23</a> recomienda identificar clínicamente la transición menopáusica en personas generalmente sanas de 45 años o más con el cuadro apropiado. Esto no significa que toda ausencia de regla confirme menopausia: anticoncepción hormonal, histerectomía, edad y antecedentes requieren su propio contexto.</p>')
  content = replaceTag(content, 'li', 'Actualizada en 2024.', '<li>NICE. <a href="https://www.nice.org.uk/guidance/ng23/chapter/Recommendations">Menopausia: identificación y manejo (NG23)</a>. Recomendaciones consultadas el 11 de noviembre de 2026.</li>')
  content = replaceTag(content, 'p', 'Si necesitas adaptar el entrenamiento a esta etapa', community)
  content += '<h2>Un ejemplo de preguntas diferentes</h2><p><strong>Ejemplo didáctico:</strong> notar sofocos y cambios del ciclo, o sentir cansancio sin esos cambios, son motivos para explicar situaciones distintas en consulta. Ninguno permite ajustar la levotiroxina desde una tabla de síntomas. Lleva una cronología de lo que ha cambiado y pregunta qué merece valoración; no es necesario pedir todas las pruebas hormonales.</p>' + revision
  updates.push({ table: 'posts', slug, fields: { content } })
}
{
  const slug = 'agujetas-cansancio-debilidad-tiroides'
  let content = getPost(slug).content
  content = replaceTag(content, 'p', 'Una revisión de ejercicio en personas con hipotiroidismo', '<p>La <a href="https://pubmed.ncbi.nlm.nih.gov/37999992/">revisión de Duñabeitia y colaboradores</a> incluyó diez estudios de calidad baja a moderada, principalmente en mujeres con hipotiroidismo subclínico. No establece una rutina segura para toda situación clínica ni sirve para decidir si un dolor es benigno. La <a href="/blog/mejor-ejercicio-hipotiroidismo">guía de ejercicio con hipotiroidismo</a> aporta ejemplos generales, sin sustituir esa valoración.</p>')
  content = replaceTag(content, 'p', 'Si necesitas adaptar el entrenamiento a tu energía actual', '<p>Para seguir aprendiendo y organizar una primera acción posible, puedes entrar en la <a href="/comunidad/entrar">comunidad gratuita</a>. Las dudas clínicas y la valoración de síntomas corresponden a tu equipo sanitario.</p>')
  content = replaceTag(content, 'p', 'Cuando lo que necesitas es organizar y revisar', '<p>Si más adelante necesitas organizar y revisar el entrenamiento con seguimiento, consulta el alcance de <a href="/metodo-tiroides">Método BASE Tiroides</a>. Es un programa opcional de pago; no interpreta analíticas ni modifica medicación.</p>')
  content += '<h2>Lo que el tiempo por sí solo no resuelve</h2><p>No hay una regla de 48 o 72 horas que descarte una lesión o un problema médico. Importan la intensidad, la evolución y las actividades que ya no puedes hacer. Las <a href="https://www.cdc.gov/niosh/rhabdo/signs-symptoms/">señales descritas por los CDC</a> requieren atención cuando aparecen; no esperes a reunirlas todas ni a completar un plazo de descanso para pedir ayuda.</p>' + revision
  updates.push({ table: 'posts', slug, fields: { content } })
}
{
  const slug = 'suplementos-tiroides'
  let content = getPost(slug).content
  content = replaceTag(content, 'p', 'El selenio participa en procesos importantes', '<p>El selenio participa en funciones tiroideas, pero eso no constituye una indicación universal para suplementarlo. El <a href="https://pubmed.ncbi.nlm.nih.gov/38243784/">metaanálisis de Huwiler y colaboradores (2024)</a> reunió 35 estudios y observó cambios en determinados marcadores: la TSH se redujo en pacientes sin tratamiento hormonal; los anticuerpos TPO, en grupos con y sin tratamiento. No encontró cambios significativos en varias hormonas ni en el volumen tiroideo.</p>')
  content = replaceTag(content, 'p', 'La decisión sensata depende de tu alimentación', '<p>Un cambio en anticuerpos no equivale a curar Hashimoto ni demuestra por sí solo más energía o una menor necesidad de medicación. El <a href="https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/">NIH sobre selenio</a> describe sus límites y riesgos por exceso. Revisa con tu equipo sanitario los productos que ya tomas: combinar varios puede duplicar nutrientes. No elijas una dosis para intentar bajar una cifra de anticuerpos.</p>')
  content = replaceTag(content, 'p', 'Con el hierro hay que ser especialmente cuidadosa', '<p>El <a href="https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/">NIH sobre hierro</a> describe la interferencia de los suplementos de hierro con la absorción de levotiroxina. La separación y la dosis debe indicarlas el profesional que lleva tu tratamiento.</p>')
  content += '<h2>Bibliografía</h2><ul><li>Huwiler VV, et al. Selenium Supplementation in Patients with Hashimoto Thyroiditis: A Systematic Review and Meta-Analysis of Randomized Clinical Trials. Thyroid. 2024. <a href="https://pubmed.ncbi.nlm.nih.gov/38243784/">PubMed</a>.</li><li>NIH Office of Dietary Supplements. <a href="https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/">Selenium</a> e <a href="https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/">Iron</a>: fichas para profesionales.</li><li>Endocrine Society. <a href="https://www.endocrine.org/clinical-practice-guidelines/vitamin-d-for-prevention-of-disease">Vitamin D for the Prevention of Disease</a>, guía clínica de 2024.</li><li>NIDDK. <a href="https://www.niddk.nih.gov/health-information/endocrine-diseases/hashimotos-disease">Hashimoto’s Disease</a>.</li><li>American Thyroid Association. <a href="https://www.thyroid.org/ata-statement-on-the-potential-risks-of-excess-iodine-ingestion-and-exposure/">Riesgos del exceso de yodo</a>.</li></ul>'
  content += '<h2>Un ejemplo para leer una promesa con criterio</h2><p><strong>Ejemplo didáctico:</strong> una etiqueta promete reducir anticuerpos y sentirte mejor. Son dos resultados diferentes. Comprueba qué se midió en el estudio, en qué personas y si evaluó realmente síntomas o calidad de vida; un marcador aislado no responde a todas esas preguntas.</p>' + community + revision
  updates.push({ table: 'posts', slug, fields: { title: 'Suplementos y tiroides: evidencia, límites y cuándo consultar', content } })
}
for (const update of updates) {
  const content = update.fields.content
  const exampleStart = content.indexOf('<h2>Un ejemplo') >= 0 ? content.indexOf('<h2>Un ejemplo') : content.indexOf('<h2>Lo que el tiempo')
  const exampleEnd = content.indexOf('</p>', exampleStart) + 4
  const bibliography = content.indexOf('<h2>Bibliografía</h2>')
  if (exampleStart < 0 || exampleEnd < 4 || bibliography < 0) throw new Error(`[Editorial:followup] Falta estructura: ${update.slug}`)
  const example = content.slice(exampleStart, exampleEnd)
  update.fields.content = content.replace(example, '').replace('<h2>Bibliografía</h2>', `${example}\n<h2>Bibliografía</h2>`)
  if (update.fields.content.includes('\uFFFD') || /<h1\b/i.test(update.fields.content)) throw new Error(`[Editorial:followup] HTML inválido: ${update.slug}`)
}
writeFileSync(`${directory}/prepared-updates.json`, JSON.stringify(updates, null, 2))
console.log(`Preparados ${updates.length} artículos. Sin escritura en Supabase.`)
