import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const output = path.join(root, 'output/seo-leads-20261103')
const previewPath = path.join(output, 'article-refresh-preview.json')

const changes = [
  {
    slug: 'mejor-ejercicio-hipotiroidismo',
    title: 'Ejercicio con hipotiroidismo: fuerza, cardio y cómo empezar',
    excerpt: 'Qué ejercicio hacer con hipotiroidismo: fuerza, cardio y un ejemplo de semana. Aprende a ajustar el entrenamiento a tu energía y cuándo consultar.',
    introduction: '¿Qué ejercicio hacer si tienes hipotiroidismo? No hay una modalidad que sea la mejor para todo el mundo: fuerza, cardio y movimiento diario aportan cosas distintas. Esta guía te ayuda a combinarlos, empezar con una estructura sencilla y observar cómo recuperas.',
    heading: 'Cómo pasar de esta guía a un entrenamiento acompañado',
    paragraphs: [
      'Si necesitas ordenar las opciones, continúa con la <a href="/hipotiroidismo/ejercicio">guía de ejercicio con hipotiroidismo</a>. Para entender cómo registrar y ajustar el esfuerzo, tienes la explicación de <a href="/blog/rir-rpe-autoregular-entrenamiento">RIR y RPE</a>.',
      'Si buscas acompañamiento, revisa <a href="/metodo-tiroides">qué incluye Método BASE Tiroides y cómo solicitar plaza</a>. Es un programa de entrenamiento y hábitos de 12 semanas en grupo reducido. Para una programación completamente individual, puedes conocer el <a href="/servicios/entrenamiento-online">entrenamiento personalizado</a>. Ninguno sustituye tu seguimiento sanitario.',
    ],
  },
  {
    slug: 'agujetas-cansancio-debilidad-tiroides',
    title: 'Agujetas, cansancio y debilidad: entrenamiento y tiroides',
    excerpt: 'Cómo distinguir agujetas, cansancio y debilidad si tienes hipotiroidismo. Qué revisar del entrenamiento y qué señales requieren consulta sanitaria.',
    introduction: '¿Son agujetas, cansancio o debilidad? Aunque pueden aparecer juntos, no significan lo mismo ni permiten saber por sí solos si la tiroides está desajustada. Aquí encontrarás qué observar del entrenamiento y cuándo conviene consultar en lugar de atribuirlo todo al esfuerzo.',
    heading: 'Antes de añadir más entrenamiento, entiende tu punto de partida',
    paragraphs: [
      'Para ampliar el contexto, lee la guía de <a href="/blog/cansancio-e-hipotiroidismo">cansancio e hipotiroidismo</a> y la de <a href="/hipotiroidismo/ejercicio">ejercicio con hipotiroidismo</a>. Estas lecturas no sustituyen una valoración sanitaria si hay síntomas nuevos, persistentes o progresivos.',
      'Cuando lo que necesitas es organizar y revisar tu entrenamiento, puedes conocer <a href="/metodo-tiroides">Método BASE Tiroides</a> o el <a href="/servicios/entrenamiento-online">acompañamiento individual</a>. Revisa el alcance de cada formato antes de solicitarlo. Fernando te escribe por WhatsApp para acordar una videollamada; no se interpretan analíticas ni se modifica medicación.',
    ],
  },
  {
    slug: 'por-que-no-adelgazo-con-hipotiroidismo',
    title: '¿Por qué no adelgazo con hipotiroidismo? Qué revisar',
    excerpt: 'Si tienes hipotiroidismo y el peso no baja, revisa siete factores: tendencia del peso, alimentación, movimiento, fuerza, descanso y contexto clínico.',
    introduction: 'Si tienes hipotiroidismo y no adelgazas, antes de comer menos o añadir más cardio conviene revisar tres cosas: el seguimiento de tu tratamiento, si existe un estancamiento real y cómo encajan alimentación, actividad y recuperación en tu semana. Esta guía recorre siete factores sin prometer una pérdida de peso concreta.',
    heading: 'Del estancamiento a un proceso que puedas revisar',
    paragraphs: [
      'Para ordenar las ideas, consulta la guía de <a href="/hipotiroidismo/perder-peso">pérdida de peso con hipotiroidismo</a>. Si necesitas una referencia para registrar más que el peso, revisa <a href="/blog/bascula-te-miente-medir-progreso-real">cómo medir tu progreso</a>.',
      'Si buscas estructura y seguimiento para entrenar, conoce <a href="/metodo-tiroides">Método BASE Tiroides: alcance, precio y solicitud de plaza</a>. Para programación completamente individual, revisa el <a href="/servicios/entrenamiento-online">entrenamiento personalizado</a>. Son servicios de entrenamiento y hábitos, sin dieta clínica, tratamiento tiroideo ni resultados de peso garantizados.',
    ],
  },
]

