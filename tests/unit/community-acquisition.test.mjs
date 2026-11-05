import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as zod from 'zod'

function load(path, deps = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const mod = { exports: {} }
  vm.runInNewContext(source, { module: mod, exports: mod.exports, FormData, Headers, Response, URLSearchParams, AbortSignal, crypto,
    process: { env: {} }, console: { error() {} }, require: name => deps[name] ?? {}, ...globals }, { filename: path })
  return mod.exports
}
const context = { anonymousId: '11111111-1111-4111-8111-111111111111', sessionId: '22222222-2222-4222-8222-222222222222' }
const parsing = load('src/lib/community-tracking.ts', { zod })

test('el contexto de medición descarta datos ajenos al identificador y entradas inválidas', () => {
  assert.equal(parsing.parseCommunityTracking('no-json'), undefined)
  assert.equal(parsing.parseCommunityTracking(JSON.stringify({ email: 'private@example.com' })), undefined)
  assert.equal(JSON.stringify(parsing.parseCommunityTracking(JSON.stringify({ ...context, email: 'private@example.com', diagnosis: 'private' }))), JSON.stringify(context))
})

function memberApi(existing) {
  let mails = 0, subscriptions = 0
  const events = []
  const profile = { id: 'member-1', display_name: 'Ana', email: 'ana@example.com', status: 'approved' }
  const query = { select() { return this }, eq() { return this }, insert() { return this }, maybeSingle: async () => ({ data: existing ? profile : null }), single: async () => ({ data: profile }) }
  const api = load('src/lib/db/comunidad.ts', {
    '@/lib/supabase': { supabase: { from: () => query } },
    '@/lib/email': { sendEmail: async () => { mails++ } },
    '@/lib/mailerlite': { createSubscriber: async () => { subscriptions++ } },
    '@/lib/db/thyroid-funnel': { recordThyroidFunnelEvent: async event => events.push(event) },
  })
  return { api, events, mails: () => mails, subscriptions: () => subscriptions }
}

test('solo un perfil nuevo recibe bienvenida y alta confirmada; nunca se suscribe por entrar', async () => {
  const fresh = memberApi(false)
  await fresh.api.ensureMemberProfile({ id: 'member-1', email: 'ana@example.com' }, context)
  assert.equal(fresh.mails(), 1)
  assert.equal(fresh.subscriptions(), 0)
  assert.equal(fresh.events[0].eventName, 'community_signup_confirmed')
  assert.equal(fresh.events[0].externalId, 'community:signup:member-1')
  const returning = memberApi(true)
  await returning.api.ensureMemberProfile({ id: 'member-1', email: 'ana@example.com' }, context)
  assert.equal(returning.mails(), 0)
  assert.equal(returning.events.length, 0)
})

