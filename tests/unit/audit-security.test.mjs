import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as zod from 'zod'

function load(file, dependencies, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports: module.exports, require: name => dependencies[name] ?? {}, console: { error() {} }, crypto, Date, Response, ...globals })
  return module.exports
}

function access({ admin = false, email = null, paid = true } = {}) {
  let queries = 0
  const query = { select() { return this }, ilike() { return this }, eq() { return this }, limit() { return this }, async maybeSingle() { return { data: paid ? { id: 'paid-application' } : null, error: null } } }
  const api = load('src/lib/program-generation-access.ts', {
    '@/lib/auth': { isAdminAuthenticated: async () => admin },
    '@/lib/supabase-env': { supabaseConfigStatus: () => ({ ok: true }) },
    '@/lib/supabase-ssr': { createServerSupabase: async () => ({ auth: { getUser: async () => ({ data: { user: email ? { email } : null }, error: null }) } }) },
    '@/lib/supabase': { supabase: { from() { queries++; return query } } },
  })
  return { api, queries: () => queries }
}

test('ningún origen controlado por el solicitante evita la autenticación', async () => {
  for (const origin of ['general', 'metodo-tiroides', 'admin-tiroides']) {
    const { api, queries } = access()
    const result = await api.authorizeProgramGeneration('other@example.com', origin)
    assert.equal(result.allowed, false)
    assert.equal(result.status, 401)
    assert.equal(queries(), 0)
  }
})

test('una sesión de A no permite consultar el pago de B', async () => {
  const { api, queries } = access({ email: 'a@example.com' })
  const result = await api.authorizeProgramGeneration('b@example.com', 'metodo-tiroides')
  assert.equal(result.status, 403)
  assert.equal(queries(), 0)
})

test('el propietario autenticado necesita además un pago confirmado', async () => {
  const denied = await access({ email: 'a@example.com', paid: false }).api.authorizeProgramGeneration('a@example.com', 'metodo-tiroides')
  assert.equal(denied.status, 403)
  const allowed = await access({ email: 'a@example.com' }).api.authorizeProgramGeneration('a@example.com', 'metodo-tiroides')
  assert.equal(allowed.allowed, true)
  assert.equal(allowed.applicationId, 'paid-application')
})

test('una sesión administrativa autoriza el flujo interno sin depender del cuerpo', async () => {
  const { api, queries } = access({ admin: true })
  assert.equal((await api.authorizeProgramGeneration('a@example.com', 'admin-tiroides')).admin, true)
  assert.equal(queries(), 0)
})

test('la reserva atómica solo permite una generación concurrente y conserva notas de pago', async () => {
  const state = { notes: '[payment:one_time]' }
  const supabase = { from() {
    let next, condition
    const query = {
      select() { return this },
      eq(field, value) { if (field === 'notas') condition = value; return this },
      is(field, value) { if (field === 'notas') condition = value; return this },
      update(patch) { next = patch.notas; return this },
      async single() { return { data: { notas: state.notes }, error: null } },
      async maybeSingle() {
        if (condition !== state.notes) return { data: null, error: null }
        state.notes = next
        return { data: { id: 'paid' }, error: null }
      },
      then(resolve) { if (condition === state.notes) state.notes = next; return Promise.resolve({ error: null }).then(resolve) },
    }
    return query
  } }
  const { claimProgramGeneration } = load('src/lib/program-generation-access.ts', { '@/lib/supabase': { supabase } })
  const claims = await Promise.all([claimProgramGeneration('paid'), claimProgramGeneration('paid')])
  assert.equal(claims.filter(Boolean).length, 1)
  assert.match(state.notes, /payment:one_time/)
  await claims.find(Boolean)()
  assert.equal(state.notes, '[payment:one_time]')
  assert.equal(typeof await claimProgramGeneration('paid'), 'function')
})

test('contacto valida en servidor y escapa HTML antes de enviar', async () => {
  let saved = 0, email
  const { POST } = load('src/app/api/contact/route.ts', {
    'next/server': { NextResponse: Response }, zod,
    '@/lib/rateLimit': { getClientIp: () => 'test', rateLimit: () => ({ success: true }) },
    '@/lib/leadCapture': { captureLead: async () => { saved++ } },
    '@/lib/email': { sendEmail: async value => { email = value } },
    '@/lib/utils/escapeHtml': { escapeHtml: value => value.replaceAll('<', '&lt;').replaceAll('>', '&gt;'), sanitizeHeader: value => value.replace(/[\r\n]/g, '') },
  })
  assert.equal((await POST({ json: async () => ({ name: {}, email: 'bad' }) })).status, 400)
  assert.equal(saved, 0)
  const valid = { name: '<b>Prueba</b>', email: 'test@example.com', phone: '600000000', subject: 'Consulta de prueba', message: '<a href="phishing">No insertar enlaces arbitrarios</a>' }
  assert.equal((await POST({ json: async () => valid })).status, 200)
  assert.equal(saved, 1)
  assert.ok(!email.html.includes('<b>Prueba</b>'))
  assert.ok(!email.html.includes('<a href="phishing">'))
})
