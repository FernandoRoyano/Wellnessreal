import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
const reviews = {
  'levotiroxina-y-ejercicio': 'output/levothyroxine-review-20261105',
  'hipotiroidismo-y-colesterol': 'output/cholesterol-review-20261105',
}
const output = path.join(root, 'output/thyroid-publication-20261105')
const planPath = path.join(output, 'plan.json')
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function readPost(slug) {
  const { data, error } = await db.from('posts').select('*').eq('slug', slug).single()
  if (error || !data) throw new Error(`[ThyroidPublish:read] Artículo no disponible: ${slug}`)
  return data
}

function assertReviewed(post) {
  const review = JSON.parse(fs.readFileSync(path.join(root, reviews[post.slug], 'preview.json'), 'utf8'))
  const source = fs.readFileSync(path.join(root, `content/blog/${post.slug}.md`), 'utf8')
  if (review.id !== post.id || post.author !== 'Fernando Royano' || createHash('sha256').update(source).digest('hex') !== review.sourceHash || Object.entries(review.updates).some(([key, value]) => post[key] !== value)) throw new Error(`[ThyroidPublish:review] La versión no coincide con la revisión: ${post.slug}`)
  return review.sourceHash
}

async function assertImage(post) {
  const response = await fetch(new URL(post.main_image_url, 'https://wellnessreal.es'), { method: 'HEAD', signal: AbortSignal.timeout(15000) })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`[ThyroidPublish:image] Portada no disponible: ${post.slug}`)
}

if (!process.argv.includes('--apply')) {
  fs.mkdirSync(output, { recursive: true })
  const posts = []
  for (const slug of Object.keys(reviews)) {
    const post = await readPost(slug)
    if (post.published !== false) throw new Error(`[ThyroidPublish:prepare] No es un borrador: ${slug}`)
    const sourceHash = assertReviewed(post)
    await assertImage(post)
    posts.push({ post, sourceHash })
  }
  fs.writeFileSync(planPath, JSON.stringify({ published_at: new Date().toISOString(), posts }, null, 2), { flag: 'wx' })
  console.log('[ThyroidPublish:prepare] Dos borradores revisados y copiados; sin escrituras en la base de datos')
} else {
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'))
  if (!Number.isFinite(Date.parse(plan.published_at)) || Date.parse(plan.published_at) > Date.now() || JSON.stringify(plan.posts.map(entry => entry.post.slug)) !== JSON.stringify(Object.keys(reviews))) throw new Error('[ThyroidPublish:apply] Plan de publicación inesperado')
  // Se comprueban ambos artículos antes de efectuar la primera escritura.
  for (const entry of plan.posts) {
    const current = await readPost(entry.post.slug)
    if (assertReviewed(current) !== entry.sourceHash || entry.post.published !== false) throw new Error('[ThyroidPublish:apply] Revisión no coincidente')
    const protectedKeys = Object.keys(entry.post).filter(key => !['published', 'published_at', 'updated_at'].includes(key))
    if (protectedKeys.some(key => JSON.stringify(current[key]) !== JSON.stringify(entry.post[key]))) throw new Error('[ThyroidPublish:apply] Metadatos modificados desde la copia')
    if (current.published ? new Date(current.published_at).getTime() !== Date.parse(plan.published_at) : JSON.stringify(current) !== JSON.stringify(entry.post)) throw new Error('[ThyroidPublish:apply] El artículo ha cambiado desde la copia')
    await assertImage(current)
  }
  for (const { post, sourceHash } of plan.posts) {
    let current = await readPost(post.slug)
    if (!current.published) {
      const { data, error } = await db.from('posts').update({ published: true, published_at: plan.published_at, updated_at: new Date().toISOString() }).eq('id', post.id).eq('slug', post.slug).eq('published', false).eq('updated_at', post.updated_at).select('*').single()
      if (error || !data) throw new Error(`[ThyroidPublish:apply] Conflicto al publicar: ${post.slug}`)
    }
    current = await readPost(post.slug)
    if (current.published !== true || new Date(current.published_at).getTime() !== Date.parse(plan.published_at) || Object.keys(post).filter(key => !['published', 'published_at', 'updated_at'].includes(key)).some(key => JSON.stringify(current[key]) !== JSON.stringify(post[key])) || assertReviewed(current) !== sourceHash) throw new Error(`[ThyroidPublish:verify] Lectura posterior inesperada: ${post.slug}`)
    fs.writeFileSync(path.join(output, `${post.slug}-receipt.json`), JSON.stringify({ slug: post.slug, published: current.published, published_at: current.published_at, updated_at: current.updated_at, sourceHash }, null, 2))
    console.log(`[ThyroidPublish:verify] Publicado y verificado: ${post.slug}`)
  }
}
