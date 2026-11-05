import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
const output = path.join(root, 'output/cover-variety-20261105')
const planPath = path.join(output, 'plan.json')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/blog/cover-variety-2026-11.json'), 'utf8'))
const expected = ['levotiroxina-y-ejercicio', 'hipotiroidismo-y-colesterol', 'peptidos-recuperacion-longevidad-evidencia', 'terapia-hormonal-antienvejecimiento', 'edad-biologica-wearables-biomarcadores', 'fuerza-longevidad-masa-muscular', 'biohacking-longevidad-que-funciona', 'cuanto-cuesta-entrenador-personal-online']
if (JSON.stringify(manifest.map(entry => entry.slug)) !== JSON.stringify(expected)) throw new Error('[Covers:scope] Selección fuera del alcance previsto')
const hash = value => createHash('sha256').update(value).digest('hex')
const manifestHash = hash(JSON.stringify(manifest))
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const protectedKeys = post => Object.keys(post).filter(key => !['main_image_url', 'main_image_alt', 'content', 'updated_at'].includes(key))

async function readPost(slug) {
  const { data, error } = await db.from('posts').select('*').eq('slug', slug).single()
  if (error || !data || data.published !== true) throw new Error(`[Covers:read] Artículo publicado no disponible: ${slug}`)
  return data
}

async function checkImage(url) {
  const response = await fetch(new URL(url, 'https://wellnessreal.es'), { method: 'HEAD', signal: AbortSignal.timeout(15000) })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`[Covers:image] Imagen no disponible: ${url}`)
}

function revisedContent(post, entry) {
  const caption = `<p><em>${entry.caption}</em></p>`
  if (entry.previousCaption) {
    const previous = `<p><em>${entry.previousCaption}</em></p>`
    if (!post.content.includes(previous)) throw new Error(`[Covers:caption] Pie anterior no localizado: ${post.slug}`)
    return post.content.replace(previous, caption)
  }
  if (!post.content.includes('</p>') || post.content.includes(caption)) throw new Error(`[Covers:caption] Estructura inesperada: ${post.slug}`)
  return post.content.replace('</p>', `</p>\n${caption}`)
}

