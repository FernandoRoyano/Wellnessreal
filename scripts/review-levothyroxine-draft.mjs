import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import matter from 'gray-matter'
import { marked } from 'marked'
import readingTime from 'reading-time'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
// Solo permite revisar los dos borradores previstos; nunca modifica su publicación.
const drafts = {
  'levotiroxina-y-ejercicio': 'output/levothyroxine-review-20261105',
  'hipotiroidismo-y-colesterol': 'output/cholesterol-review-20261105',
}
const slug = process.argv.find(value => value.startsWith('--slug='))?.slice(7) ?? 'levotiroxina-y-ejercicio'
if (!Object.hasOwn(drafts, slug)) throw new Error('[DraftReview:prepare] Borrador fuera del alcance autorizado')
const output = path.join(root, drafts[slug])
const backupPath = path.join(output, 'before.json')
const previewPath = path.join(output, 'preview.json')
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function readEditorial() {
  const source = fs.readFileSync(path.join(root, `content/blog/${slug}.md`), 'utf8')
  const { data, content } = matter(source)
  if (data.slug !== slug || data.author !== 'Fernando Royano' || !data.title || data.title.length > 60 || !data.excerpt || data.excerpt.length > 160 || !data.imagen_alt) throw new Error('[Levothyroxine:prepare] Metadatos inesperados')
  const html = marked.parse(content, { breaks: true, gfm: true })
  if (/<h1|<script|<iframe|<form/i.test(html)) throw new Error('[Levothyroxine:prepare] Elementos no previstos')
  for (const required of ['https://cima.aemps.es/', '/hipotiroidismo/ejercicio', '/hashimoto/entrenamiento', '/comunidad/entrar', '/metodo-tiroides']) {
    if (!html.includes(required)) throw new Error(`[Levothyroxine:prepare] Falta contenido: ${required}`)
  }
  return {
    sourceHash: createHash('sha256').update(source).digest('hex'),
    title: data.title,
    updates: { title: data.title, excerpt: data.excerpt, content: html, main_image_alt: data.imagen_alt, read_time: `${Math.max(1, Math.ceil(readingTime(content).minutes))} min de lectura` },
  }
}

const editorial = readEditorial()
if (process.argv.includes('--apply')) {
  const { post: before } = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'))
  if (before.slug !== slug || before.published !== false || before.author !== 'Fernando Royano' || preview.id !== before.id || preview.sourceHash !== editorial.sourceHash || JSON.stringify(preview.updates) !== JSON.stringify(editorial.updates)) throw new Error('[Levothyroxine:apply] Copia o vista previa no coincidente')
  const { data: current, error: readError } = await db.from('posts').select('*').eq('id', before.id).eq('slug', slug).single()
  if (readError || !current || current.published !== false) throw new Error('[Levothyroxine:apply] El artículo ya no es el borrador esperado')
  const protectedKeys = Object.keys(before).filter(key => ![...Object.keys(editorial.updates), 'updated_at'].includes(key))
  if (protectedKeys.some(key => JSON.stringify(current[key]) !== JSON.stringify(before[key]))) throw new Error('[Levothyroxine:apply] Metadatos protegidos modificados')
  if (Object.entries(editorial.updates).every(([key, value]) => current[key] === value)) {
    console.log('[Levothyroxine:apply] Borrador ya actualizado; sin escrituras')
  } else {
    if (JSON.stringify(current) !== JSON.stringify(before)) throw new Error('[Levothyroxine:apply] Borrador modificado desde la copia')
    const { error } = await db.from('posts').update({ ...editorial.updates, updated_at: new Date().toISOString() }).eq('id', before.id).eq('slug', slug).eq('published', false).eq('updated_at', before.updated_at).select('id').single()
    if (error) throw new Error('[Levothyroxine:apply] Conflicto o fallo al guardar')
  }
  const { data: after, error } = await db.from('posts').select('*').eq('id', before.id).eq('slug', slug).single()
  if (error || !after || protectedKeys.some(key => JSON.stringify(after[key]) !== JSON.stringify(before[key])) || Object.entries(editorial.updates).some(([key, value]) => after[key] !== value)) throw new Error('[Levothyroxine:verify] La lectura posterior no coincide')
  fs.writeFileSync(path.join(output, 'receipt.json'), JSON.stringify({ slug, published: after.published, published_at: after.published_at, updated_at: after.updated_at, sourceHash: editorial.sourceHash }, null, 2))
  console.log(`[Levothyroxine:verify] ${slug}: borrador actualizado; publicación, fecha, portada, autor y categoría conservados`)
} else {
  fs.mkdirSync(output, { recursive: true })
  if (!fs.existsSync(backupPath)) {
    const { data: post, error } = await db.from('posts').select('*').eq('slug', slug).single()
    if (error || !post || post.published !== false) throw new Error('[Levothyroxine:prepare] Borrador no disponible')
    fs.writeFileSync(backupPath, JSON.stringify({ post }, null, 2), { flag: 'wx' })
  }
  const { post } = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  if (post.slug !== slug || post.published !== false || post.author !== 'Fernando Royano') throw new Error('[Levothyroxine:prepare] Identidad inesperada')
  fs.writeFileSync(previewPath, JSON.stringify({ id: post.id, ...editorial }, null, 2), { flag: 'wx' })
  fs.writeFileSync(path.join(output, 'preview.html'), editorial.updates.content, { flag: 'wx' })
  console.log(`[Levothyroxine:prepare] ${editorial.updates.read_time}; descripción: ${editorial.updates.excerpt.length} caracteres; sin escrituras en la base de datos`)
}
