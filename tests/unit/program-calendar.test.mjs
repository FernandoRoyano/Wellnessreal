import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { renderToStaticMarkup } from 'react-dom/server'
import * as jsxRuntime from 'react/jsx-runtime'
import * as icons from 'lucide-react'

function load(path, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const compiled = { exports: {} }
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, Date, Response,
    console: { error() {} }, require: (name) => dependencies[name] ?? {} })
  return compiled.exports
}

const calendar = load('src/lib/program-calendar.ts')
const start = '2026-11-03T10:00:00Z'
const DAY = 86_400_000

test('la semana empieza con la aprobación y avanza en los límites exactos de siete días', () => {
  assert.equal(calendar.programProgress(null).week, 0)
  assert.equal(calendar.programProgress('invalid').week, 0)
  assert.equal(calendar.programProgress(start, Date.parse(start) - 1).week, 0)
  for (const [days, week] of [[0, 1], [6, 1], [7, 2], [21, 4], [56, 9], [83, 12], [84, 12]]) {
    const progress = calendar.programProgress(start, Date.parse(start) + days * DAY)
    assert.equal(progress.week, week)
    assert.equal(progress.complete, days >= 84)
  }
})

test('crear el borrador o cobrar antes no adelanta la apertura del siguiente bloque', () => {
  const plan = { revisado: true, creado_en: '2026-10-01T10:00:00Z', revisado_en: start }
  const early = calendar.planUpdateAvailability(plan, '2026-10-01T10:00:00Z', true, Date.parse(start) + 20 * DAY)
  assert.equal(early.eligible, false)
  assert.equal(early.daysRemaining, 1)
  assert.equal(calendar.planUpdateAvailability(plan, null, true, Date.parse(start) + 21 * DAY).eligible, true)
  assert.equal(calendar.planUpdateAvailability({ ...plan, revisado: false }, null, true, Date.parse(start) + 40 * DAY).eligible, false)
  assert.equal(calendar.planUpdateAvailability({ ...plan, revisado_en: null }, null, true, Date.parse(start) + 40 * DAY).eligible, false)
})

test('el ajuste aprobado inicia su bloque sin reiniciar las doce semanas', () => {
  const updated = '2026-11-24T10:00:00Z'
  const now = Date.parse(updated) + DAY
  assert.equal(calendar.programProgress(start, now).week, 4)
  assert.equal(calendar.planUpdateAvailability({ revisado: true, revisado_en: updated }, null, true, now).daysRemaining, 20)
})

test('los programas generales conservan su ciclo anterior de cuatro semanas', () => {
  const plan = { revisado: true, creado_en: '2026-10-01T10:00:00Z', revisado_en: start }
  const progress = calendar.planUpdateAvailability(plan, '2026-10-10T10:00:00Z', false, Date.parse('2026-11-07T10:00:00Z'))
  assert.equal(progress.cycleWeeks, 4)
  assert.equal(progress.eligible, true)
})

function progressReader({ paid = true, ledgerStart, firstApproval = start, failure = false } = {}) {
  const supabase = { from(table) {
    const query = { select() { return this }, eq() { return this }, ilike() { return this },
      not() { return this }, order() { return this }, limit() { return this },
      async maybeSingle() { return { data: table === 'asesoria_solicitudes' ? paid ? { notas: 'ledger' } : null : firstApproval ? { revisado_en: firstApproval } : null, error: failure ? {} : null } } }
    return query
  } }
  return load('src/lib/thyroid-program-progress.ts', {
    '@/lib/supabase': { supabase }, '@/lib/program-calendar': calendar,
    '@/lib/thyroid-lifecycle': { readLifecycle: () => ({ startedAt: ledgerStart }) },
  }).getThyroidProgramProgress
}

test('el registro del inicio tiene prioridad y el histórico usa su primera aprobación', async () => {
  const read = progressReader({ ledgerStart: start, firstApproval: '2026-10-01T10:00:00Z' })
  assert.equal((await read('client', 'test@example.com', Date.parse(start))).week, 1)
  assert.equal((await progressReader()('client', 'test@example.com', Date.parse(start) + 7 * DAY)).week, 2)
  assert.equal((await progressReader({ firstApproval: null })('client', 'test@example.com')).week, 0)
  const manual = await progressReader({ paid: false })('client', 'test@example.com', Date.parse(start))
  assert.equal(manual.hasThyroidPayment, false)
  assert.equal(manual.week, 1)
  await assert.rejects(progressReader({ failure: true })('client', 'test@example.com'))
})

