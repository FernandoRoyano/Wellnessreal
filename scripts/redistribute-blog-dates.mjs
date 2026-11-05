import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
const schedule = {
  'ganar-masa-muscular-con-hipotiroidismo': '2026-10-22T07:00:00.000Z',
  'hipotiroidismo-y-colesterol': '2026-10-29T08:00:00.000Z',
}
const output = path.join(root, 'output/blog-dates-20261105')
const planPath = path.join(output, 'plan.json')
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const sameDate = (a, b) => Date.parse(a) === Date.parse(b)
const protectedKeys = post => Object.keys(post).filter(key => !['published_at', 'updated_at'].includes(key))
const matches = (a, b, keys) => keys.every(key => JSON.stringify(a[key]) === JSON.stringify(b[key]))

function sourceHash(slug) {
  const source = fs.readFileSync(path.join(root, `content/blog/${slug}.md`), 'utf8')
  if (!sameDate(matter(source).data.fecha, schedule[slug])) throw new Error(`[BlogDates:source] Fecha editorial distinta del reparto: ${slug}`)
  return createHash('sha256').update(source).digest('hex')
}

async function readPost(slug) {
  const { data, error } = await db.from('posts').select('*').eq('slug', slug).single()
  if (error || data?.published !== true) throw new Error(`[BlogDates:read] Artículo publicado no disponible: ${slug}`)
  return data
}

if (!process.argv.includes('--apply')) {
  fs.mkdirSync(output, { recursive: true })
  const posts = []
  for (const slug of Object.keys(schedule)) {
    const post = await readPost(slug)
    if (!post.published_at.startsWith('2026-11-05') || Date.parse(schedule[slug]) > Date.now()) throw new Error('[BlogDates:scope] Fecha original o destino inesperados')
    posts.push({ post, sourceHash: sourceHash(slug) })
  }
  fs.writeFileSync(planPath, JSON.stringify({ schedule, posts }, null, 2), { flag: 'wx' })
  console.log('[BlogDates:prepare] Dos artículos copiados; sin escrituras en la base de datos')
} else {
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'))
  if (JSON.stringify(plan.schedule) !== JSON.stringify(schedule) || JSON.stringify(plan.posts.map(entry => entry.post.slug)) !== JSON.stringify(Object.keys(schedule))) throw new Error('[BlogDates:scope] Plan fuera del alcance revisado')
  for (const { post, sourceHash: expectedHash } of plan.posts) {
    const current = await readPost(post.slug)
    if (sourceHash(post.slug) !== expectedHash || !matches(current, post, protectedKeys(post))) throw new Error('[BlogDates:preflight] Contenido o metadatos modificados desde la copia')
    if (!sameDate(current.published_at, schedule[post.slug]) && !matches(current, post, Object.keys(post))) throw new Error('[BlogDates:preflight] Conflicto de edición')
  }
  const receipts = []
  for (const { post } of plan.posts) {
    const current = await readPost(post.slug)
    if (!sameDate(current.published_at, schedule[post.slug])) {
      const { data, error } = await db.from('posts').update({ published_at: schedule[post.slug], updated_at: new Date().toISOString() })
        .eq('id', post.id).eq('slug', post.slug).eq('published', true).eq('updated_at', post.updated_at).select('id').single()
      if (error || !data) throw new Error(`[BlogDates:apply] Conflicto al ajustar la fecha: ${post.slug}`)
    }
    const after = await readPost(post.slug)
    if (!sameDate(after.published_at, schedule[post.slug]) || !matches(after, post, protectedKeys(post))) throw new Error(`[BlogDates:verify] Lectura posterior inesperada: ${post.slug}`)
    receipts.push({ slug: post.slug, before: post.published_at, published_at: after.published_at, updated_at: after.updated_at })
  }
  fs.writeFileSync(path.join(output, 'receipts.json'), JSON.stringify(receipts, null, 2))
  console.log('[BlogDates:verify] Dos fechas repartidas; artículos publicados, textos y portadas conservados')
}
