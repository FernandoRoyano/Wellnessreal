import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as zod from 'zod'

function loadModule(path, dependencies = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const compiled = { exports: {} }
  vm.runInNewContext(source, {
    module: compiled, exports: compiled.exports, Response, AbortSignal,
    console: { error() {}, log() {} }, process: { env: {} },
    crypto: { randomUUID: () => 'delivery-test' },
    setTimeout: (callback) => callback(),
    require: (name) => dependencies[name] ?? {}, ...globals,
  }, { filename: path })
  return compiled.exports
}

test('captureLead propaga el fallo de guardado y conserva su causa', async () => {
  const cause = new Error('database unavailable')
  const { captureLead } = loadModule('src/lib/leadCapture.ts', {
    '@/lib/db/leads': { upsertLead: async () => { throw cause } },
  })
  await assert.rejects(captureLead({
    request: { headers: new Headers() }, email: 'test@example.com', source: 'guia',
  }), (error) => error.cause === cause)
})

test('un fallo al buscar un contacto no se interpreta como un contacto nuevo', async () => {
  const cause = new Error('lookup failed')
  let inserts = 0
  const query = {
    select() { return query }, eq() { return query },
    maybeSingle: async () => ({ data: null, error: cause }),
    insert() { inserts += 1; return query },
  }
  const { upsertLead } = loadModule('src/lib/db/leads.ts', {
    '@/lib/supabase': { supabase: { from: () => query } },
  })
  await assert.rejects(upsertLead({ email: 'test@example.com', source: 'guia' }), (error) => error === cause)
  assert.equal(inserts, 0)
})

const payload = {
  name: 'Prueba', email: 'test@example.com', phone: '+34600000000', answers: {},
  objective: 'perder-grasa', objectiveDetail: 'Quiero organizar mi entrenamiento semanal',
  level: 'principiante', daysPerWeek: '3 días', sessionDuration: '45 min',
}

for (const route of ['newsletter', 'valoracion', 'metodo-optin', 'webinar', 'test-tiroides', 'tiroides-clase', 'tiroides-priority']) {
  function handler(save) {
    let emails = 0
    const { POST } = loadModule(`src/app/api/${route}/route.ts`, {
      'next/server': { NextResponse: Response }, zod,
      '@/lib/leadCapture': { captureLead: save },
      '@/lib/email': { sendLeadEmail: async () => { emails += 1; return false } },
      '@/lib/utils/escapeHtml': { escapeHtml: (s) => s, sanitizeHeader: (s) => s },
      '@/lib/rateLimit': { getClientIp: () => 'test', rateLimit: () => ({ success: true }) },
      '@/lib/test-tiroides': {
        validateAndSanitizeAnswers: () => ({}),
        buildTestResult: () => ({ title: 'Resultado', summary: 'Prueba', nextStep: 'Continuar', priorities: [], cta: { href: '/tiroides', label: 'Continuar' } }),
      },
      '@/lib/db/thyroid-funnel': {
        recordThyroidFunnelEvent: async () => { throw new Error('tracking unavailable') },
      },
    })
    return { submit: () => POST({ json: async () => payload }), emails: () => emails }
  }

  test(`${route}: no confirma ni envía correos si falla la captura`, async () => {
    const endpoint = handler(async () => { throw new Error('save failed') })
    const response = await endpoint.submit()
    assert.equal(response.status, 500)
    assert.equal(endpoint.emails(), 0)
  })

  test(`${route}: conserva el registro aunque no se pueda enviar el correo`, async () => {
    const endpoint = handler(async () => ({ id: 'saved-lead' }))
    const response = await endpoint.submit()
    assert.equal(response.status, 200)
    assert.equal((await response.json()).success, true)
    assert.ok(endpoint.emails() >= 1)
  })
}

function emailSender(fetch) {
  return loadModule('src/lib/email.ts', {}, {
    process: { env: { RESEND_API_KEY: 'test', MAIL_FROM: 'test@example.com' } }, fetch,
  }).sendLeadEmail
}

test('reintenta errores temporales con la misma clave de idempotencia', async () => {
  const keys = []
  const send = emailSender(async (_url, options) => {
    keys.push(options.headers['Idempotency-Key'])
    return { ok: keys.length === 3, status: 503 }
  })
  assert.equal(await send({ to: 'test@example.com', subject: 'Test', html: '' }), true)
  assert.deepEqual(keys, ['delivery-test', 'delivery-test', 'delivery-test'])
})

test('limita los reintentos y no oculta el fallo definitivo de entrega', async () => {
  let calls = 0
  const send = emailSender(async () => { calls += 1; return { ok: false, status: 429 } })
  assert.equal(await send({ to: 'test@example.com', subject: 'Test', html: '' }), false)
  assert.equal(calls, 3)
})

test('no reintenta rechazos permanentes ni envíos de resultado ambiguo', async () => {
  for (const status of [400, null]) {
    let calls = 0
    const send = emailSender(async () => {
      calls += 1
      if (status === null) throw new Error('connection lost')
      return { ok: false, status }
    })
    assert.equal(await send({ to: 'test@example.com', subject: 'Test', html: '' }), false)
    assert.equal(calls, 1)
  }
})

test('el CTA del blog abre la guía y mide un clic sin registrar una suscripción', () => {
  const clicks = []
  let signups = 0
  const jsx = (type, props) => ({ type, props })
  const { default: Blog } = loadModule('src/components/blog/BlogContentWithCTAs.tsx', {
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/link': { default: 'a' },
    '@/lib/analytics': {
      trackBlogCtaClick: (...args) => clicks.push(args), trackSignUp: () => { signups += 1 },
    },
  })
  function links(node) {
    if (!node || typeof node !== 'object') return []
    if (Array.isArray(node)) return node.flatMap(links)
    if (typeof node.type === 'function') return links(node.type(node.props))
    return [...(node.type === 'a' ? [node.props] : []), ...links(node.props?.children)]
  }
  const tree = Blog({ content: '<p>Contenido</p>'.repeat(10), isThyroid: true, sourceSlug: 'articulo' })
  const guide = links(tree).find((link) => link.href === '/tiroides?recurso=guia#test')
  assert.ok(guide)
  guide.onClick()
  assert.deepEqual(clicks, [['articulo', '/tiroides?recurso=guia#test', 'inline']])
  const general = Blog({ content: '<p>Contenido</p>'.repeat(10), sourceSlug: 'general' })
  const generalGuide = links(general).find((link) => link.href === '/recurso-gratis#formulario')
  assert.ok(generalGuide)
  generalGuide.onClick()
  assert.deepEqual(clicks[1], ['general', '/recurso-gratis#formulario', 'inline'])
  assert.equal(signups, 0)
})