function checkinEndpoint({ available }) {
  let adjustments = 0
  const query = (table) => ({ select() { return this }, eq() { return this },
    async maybeSingle() { return { data: table === 'cliente_perfil'
      ? { id: 'client', email: 'test@example.com', acceso_manual: true, pagado_en: '2026-01-01', semana_actual: 1 }
      : { revisado: true, revisado_en: start, creado_en: '2026-01-01' } } } })
  const { POST } = load('src/app/api/checkin/route.ts', {
    'next/server': { NextResponse: Response }, '@/lib/supabase': { supabase: { from: query } },
    '@/lib/program-calendar': { planUpdateAvailability: () => ({ eligible: available, daysRemaining: 1, cycleWeeks: 3 }) },
    '@/lib/thyroid-program-progress': { getThyroidProgramProgress: async () => ({ week: 4, hasThyroidPayment: true }) },
    '@/lib/ajustar-programa': { SinPlanVigenteError: class extends Error {}, generarAjuste: async (input) => {
      assert.equal(input.semana, 4); adjustments += 1; return { version: 2 }
    } },
  })
  return { POST, adjustments: () => adjustments }
}

test('el servidor aplica la misma apertura del bloque y usa la semana real para el ajuste', async () => {
  const request = { json: async () => ({ token: 'private', respuestas: { cumplimiento: 'todos' } }) }
  const early = checkinEndpoint({ available: false })
  assert.equal((await early.POST(request)).status, 425)
  assert.equal(early.adjustments(), 0)
  const ready = checkinEndpoint({ available: true })
  assert.equal((await ready.POST(request)).status, 200)
  assert.equal(ready.adjustments(), 1)
})

async function memberPage({ week = 0, state = 'activo', complete = false, reviewed = false, hasProfile = true } = {}) {
  const profile = hasProfile ? { id: 'client', token: 'private-token', semana_actual: 1, estado_programa: state } : null
  const supabase = { from(table) {
    return { select() { return this }, eq() { return this }, ilike() { return this }, order() { return this }, limit() { return this },
      async maybeSingle() { return { data: table === 'cliente_perfil' ? profile : { revisado: reviewed } } },
      then(resolve) { return Promise.resolve({ data: [] }).then(resolve) } }
  } }
  const { default: Page } = load('src/app/(comunidad)/comunidad/metodo-base-tiroides/page.tsx', {
    'react/jsx-runtime': jsxRuntime, 'lucide-react': icons,
    'next/link': { default: ({ children, ...props }) => jsxRuntime.jsx('a', { ...props, children }) },
    'next/navigation': { redirect: (path) => { throw new Error(`Unexpected redirect ${path}`) } },
    '@/lib/db/comunidad': { getSessionMember: async () => ({ id: 'member', cliente_id: 'client', email: 'test@example.com' }), memberHasPremium: async () => true },
    '@/lib/supabase': { supabase },
    '@/lib/thyroid-program-progress': { getThyroidProgramProgress: async () => ({ week, complete, startedAt: week ? start : null }) },
    '@/lib/metodo-tiroides': { THYROID_PROGRAM_WEEKS: Array.from({ length: 12 }, (_, index) => ({ week: index + 1, title: `Week ${index + 1}`, outcome: 'Context' })) },
    '@/lib/metodo-tiroides-template': { getDefaultThyroidRoadmap: () => ({ bloques: [] }) },
  })
  return renderToStaticMarkup(await Page())
}

test('el área privada muestra espera antes de aprobar y la semana real aunque el contador guardado esté atrasado', async () => {
  const pending = await memberPage()
  assert.match(pending, />Pendiente de aprobación</)
  assert.doesNotMatch(pending, />Semana 1 de 12</)
  const active = await memberPage({ week: 7 })
  assert.match(active, />Semana 7 de 12</)
  assert.match(active, /href="\/programa\/private-token"/)
  assert.match(active, /Tu siguiente ajuste está en revisión/)
})

test('el área privada diferencia pausa, finalización y cierre del calendario', async () => {
  assert.match(await memberPage({ week: 4, state: 'pausado' }), />Programa en pausa</)
  assert.match(await memberPage({ week: 4, state: 'finalizado' }), />Programa finalizado</)
  assert.match(await memberPage({ week: 12, complete: true }), />12 semanas completadas</)
})

test('el cliente que ha pagado y todavía no tiene perfil recibe acceso a la evaluación inicial', async () => {
  const html = await memberPage({ hasProfile: false })
  assert.match(html, /Completa tu evaluación inicial/)
  assert.match(html, /href="\/cuestionario\?origen=metodo-tiroides"/)
})
