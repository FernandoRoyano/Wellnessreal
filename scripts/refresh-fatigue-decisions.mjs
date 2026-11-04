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
const output = path.join(root, 'output/fatigue-decisions-20261104')
const backupPath = path.join(output, 'before.json')
const previewPath = path.join(output, 'preview.json')
const slugs = ['cansancio-e-hipotiroidismo', 'agujetas-cansancio-debilidad-tiroides']
const protectedFields = ['id', 'slug', 'title', 'author', 'published', 'published_at', 'main_image_url', 'main_image_alt', 'category_id', 'created_at']
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function readEditorial(before) {
  const source = fs.readFileSync(path.join(root, `content/blog/${before.slug}.md`), 'utf8')
  const { content, data } = matter(source)
  if ((data.title ?? data.titulo) !== before.title) throw new Error(`[Fatigue:prepare] Título inesperado: ${before.slug}`)
  let rendered = marked.parse(content, { breaks: true, gfm: true }).replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
  for (const match of before.content.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const publicUrl = match[1]
    rendered = rendered.replaceAll(`/blog/${new URL(publicUrl).pathname.split('/').at(-1)}`, publicUrl)
  }
  const markerHeading = before.slug === slugs[0] ? '¿Hoy mantengo, reduzco o consulto?' : 'Un ejemplo para ajustar la siguiente sesión'
  rendered = rendered.replace(`<h2>${markerHeading}</h2>`, `<h2 data-editorial="fatiga-20261104">${markerHeading}</h2>`)
  rendered = rendered.replace('<h2>Antes de añadir más entrenamiento, entiende tu punto de partida</h2>', '<h2 data-editorial="captacion-20261103">Antes de añadir más entrenamiento, entiende tu punto de partida</h2>')
  const excerpt = data.excerpt ?? data.meta_descripcion
  if (!excerpt || excerpt.length > 160 || !rendered.includes('data-editorial="fatiga-20261104"')) throw new Error(`[Fatigue:prepare] Contenido o descripción inesperados: ${before.slug}`)
  if (!rendered.includes('/hashimoto/entrenamiento') || !rendered.includes('/comunidad/entrar')) throw new Error(`[Fatigue:prepare] Faltan los enlaces de continuidad: ${before.slug}`)
  for (const match of before.content.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    if (!rendered.includes(`src="${match[1]}"`)) throw new Error(`[Fatigue:prepare] Se perdería una imagen: ${before.slug}`)
  }
  return { sourceHash: createHash('sha256').update(source).digest('hex'), after: { content: rendered, excerpt, read_time: `${Math.max(1, Math.ceil(readingTime(content).minutes))} min de lectura` } }
}

function assertScope(posts) {
  if (posts.length !== slugs.length || new Set(posts.map(post => post.slug)).size !== slugs.length || posts.some(post => !slugs.includes(post.slug) || !post.published)) throw new Error('[Fatigue:scope] Se requieren exactamente los dos artículos publicados previstos')
}

if (process.argv.includes('--apply')) {
  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'))
  const before = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  assertScope(before)
  assertScope(preview.map(item => item.before))
  const receipt = []
  for (const item of preview) {
    if (JSON.stringify(before.find(post => post.slug === item.before.slug)) !== JSON.stringify(item.before) || JSON.stringify(readEditorial(item.before)) !== JSON.stringify({ sourceHash: item.sourceHash, after: item.after })) throw new Error(`[Fatigue:apply] La copia o el material editorial han cambiado: ${item.before.slug}`)
    const { data: current, error: readError } = await db.from('posts').select('*').eq('id', item.before.id).single()
    if (readError || protectedFields.some(field => current[field] !== item.before[field])) throw new Error(`[Fatigue:apply] Metadatos modificados; no se publica: ${item.before.slug}`)
    if (Object.entries(item.after).every(([field, value]) => current[field] === value)) {
      console.log(`[Fatigue:apply] ${item.before.slug}: ya publicado, sin escrituras`)
      continue
    }
    if (current.updated_at !== item.before.updated_at || current.content !== item.before.content || current.excerpt !== item.before.excerpt || current.read_time !== item.before.read_time) throw new Error(`[Fatigue:apply] Conflicto concurrente: ${item.before.slug}`)
    const { data, error } = await db.from('posts').update({ ...item.after, updated_at: new Date().toISOString() }).eq('id', item.before.id).eq('slug', item.before.slug).eq('published', true).eq('updated_at', item.before.updated_at).select('*').single()
    if (error || !data) throw new Error(`[Fatigue:apply] No se pudo actualizar: ${item.before.slug}`)
    if (protectedFields.some(field => data[field] !== item.before[field]) || Object.entries(item.after).some(([field, value]) => data[field] !== value)) throw new Error(`[Fatigue:apply] La verificación posterior no coincide: ${item.before.slug}`)
    receipt.push({ slug: data.slug, updated_at: data.updated_at, sourceHash: item.sourceHash })
    fs.writeFileSync(path.join(output, `receipt-${data.slug}.json`), JSON.stringify(receipt.at(-1), null, 2))
    console.log(`[Fatigue:apply] ${data.slug}: actualizado; fecha de publicación y metadatos protegidos conservados`)
  }
} else {
  fs.mkdirSync(output, { recursive: true })
  if (fs.existsSync(previewPath)) throw new Error('[Fatigue:prepare] La vista previa ya existe; no se sobrescribe')
  let before
  if (fs.existsSync(backupPath)) before = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  else {
    const { data, error } = await db.from('posts').select('*').in('slug', slugs)
    if (error) throw new Error('[Fatigue:prepare] No se pudo leer el contenido publicado')
    before = data
    assertScope(before)
    fs.writeFileSync(backupPath, JSON.stringify(before, null, 2), { flag: 'wx' })
  }
  assertScope(before)
  const preview = before.map(post => ({ before: post, ...readEditorial(post) }))
  fs.writeFileSync(previewPath, JSON.stringify(preview, null, 2), { flag: 'wx' })
  for (const item of preview) {
    fs.writeFileSync(path.join(output, `${item.before.slug}-after.html`), item.after.content, { flag: 'wx' })
    console.log(`[Fatigue:prepare] ${item.before.slug}: ${item.after.read_time}; sin escrituras en base de datos`)
  }
}
