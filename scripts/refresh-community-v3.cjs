const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { createClient } = require('@supabase/supabase-js')
const { buildRevision } = require('../content/community/revision-2026-11.cjs')

const planPath = 'tmp/community-revision-plan.json'
const snapshotPath = 'tmp/community-audit-2026-11-03.json'
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const matches = (row, values) => row && Object.entries(values).every(([key, value]) => equal(row[key], value))
const originalValues = change => Object.fromEntries(Object.keys(change.patch).map(key => [key, change.before[key]]))
function assertAssets(plan) {
  for (const row of [...plan.updates.map(change => ({ ...change.before, ...change.patch })), ...plan.creates]) {
    const assets = [row.cover_url, ...[...(row.content ?? '').matchAll(/(?:src|href)="(\/(?:community|images|blog)\/[^"?#]+)/g)].map(match => match[1])]
    for (const asset of assets.filter(Boolean)) if (!fs.existsSync(path.join('public', asset))) throw new Error(`[CommunityRevision:asset] Falta ${asset}`)
  }
}
function client() {
  const env = require('dotenv').parse(fs.readFileSync('.env.local'))
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
}
async function main() {
  if (!process.argv.includes('--apply')) {
    const compiled = { exports: {} }
    const code = ts.transpileModule(fs.readFileSync('src/lib/metodo-tiroides.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
    vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require, process })
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
    const plan = buildRevision(snapshot, compiled.exports.THYROID_PROGRAM_WEEKS, compiled.exports.THYROID_PROGRAM_PHASES)
    assertAssets(plan)
    fs.writeFileSync(planPath, JSON.stringify(plan, null, 2))
    const preview = structuredClone(snapshot)
    for (const change of plan.updates) Object.assign(preview.lessons.find(row => row.id === change.before.id), change.patch)
    preview.lessons.push(...plan.creates)
    for (const change of plan.spaceUpdates) Object.assign(preview.spaces.find(row => row.id === change.before.id), change.patch)
    fs.writeFileSync('tmp/community-preview-data.json', JSON.stringify(preview, null, 2))
    console.log(JSON.stringify({ mode: 'preview', lessonUpdates: plan.updates.length, lessonCreates: plan.creates.length, spaceUpdates: plan.spaceUpdates.length, planPath }))
    return
  }
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'))
  assertAssets(plan)
  const db = client()
  const [{ data: lessons, error }, { data: spaces, error: spacesError }] = await Promise.all([db.from('lessons').select('*'), db.from('spaces').select('*')])
  if (error || spacesError) throw new Error('[CommunityRevision:preflight] No se pudo consultar el estado actual')
  for (const [table, rows, changes] of [['lessons', lessons, plan.updates], ['spaces', spaces, plan.spaceUpdates]]) {
    for (const change of changes) {
      const current = rows.find(row => row.id === change.before.id)
      if (!matches(current, change.patch) && !matches(current, originalValues(change))) throw new Error(`[CommunityRevision:conflict] Revisar cambios concurrentes en ${table}/${change.before.id}`)
    }
  }
  for (const row of plan.creates) {
    const current = lessons.find(item => item.id === row.id || item.space_id === row.space_id && item.slug === row.slug)
    if (current && !matches(current, row)) throw new Error('[CommunityRevision:conflict] La nueva lección ya existe con otro contenido')
  }
  const backup = `tmp/community-before-apply-${Date.now()}.json`
  fs.writeFileSync(backup, JSON.stringify({ spaces, lessons }, null, 2))
  let updated = 0
  for (const [table, rows, changes] of [['lessons', lessons, plan.updates], ['spaces', spaces, plan.spaceUpdates]]) {
    for (const change of changes) {
      if (matches(rows.find(row => row.id === change.before.id), change.patch)) continue
      let query = db.from(table).update(change.patch).eq('id', change.before.id)
      for (const [key, value] of Object.entries(originalValues(change))) query = value === null ? query.is(key, null) : query.eq(key, value)
      const { data, error: updateError } = await query.select('id').maybeSingle()
      if (updateError || !data) throw new Error(`[CommunityRevision:update] No se pudo aplicar ${change.before.id}; reintentar con el mismo plan`)
      updated += 1
    }
  }
  let created = 0
  for (const row of plan.creates) {
    if (lessons.some(item => item.id === row.id)) continue
    const { error: insertError } = await db.from('lessons').insert(row)
    if (insertError) throw new Error('[CommunityRevision:insert] No se pudo añadir el cuarto bloque')
    created += 1
  }
  console.log(JSON.stringify({ mode: 'applied', updated, created, backup }))
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
