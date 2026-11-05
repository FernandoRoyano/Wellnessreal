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
const slug = 'ganar-masa-muscular-con-hipotiroidismo'
const output = path.join(root, 'output/muscle-hypothyroidism-20261105')
const backupPath = path.join(output, 'before.json')
const previewPath = path.join(output, 'preview.json')
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function matchesField(key, value, expected) {
  return key === 'published_at' ? new Date(value).getTime() === new Date(expected).getTime() : value === expected
}

function saveReceipt(post, sourceHash) {
  const receiptPath = path.join(output, 'receipt.json')
  if (!fs.existsSync(receiptPath)) fs.writeFileSync(receiptPath, JSON.stringify({ id: post.id, slug: post.slug, published_at: post.published_at, updated_at: post.updated_at, sourceHash }, null, 2), { flag: 'wx' })
}

function readEditorial() {
  const source = fs.readFileSync(path.join(root, `content/blog/${slug}.md`), 'utf8')
  const { data, content } = matter(source)
  if (data.slug !== slug || data.author !== 'Fernando Royano' || !data.title || data.title.length > 60 || !data.excerpt || data.excerpt.length > 160) throw new Error('[Muscle:prepare] Identidad o metadatos editoriales inesperados')
  const image = data.imagen_destacada
  if (image !== '/community/editorial/progresion-fuerza.webp' || !fs.existsSync(path.join(root, 'public', image.slice(1)))) throw new Error('[Muscle:prepare] Recurso ilustrativo no disponible')
  const html = marked.parse(content, { breaks: true, gfm: true })
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
    .replace('<h2>Un ejemplo para organizar dos días de fuerza</h2>', '<h2 data-editorial="musculo-20261105">Un ejemplo para organizar dos días de fuerza</h2>')
  for (const required of ['/hipotiroidismo/ejercicio', '/hashimoto/entrenamiento', '/comunidad/entrar', '/metodo-tiroides', 'data-editorial="musculo-20261105"']) {
    if (!html.includes(required)) throw new Error(`[Muscle:prepare] Falta contenido previsto: ${required}`)
  }
  if (/<h1|<script|<iframe|<form/i.test(html)) throw new Error('[Muscle:prepare] Elementos no previstos en el cuerpo')
  return {
    sourceHash: createHash('sha256').update(source).digest('hex'),
    content: {
      title: data.title, excerpt: data.excerpt, content: html,
      main_image_url: image, main_image_alt: data.imagen_alt,
      read_time: `${Math.max(1, Math.ceil(readingTime(content).minutes))} min de lectura`,
    },
  }
}

if (process.argv.includes('--apply')) {
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'))
  const editorial = readEditorial()
  if (backup.post?.slug !== slug || backup.post.published !== false || preview.id !== backup.post.id || editorial.sourceHash !== preview.sourceHash || JSON.stringify(editorial.content) !== JSON.stringify(preview.content) || !preview.published_at.startsWith('2026-11-05')) throw new Error('[Muscle:apply] La copia, la vista previa o la fecha no coinciden')
  const { data: current, error: readError } = await db.from('posts').select('*').eq('id', preview.id).eq('slug', slug).single()
  if (readError || !current) throw new Error('[Muscle:apply] No se pudo comprobar el borrador')
  const updates = { ...preview.content, published: true, published_at: preview.published_at }
  const protectedKeys = Object.keys(backup.post).filter(key => ![...Object.keys(updates), 'updated_at'].includes(key))
  if (protectedKeys.some(key => JSON.stringify(current[key]) !== JSON.stringify(backup.post[key]))) throw new Error('[Muscle:apply] Metadatos protegidos modificados')
  if (current.published && Object.entries(updates).every(([key, value]) => matchesField(key, current[key], value))) {
    saveReceipt(current, preview.sourceHash)
    console.log('[Muscle:apply] Ya publicado; sin escrituras')
  } else {
    if (Object.keys(backup.post).some(key => JSON.stringify(current[key]) !== JSON.stringify(backup.post[key]))) throw new Error('[Muscle:apply] El borrador ha cambiado; no se publica')
    const image = await fetch(`https://wellnessreal.es${updates.main_image_url}`, { signal: AbortSignal.timeout(15000) })
    if (!image.ok || !image.headers.get('content-type')?.startsWith('image/')) throw new Error('[Muscle:apply] La portada aún no está disponible en producción')
    await image.body?.cancel()
    const { data, error } = await db.from('posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', preview.id).eq('slug', slug).eq('published', false).eq('updated_at', backup.post.updated_at).select('*').single()
    if (error || !data) throw new Error('[Muscle:apply] Conflicto o fallo al publicar el borrador')
    if (protectedKeys.some(key => JSON.stringify(data[key]) !== JSON.stringify(backup.post[key])) || Object.entries(updates).some(([key, value]) => !matchesField(key, data[key], value))) throw new Error('[Muscle:apply] La verificación posterior no coincide')
    saveReceipt(data, preview.sourceHash)
    console.log(`[Muscle:apply] ${slug}: publicado; identidad, autor y categoría conservados`)
  }
} else {
  fs.mkdirSync(output, { recursive: true })
  if (fs.existsSync(previewPath)) throw new Error('[Muscle:prepare] La vista previa ya existe; no se sobrescribe')
  if (!fs.existsSync(backupPath)) {
    const { data: post, error } = await db.from('posts').select('*').eq('slug', slug).single()
    if (error || !post || post.published) throw new Error('[Muscle:prepare] No se encontró el borrador previsto')
    fs.writeFileSync(backupPath, JSON.stringify({ post }, null, 2), { flag: 'wx' })
  }
  const { post } = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  if (!post || post.slug !== slug || post.published || post.author !== 'Fernando Royano') throw new Error('[Muscle:prepare] La copia no es el borrador esperado')
  const editorial = readEditorial()
  const preview = { id: post.id, ...editorial, published_at: new Date().toISOString() }
  fs.writeFileSync(previewPath, JSON.stringify(preview, null, 2), { flag: 'wx' })
  fs.writeFileSync(path.join(output, 'preview.html'), preview.content.content, { flag: 'wx' })
  console.log(`[Muscle:prepare] ${slug}: ${preview.content.read_time}; sin escrituras en base de datos`)
}
