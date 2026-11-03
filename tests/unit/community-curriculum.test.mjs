import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { buildRevision } = require('../../content/community/revision-2026-11.cjs')
function load(file, dependencies = {}) {
  const compiled = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require: name => dependencies[name] ?? {}, Date, Buffer, console: { error() {} }, process: { env: {} } })
  return compiled.exports
}
const roadmap = load('src/lib/metodo-tiroides.ts')
const slugs = [
  ...'lee-esto-primero quien-soy como-funciona-esto tu-primera-victoria como-funciona-la-tiroides entiende-tu-analitica-tiroides hashimoto-que-es metabolismo-lento-no-roto peso-grasa-retencion cansancio-que-revisar gluten-hashimoto-sin-miedo suplementos-con-criterio por-que-empezar-con-fuerza entrenar-cuando-estas-cansada primera-rutina-fuerza organizar-dos-dias progresar-sin-agotarte que-hacer-mala-semana alimentacion-practica descanso-recuperacion empieza-aqui-programa tu-plan-y-calendario bloque-1-semanas-1-4 bloque-2-semanas-5-8 bloque-3-semanas-9-12 directos-y-revisiones recurso-planificador-semanal recurso-semaforo-energia recurso-registro-semanal'.split(' '),
  ...Array.from({ length: 12 }, (_, index) => `semana-${index + 1}`),
]
const snapshot = { spaces: ['empieza-aqui', 'aprende-tiroides', 'metodo-base-tiroides'].map(slug => ({ id: slug, slug, description: 'Before' })), lessons: [...slugs].map(slug => ({ id: `id-${slug}`, slug, space_id: 'metodo-base-tiroides', title: 'Before', content: '<p>Before</p>', cover_url: null, drip_days: 0, sort_order: 0 })) }

test('el currículo sigue las doce semanas y los cuatro bloques de la oferta, conservando los identificadores existentes', () => {
  const plan = buildRevision(snapshot, roadmap.THYROID_PROGRAM_WEEKS, roadmap.THYROID_PROGRAM_PHASES)
  for (const week of roadmap.THYROID_PROGRAM_WEEKS) {
    const update = plan.updates.find(item => item.before.slug === `semana-${week.week}`)
    assert.equal(update.patch.title, `Semana ${week.week} · ${week.title}`)
    assert.equal(update.patch.drip_days ?? update.before.drip_days, (week.week - 1) * 7)
    assert.equal(update.before.id, `id-semana-${week.week}`)
  }
  const blocks = [...plan.updates.map(item => ({ ...item.before, ...item.patch })), ...plan.creates].filter(row => row.slug?.startsWith('bloque-'))
  assert.equal(blocks.length, 4)
  assert.deepEqual(blocks.map(row => row.drip_days), [0, 21, 42, 63])
  assert.equal(plan.creates.length, 1)
  assert.ok(plan.updates.find(item => item.before.slug === 'semana-4').patch.content.includes('primera revisión'))
  assert.ok(plan.updates.find(item => item.before.slug === 'semana-9').patch.content.includes('segunda revisión'))
  assert.ok(!plan.updates.some(item => /tercera revisión/i.test(item.patch.content ?? '')))
})

test('los recursos enlazan a archivos existentes y los esquemas no sustituyen la interpretación sanitaria', () => {
  const plan = buildRevision(snapshot, roadmap.THYROID_PROGRAM_WEEKS, roadmap.THYROID_PROGRAM_PHASES)
  for (const row of [...plan.updates.map(item => item.patch), ...plan.creates]) {
    for (const match of (row.content ?? '').matchAll(/(?:src|href)="(\/(?:community|images|blog)\/[^"?#]+)/g)) assert.ok(fs.existsSync(`public${match[1]}`), match[1])
    if (row.cover_url) assert.ok(fs.existsSync(`public${row.cover_url}`), row.cover_url)
  }
  const analytics = plan.updates.find(item => item.before.slug === 'entiende-tu-analitica-tiroides').patch.content
  assert.ok(analytics.includes('no equivale, por sí sola, a un diagnóstico'))
  assert.ok(analytics.includes('https://www.thyroid.org/thyroid-function-tests/'))
})

function lessonApi(start, { role = 'member', tierAllowed = true, lessonTier = 'premium', memberCreated = '2026-01-01T00:00:00Z' } = {}) {
  const rows = [
    { id: 'intro', slug: 'empieza-aqui-programa', access_tier: lessonTier, published: true, drip_days: 0 },
    { id: 'week-1', slug: 'semana-1', access_tier: lessonTier, published: true, drip_days: 0 },
    { id: 'week-2', slug: 'semana-2', access_tier: lessonTier, published: true, drip_days: 7 },
  ]
  const supabase = { from(table) {
    return { select() { return this }, eq() { return this }, ilike() { return this }, order() { return this }, limit() { return this },
      async maybeSingle() { return { data: { id: 'client', acceso_manual: tierAllowed } } },
      then(resolve) { return Promise.resolve({ data: table === 'lessons' ? rows : [], error: null }).then(resolve) } }
  } }
  const api = load('src/lib/db/comunidad.ts', { '@/lib/supabase': { supabase }, '@/lib/thyroid-program-progress': { getThyroidProgramProgress: async () => ({ startedAt: start }) } })
  return { read: () => api.getLessons('space', { id: 'member', email: 'test@example.com', status: 'approved', role, cliente_id: 'client', creado_en: memberCreated }) }
}

test('una antigüedad en la comunidad no desbloquea por adelantado las semanas del programa', async () => {
  const before = await lessonApi(null).read()
  assert.equal(before[0].locked, false)
  assert.equal(before[1].lockReason, 'approval')
  assert.equal(before[2].lockReason, 'approval')
  const today = new Date(Date.now() - 60_000).toISOString()
  const active = await lessonApi(today).read()
  assert.equal(active[1].locked, false)
  assert.equal(active[2].locked, true)
  assert.equal(active[2].daysUntilUnlock, 7)
  const old = await lessonApi(new Date(Date.now() - 8 * 86_400_000).toISOString()).read()
  assert.equal(old[2].locked, false)
})

test('el contenido gratuito conserva su desbloqueo por registro y el equipo conserva su previsualización', async () => {
  const free = await lessonApi(null, { lessonTier: 'free', memberCreated: new Date(Date.now() - 60_000).toISOString() }).read()
  assert.equal(free[2].lockReason, 'drip')
  const staff = await lessonApi(null, { role: 'admin' }).read()
  assert.equal(staff.every(lesson => !lesson.locked), true)
  const unpaid = await lessonApi(null, { tierAllowed: false }).read()
  assert.equal(unpaid.every(lesson => lesson.lockReason === 'tier'), true)
})

test('los enlaces guardados de los bloques antiguos llevan al bloque corregido después de autorizar el espacio', async () => {
  const { default: Page } = load('src/app/(comunidad)/comunidad/[space]/[slug]/page.tsx', {
    'next/navigation': { notFound: () => { throw new Error('Not found') }, permanentRedirect: path => { throw new Error(path) } },
    '@/lib/db/comunidad': { getSessionMember: async () => ({ id: 'member' }), getSpace: async () => ({ id: 'space' }), getLessons: async () => [{ slug: 'bloque-2-semanas-4-6' }] },
  })
  await assert.rejects(Page({ params: Promise.resolve({ space: 'metodo-base-tiroides', slug: 'bloque-2-semanas-5-8' }) }), /\/comunidad\/metodo-base-tiroides\/bloque-2-semanas-4-6/)
})