function actions({ allowed = true, otpError = null, completed = false } = {}) {
  const events = [], saved = []
  const api = load('src/app/(comunidad)/comunidad/actions.ts', {
    zod, 'next/headers': { headers: async () => new Headers() }, 'next/cache': { revalidatePath() {} },
    '@/lib/supabase-env': { supabaseConfigStatus: () => ({ ok: true }) },
    '@/lib/supabase-ssr': { createServerSupabase: async () => ({ auth: { signInWithOtp: async () => ({ error: otpError }) } }) },
    '@/lib/db/comunidad': { getSessionMember: async () => ({ id: 'member-1', email: 'ana@example.com' }), memberCanAccessLesson: async () => allowed },
    '@/lib/community-progress': { getCompletedLessonIds: async () => new Set(completed ? ['previous'] : []), setLessonCompletion: async (...args) => saved.push(args) },
    '@/lib/community-tracking': parsing,
    '@/lib/db/thyroid-funnel': { recordThyroidFunnelEvent: async event => events.push(event) },
    '@/lib/safe-redirect': { safeInternalPath: (_value, fallback) => fallback },
  })
  const data = new FormData()
  data.set('email', 'ana@example.com')
  data.set('_community_tracking', JSON.stringify(context))
  data.set('lesson_id', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
  data.set('completed', 'true')
  return { api, data, events, saved }
}

test('pedir un enlace solo registra solicitud cuando el proveedor la acepta', async () => {
  const success = actions()
  assert.equal((await success.api.requestMagicLink(null, success.data)).ok, true)
  assert.equal(success.events[0].eventName, 'community_access_requested')
  const limited = actions({ otpError: { message: 'only request this after 60 seconds' } })
  assert.equal((await limited.api.requestMagicLink(null, limited.data)).ok, false)
  assert.equal(limited.events.length, 0)
})

test('los errores de acceso explican qué hacer sin mostrar configuración interna del proveedor', async () => {
  for (const message of ['email rate limit exceeded', 'Email address not authorized']) {
    const f = actions({ otpError: { message } })
    const result = await f.api.requestMagicLink(null, f.data)
    assert.equal(result.ok, false)
    assert.match(result.error, /Espera|Inténtalo/)
    assert.ok(!/Supabase|SMTP|Resend|not authorized/.test(result.error))
    assert.equal(f.events.length, 0)
  }
})

test('completar una lección exige permiso y solo el primer avance genera el hito', async () => {
  const denied = actions({ allowed: false })
  await denied.api.setLessonCompletionAction(denied.data)
  assert.equal(denied.saved.length, 0)
  const first = actions()
  await first.api.setLessonCompletionAction(first.data)
  assert.equal(first.events[0].eventName, 'community_first_lesson_completed')
  const later = actions({ completed: true })
  await later.api.setLessonCompletionAction(later.data)
  assert.equal(later.events.length, 0)
})

test('la suscripción comercial requiere elección explícita y no duplica la bienvenida', async () => {
  const captured = []
  let mails = 0
  const { POST } = load('src/app/api/newsletter/route.ts', {
    zod, 'next/server': { NextResponse: Response },
    '@/lib/rateLimit': { getClientIp: () => 'fixture', rateLimit: () => ({ success: true }) },
    '@/lib/leadCapture': { captureLead: async value => captured.push(value) },
    '@/lib/email': { sendLeadEmail: async () => { mails++ } },
    '@/lib/db/comunidad': { getSessionMember: async () => ({ email: 'ana@example.com', display_name: 'Ana', status: 'approved' }), isApproved: () => true, memberHasPremium: async () => false },
    '@/lib/utils/escapeHtml': { escapeHtml: value => value },
  })
  const submit = marketingConsent => POST({ json: async () => ({ email: 'ana@example.com', _source: 'community', marketingConsent }) })
  assert.equal((await submit(false)).status, 400)
  assert.equal(captured.length, 0)
  assert.equal((await submit(true)).status, 200)
  assert.equal(captured[0].form_data.marketing_consent.accepted, true)
  assert.equal(mails, 0)
})

test('los eventos de la comunidad respetan cookies y no se envían a Google', () => {
  const calls = [], google = []
  const api = load('src/lib/analytics.ts', {
    '@/lib/cookie-consent': { hasTrackingConsent: () => true }, '@/lib/tracking': { getStoredAttribution: () => ({}) },
  }, { window: { gtag: (...args) => google.push(args), location: { search: '' }, localStorage: { getItem: () => 'local-id' }, sessionStorage: { getItem: () => 'session-id' } },
    fetch: async (url, options) => calls.push(JSON.parse(options.body)),
  })
  api.trackThyroidFunnel('community_entry_click', { position: 'hero', diagnosis: 'private', email: 'private@example.com' })
  assert.equal(google.length, 0)
  assert.equal(JSON.stringify(calls[0]).includes('private'), false)
  const rejected = load('src/lib/analytics.ts', { '@/lib/cookie-consent': { hasTrackingConsent: () => false } }, { fetch: () => assert.fail('Sin consentimiento no hay medición') })
  rejected.trackThyroidFunnel('community_entry_click')
})

test('el navegador no puede confirmar altas ni lecciones mediante el endpoint público', async () => {
  let writes = 0
  const names = ['community_signup_confirmed', 'community_access_requested', 'community_first_lesson_completed', 'thyroid_sale', 'thyroid_valuation_submit']
  const { POST } = load('src/app/api/funnel/tiroides/event/route.ts', { zod, 'next/server': { NextResponse: Response }, '@/lib/db/thyroid-funnel': { THYROID_FUNNEL_EVENTS: names, recordThyroidFunnelEvent: async () => { writes++ } } })
  for (const eventName of names) assert.equal((await POST({ json: async () => ({ eventName }) })).status, 400)
  assert.equal(writes, 0)
})

test('al pagar se retira solo el grupo de invitaciones y un fallo permite reintentar', async () => {
  const requests = []
  let fail = false
  const api = load('src/lib/mailerlite.ts', {}, { process: { env: { MAILERLITE_API_KEY: 'fixture', MAILERLITE_COMUNIDAD_GROUP_ID: 'group-1' } }, fetch: async (url, options) => {
    requests.push([url, options.method ?? 'GET'])
    return options.method === 'DELETE' ? new Response(null, { status: fail ? 503 : 204 }) : Response.json({ data: { id: 'subscriber-1', status: 'active' } })
  } })
  await api.stopCommunityPurchaseInvitations('ana@example.com')
  assert.match(requests[1][0], /subscribers\/subscriber-1\/groups\/group-1$/)
  assert.equal(requests[1][1], 'DELETE')
  fail = true
  await assert.rejects(api.stopCommunityPurchaseInvitations('ana@example.com'), /retirar del grupo/)
})

test('la secuencia no se incorpora a MailerLite mientras siga desactivada', async () => {
  let calls = 0
  const { POST } = load('src/app/api/newsletter/route.ts', {
    zod, 'next/server': { NextResponse: Response },
    '@/lib/rateLimit': { getClientIp: () => 'fixture', rateLimit: () => ({ success: true }) },
    '@/lib/leadCapture': { captureLead: async () => ({ id: 'fixture' }) },
    '@/lib/db/comunidad': { getSessionMember: async () => ({ email: 'ana@example.com', display_name: 'Ana', status: 'approved' }), isApproved: () => true, memberHasPremium: async () => false },
  }, { process: { env: { MAILERLITE_API_KEY: 'fixture', MAILERLITE_COMUNIDAD_GROUP_ID: 'fixture-group', COMMUNITY_EMAIL_SEQUENCE_ENABLED: 'false' } }, fetch: async () => { calls++; return Response.json({}) } })
  assert.equal((await POST({ json: async () => ({ email: 'ana@example.com', _source: 'community', marketingConsent: true }) })).status, 200)
  assert.equal(calls, 0)
})
