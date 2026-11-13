import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const [directory, mode] = process.argv.slice(2)
if (!directory) throw new Error('[Science:apply] Falta el directorio de respaldo')
const backup = JSON.parse(readFileSync(`${directory}/posts-backup.json`, 'utf8').replace(/^\uFEFF/, ''))
const updates = JSON.parse(readFileSync(`${directory}/posts-updates.json`, 'utf8').replace(/^\uFEFF/, ''))
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const hash = value => createHash('sha256').update(value).digest('hex')
const { data: current, error } = await db.from('posts').select('*').in('slug', updates.map(update => update.slug))
if (error) throw new Error(`[Science:preflight] ${error.message}`)
assert.equal(current.length, updates.length)
for (const update of updates) {
  const before = backup.find(post => post.id === update.id)
  const live = current.find(post => post.id === update.id)
  assert(before && live, update.slug)
  assert.equal(live.content, before.content, `${update.slug}: el contenido ha cambiado`)
  assert.equal(live.updated_at, update.expected_updated_at, `${update.slug}: versión diferente`)
  assert.equal(live.published, true, `${update.slug}: no está publicado`)
  assert(update.fields.content.includes('13 de noviembre de 2026'))
  assert(!update.fields.content.includes('\uFFFD'))
  assert.equal((update.fields.content.match(/<h1\b/gi) ?? []).length, 0)
  const oldImages = [...before.content.matchAll(/<img\b[^>]*>/g)].map(match => match[0])
  const newImages = [...update.fields.content.matchAll(/<img\b[^>]*>/g)].map(match => match[0])
  assert.deepEqual(newImages, oldImages, `${update.slug}: las imágenes han cambiado`)
}
if (mode !== '--apply') {
  console.log(`Preflight correcto: ${updates.length} artículos. No se ha escrito en la base de datos.`)
} else {
  const receipt = []
  for (const update of updates) {
    const { data, error: writeError } = await db.from('posts').update(update.fields).eq('id', update.id).eq('updated_at', update.expected_updated_at).select('*').maybeSingle()
    if (writeError || !data) throw new Error(`[Science:apply] ${update.slug}: ${writeError?.message ?? 'conflicto de versión'}`)
    const before = backup.find(post => post.id === update.id)
    assert.equal(data.content, update.fields.content)
    for (const key of Object.keys(before).filter(key => !['content', 'updated_at'].includes(key))) assert.deepEqual(data[key], before[key], `${update.slug}: cambió ${key}`)
    receipt.push({ slug: update.slug, before_updated_at: update.expected_updated_at, updated_at: data.updated_at, content_sha256: hash(data.content), publication_preserved: true })
    writeFileSync(`${directory}/publish-receipt.json`, JSON.stringify(receipt, null, 2))
  }
  console.log(`Publicados y releídos ${receipt.length} artículos; fechas, URLs, metadatos e imágenes conservados.`)
}