if (!process.argv.includes('--apply') && !process.argv.includes('--upload')) {
  fs.mkdirSync(output, { recursive: true })
  const { data: all, error } = await db.from('posts').select('slug,main_image_url').eq('published', true)
  if (error) throw new Error('[Covers:prepare] No se pudieron revisar las portadas existentes')
  const entries = []
  for (const entry of manifest) {
    const post = await readPost(entry.slug)
    const file = path.resolve(root, entry.file)
    if (!file.startsWith(path.join(root, 'public') + path.sep) || !file.endsWith('.webp')) throw new Error('[Covers:prepare] Archivo fuera de la biblioteca prevista')
    const bytes = fs.readFileSync(file)
    const meta = await sharp(bytes).metadata()
    if (!meta.width || !meta.height || meta.width / meta.height < 1.7 || meta.width / meta.height > 1.85 || bytes.length > 250000) throw new Error(`[Covers:prepare] Dimensiones o peso inesperados: ${entry.file}`)
    const url = entry.storageObject ? db.storage.from('media').getPublicUrl(entry.storageObject).data.publicUrl : entry.publicUrl
    if (all.some(other => other.main_image_url === url && other.slug !== entry.slug)) throw new Error(`[Covers:prepare] Portada ya utilizada por otro artículo: ${entry.slug}`)
    if (!entry.storageObject) await checkImage(url)
    entries.push({ post, assetHash: hash(bytes), updates: { main_image_url: url, main_image_alt: entry.alt, content: revisedContent(post, entry) } })
  }
  if (new Set(entries.map(entry => entry.updates.main_image_url)).size !== expected.length) throw new Error('[Covers:prepare] Hay portadas repetidas en el plan')
  fs.writeFileSync(planPath, JSON.stringify({ manifestHash, entries }, null, 2), { flag: 'wx' })
  console.log('[Covers:prepare] Ocho portadas preparadas; sin escrituras en Supabase')
} else {
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'))
  if (plan.manifestHash !== manifestHash || JSON.stringify(plan.entries.map(entry => entry.post.slug)) !== JSON.stringify(expected)) throw new Error('[Covers:plan] El plan no coincide con la selección revisada')
  for (let index = 0; index < manifest.length; index++) {
    const entry = manifest[index]
    const planned = plan.entries[index]
    const url = entry.storageObject ? db.storage.from('media').getPublicUrl(entry.storageObject).data.publicUrl : entry.publicUrl
    if (hash(fs.readFileSync(path.join(root, entry.file))) !== planned.assetHash) throw new Error('[Covers:plan] Recurso modificado desde la revisión')
    if (JSON.stringify(Object.keys(planned.updates).sort()) !== JSON.stringify(['content', 'main_image_alt', 'main_image_url']) || planned.updates.main_image_url !== url || planned.updates.main_image_alt !== entry.alt || planned.updates.content !== revisedContent(planned.post, entry)) throw new Error('[Covers:plan] Campos distintos de la revisión visual autorizada')
  }
  if (process.argv.includes('--upload')) {
    for (let index = 0; index < manifest.length; index++) {
      const entry = manifest[index]
      if (!entry.storageObject) continue
      const planned = plan.entries[index]
      const existing = await fetch(planned.updates.main_image_url, { signal: AbortSignal.timeout(15000) })
      if (existing.ok) {
        if (hash(Buffer.from(await existing.arrayBuffer())) !== planned.assetHash) throw new Error('[Covers:upload] Ya existe un archivo diferente; no se sobrescribe')
      } else {
        await existing.body?.cancel()
        if (![400, 404].includes(existing.status)) throw new Error('[Covers:upload] No se pudo comprobar el destino')
        const { error } = await db.storage.from('media').upload(entry.storageObject, fs.readFileSync(path.join(root, entry.file)), { contentType: 'image/webp', cacheControl: '31536000', upsert: false })
        if (error) throw new Error(`[Covers:upload] No se pudo subir el recurso: ${entry.slug}`)
      }
      await checkImage(planned.updates.main_image_url)
    }
    console.log(`[Covers:upload] ${manifest.filter(entry => entry.storageObject).length} recursos disponibles; artículos sin modificar`)
  } else {
    // Comprobar todos los conflictos antes de cambiar la primera portada.
    for (const { post, updates } of plan.entries) {
      const current = await readPost(post.slug)
      if (protectedKeys(post).some(key => JSON.stringify(current[key]) !== JSON.stringify(post[key]))) throw new Error('[Covers:apply] Metadatos protegidos modificados')
      const applied = Object.entries(updates).every(([key, value]) => current[key] === value)
      if (!applied && Object.keys(post).some(key => JSON.stringify(current[key]) !== JSON.stringify(post[key]))) throw new Error(`[Covers:apply] Conflicto de edición: ${post.slug}`)
      await checkImage(updates.main_image_url)
    }
    const receipts = []
    for (const { post, updates } of plan.entries) {
      const current = await readPost(post.slug)
      if (!Object.entries(updates).every(([key, value]) => current[key] === value)) {
        const { data, error } = await db.from('posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', post.id).eq('slug', post.slug).eq('published', true).eq('updated_at', post.updated_at).select('id').single()
        if (error || !data) throw new Error(`[Covers:apply] No se pudo guardar: ${post.slug}`)
      }
      const after = await readPost(post.slug)
      if (protectedKeys(post).some(key => JSON.stringify(after[key]) !== JSON.stringify(post[key])) || Object.entries(updates).some(([key, value]) => after[key] !== value)) throw new Error(`[Covers:verify] Lectura posterior inesperada: ${post.slug}`)
      receipts.push({ slug: post.slug, main_image_url: after.main_image_url, updated_at: after.updated_at })
    }
    fs.writeFileSync(path.join(output, 'receipts.json'), JSON.stringify(receipts, null, 2))
    console.log('[Covers:verify] Ocho portadas actualizadas; identidad, títulos, publicación y fechas originales conservados')
  }
}