function editContent(content, change) {
  if (!/^\s*<p>/.test(content) || content.includes('data-editorial="captacion-20261103"')) throw new Error(`[SEO:prepare] Apertura inesperada o actualización ya aplicada: ${change.slug}`)
  const opening = content.replace(/^\s*<p>[\s\S]*?<\/p>/, `<p>${change.introduction}</p>`)
  return `${opening.trim()}\n<section data-editorial="captacion-20261103">\n<h2>${change.heading}</h2>\n${change.paragraphs.map(text => `<p>${text}</p>`).join('\n')}\n</section>\n`
}

if (process.argv.includes('--apply')) {
  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'))
  if (preview.length !== changes.length || new Set(preview.map(item => item.before.slug)).size !== changes.length) throw new Error('[SEO:apply] Vista previa incompleta')
  const receipt = []
  for (const item of preview) {
    const change = changes.find(change => change.slug === item.before.slug)
    if (!change || item.after.title !== change.title || item.after.excerpt !== change.excerpt || item.after.content !== editContent(item.before.content, change)) throw new Error('[SEO:apply] La vista previa no coincide con los cambios editoriales')
    const { data, error } = await db.from('posts').update({ ...item.after, updated_at: new Date().toISOString() }).eq('id', item.before.id).eq('published', true).eq('updated_at', item.before.updated_at).select('slug,updated_at,title,excerpt').single()
    if (error) throw new Error(`[SEO:apply] ${item.before.slug}: no actualizado; comprueba cambios concurrentes. ${error.message}`)
    receipt.push(data)
    fs.writeFileSync(path.join(output, 'article-refresh-receipt.json'), JSON.stringify(receipt, null, 2))
    console.log(`[SEO:apply] ${data.slug}: actualizado`)
  }
} else {
  const { data, error } = await db.from('posts').select('id,slug,title,excerpt,content,updated_at,published,published_at,main_image_url').in('slug', changes.map(change => change.slug))
  if (error || data?.length !== changes.length || data.some(post => !post.published)) throw new Error('[SEO:prepare] No se encontraron los tres artículos publicados')
  fs.mkdirSync(output, { recursive: true })
  if (fs.existsSync(previewPath)) throw new Error('[SEO:prepare] Ya existe una vista previa; consérvala como copia antes de generar otra')
  const preview = changes.map(change => {
    const before = data.find(post => post.slug === change.slug)
    return { before, after: { title: change.title, excerpt: change.excerpt, content: editContent(before.content, change) } }
  })
  fs.writeFileSync(previewPath, JSON.stringify(preview, null, 2))
  for (const item of preview) {
    fs.writeFileSync(path.join(output, `${item.before.slug}.html`), `<!doctype html><html lang="es"><meta charset="utf-8"><title>${item.after.title}</title><body><main><h1>${item.after.title}</h1><p>${item.after.excerpt}</p>${item.after.content}</main></body></html>`)
    console.log(`[SEO:preview] ${item.before.slug}: ${item.after.title}`)
  }
  console.log('[SEO:preview] Sin escrituras en base de datos. Revisa output/seo-leads-20261103 antes de --apply.')
}
