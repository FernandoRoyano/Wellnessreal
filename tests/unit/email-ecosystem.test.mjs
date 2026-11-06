import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as zod from 'zod'

function load(file, deps = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const mod = { exports: {} }
  vm.runInNewContext(source, { module: mod, exports: mod.exports, URL, URLSearchParams, Response, Headers, AbortSignal, crypto, Buffer,
    process: { env: {} }, console: { error() {} }, require: name => deps[name] ?? {}, ...globals }, { filename: file })
  return mod.exports
}

function attribution({ pathname = '/comunidad/entrar', search = '', consent = true, previous } = {}) {
  const document = { cookie: previous ? `wr_attr=${encodeURIComponent(JSON.stringify(previous))}` : '', referrer: 'https://wellnessreal.es/comunidad/confirmar?code=private-token' }
  const api = load('src/lib/tracking.ts', { '@/lib/cookie-consent': { hasTrackingConsent: () => consent } }, { window: { location: { pathname, search, hostname: 'wellnessreal.es' } }, document })
  return { api, document }
}

test('una entrada directa conserva campaña consentida sin enlaces de acceso ni identificadores publicitarios', () => {
  const f = attribution({ search: '?utm_source=meta&utm_medium=paid_social&utm_campaign=community_intro&utm_content=resource_a&code=secret&email=private@example.com&fbclid=private-click' })
  const result = f.api.captureAttribution()
  assert.equal(result.utm_source, 'meta')
  assert.equal(result.landing_page, '/comunidad/entrar')
  assert.ok(!JSON.stringify(result).includes('private'))
  assert.ok(!JSON.stringify(result).includes('secret'))
  assert.ok(!JSON.stringify(result).includes('fbclid'))
  assert.ok(f.document.cookie.includes('wr_attr='))
})

test('la atribución no escribe sin consentimiento, en confirmación o con valores que contienen datos personales', () => {
  for (const input of [{ consent: false, search: '?utm_source=meta' }, { pathname: '/comunidad/confirmar', search: '?code=private&utm_source=meta' }, { search: '?utm_source=private@example.com' }]) {
    const f = attribution(input)
    assert.equal(JSON.stringify(f.api.captureAttribution()), '{}')
    assert.equal(f.document.cookie, '')
  }
})

test('el primer origen conserva prioridad frente a visitas posteriores desde emails', () => {
  const previous = { utm_source: 'google', utm_medium: 'cpc', first_seen_at: '2026-11-01T10:00:00Z' }
  const f = attribution({ search: '?utm_source=wellnessreal&utm_medium=email', previous })
  assert.equal(JSON.stringify(f.api.captureAttribution()), JSON.stringify(previous))
})

function newsletter({ member = { email: 'ana@example.com', display_name: 'Ana', status: 'approved' }, premium = false, readFailure = false, enabled = false, sync = 'synced', syncFailure = false } = {}) {
  const captured = [], updates = [], synced = []
  const api = load('src/app/api/newsletter/route.ts', {
    zod, 'next/server': { NextResponse: Response },
    '@/lib/rateLimit': { getClientIp: () => 'fixture', rateLimit: () => ({ success: true }) },
    '@/lib/db/comunidad': { getSessionMember: async () => member, isApproved: value => value?.status === 'approved', memberHasPremium: async (_member, strict) => { assert.equal(strict, true); if (readFailure) throw new Error('database unavailable'); return premium } },
    '@/lib/leadCapture': { captureLead: async input => { captured.push(input); return { id: 'lead-1' } } },
    '@/lib/db/leads': { upsertLead: async input => updates.push(input) },
    '@/lib/mailerlite': { syncCommunitySubscriber: async input => { synced.push(input); if (syncFailure) throw new Error('provider unavailable'); return sync } },
  }, { process: { env: { MAILERLITE_API_KEY: 'fixture', MAILERLITE_COMUNIDAD_GROUP_ID: 'group-1', COMMUNITY_EMAIL_SEQUENCE_ENABLED: enabled ? 'true' : 'false' } } })
  return { captured, updates, synced, submit: (email = 'ana@example.com') => api.POST({ json: async () => ({ email, _source: 'community', marketingConsent: true, name: 'Untrusted name' }) }) }
}

test('la suscripción de comunidad exige sesión, identidad coincidente y miembro aprobado', async () => {
  for (const [options, email, expected] of [[{ member: null }, 'ana@example.com', 401], [{ member: { email: 'ana@example.com', status: 'blocked' } }, 'ana@example.com', 401], [{}, 'other@example.com', 400]]) {
    const f = newsletter(options)
    assert.equal((await f.submit(email)).status, expected)
    assert.equal(f.captured.length, 0)
    assert.equal(f.synced.length, 0)
  }
})

test('una clienta de pago y una lectura dudosa de su acceso no entran en el recorrido de compra', async () => {
  for (const [options, expected] of [[{ premium: true, enabled: true }, 409], [{ readFailure: true, enabled: true }, 500]]) {
    const f = newsletter(options)
    assert.equal((await f.submit()).status, expected)
    assert.equal(f.captured.length, 0)
    assert.equal(f.synced.length, 0)
  }
})

test('la elección permanece guardada y retenida mientras la secuencia está apagada', async () => {
  const f = newsletter()
  assert.equal((await f.submit()).status, 200)
  assert.equal(f.captured[0].name, 'Ana')
  assert.equal(f.captured[0].form_data.marketing_consent.sync_status, 'held')
  assert.equal(f.synced.length, 0)
})

test('se conserva un estado revisable al sincronizar, respetar una baja o fallar el proveedor', async () => {
  for (const [options, status] of [[{}, 'synced'], [{ sync: 'suppressed' }, 'suppressed'], [{ syncFailure: true }, 'pending']]) {
    const f = newsletter({ ...options, enabled: true })
    const response = await f.submit()
    assert.equal(response.status, 200)
    assert.equal((await response.json()).subscriptionStatus, status)
    assert.equal(f.updates[0].form_data.marketing_consent.sync_status, status)
    assert.equal(f.updates[0].email, 'ana@example.com')
  }
})

function mailerlite(existing, { lookupStatus = 200, uploadStatus = 200 } = {}) {
  const requests = []
  const api = load('src/lib/mailerlite.ts', {}, { process: { env: { MAILERLITE_API_KEY: 'fixture' } }, fetch: async (url, options) => {
    requests.push({ url, method: options.method ?? 'GET', body: options.body ? JSON.parse(options.body) : undefined })
    return options.method === 'POST' ? Response.json({ data: { status: 'active' } }, { status: uploadStatus }) : Response.json({ data: existing }, { status: lookupStatus })
  } })
  return { requests, sync: () => api.syncCommunitySubscriber({ email: 'ana@example.com', name: 'Ana', groupId: 'group-1' }) }
}

test('una baja, rebote o falta de confirmación no se reactiva desde la comunidad', async () => {
  for (const status of ['unsubscribed', 'bounced', 'junk', 'unconfirmed']) {
    const f = mailerlite({ status, groups: [] })
    assert.equal(await f.sync(), 'suppressed')
    assert.equal(f.requests.length, 1)
  }
})

test('volver a guardar la preferencia no vuelve a incorporar al mismo grupo', async () => {
  const f = mailerlite({ status: 'active', groups: [{ id: 'group-1' }] })
  assert.equal(await f.sync(), 'synced')
  assert.equal(f.requests.length, 1)
})

test('la incorporación usa solo email, nombre y grupo, conservando el estado del proveedor', async () => {
  const f = mailerlite({ status: 'active', groups: [] })
  assert.equal(await f.sync(), 'synced')
  assert.equal(JSON.stringify(f.requests[1].body), JSON.stringify({ email: 'ana@example.com', fields: { name: 'Ana' }, groups: ['group-1'] }))
  assert.equal('status' in f.requests[1].body, false)
})

test('no interpreta un fallo de consulta como suscriptor inexistente ni oculta un fallo al incorporar', async () => {
  const unavailable = mailerlite(null, { lookupStatus: 503 })
  await assert.rejects(unavailable.sync(), /comprobar/)
  assert.equal(unavailable.requests.length, 1)
  await assert.rejects(mailerlite(null, { lookupStatus: 404, uploadStatus: 503 }).sync(), /incorporar/)
})

function customerGroups({ status = 'active', groups = [], lookupStatus = 200, assignStatus = 201, customerGroup = 'customers' } = {}) {
  const requests = []
  const api = load('src/lib/mailerlite.ts', {}, {
    process: { env: { MAILERLITE_API_KEY: 'fixture', MAILERLITE_COMUNIDAD_GROUP_ID: 'community', MAILERLITE_CLIENTES_GROUP_ID: customerGroup } },
    fetch: async (url, options) => {
      const method = options.method ?? 'GET'
      requests.push({ url, method, body: options.body })
      if (method === 'DELETE') return new Response(null, { status: 204 })
      if (method === 'POST') return Response.json({}, { status: assignStatus })
      return Response.json({ data: { id: 'subscriber-1', status, groups } }, { status: lookupStatus })
    },
  })
  return { api, requests }
}

test('un pago retira captación y añade clientes sin modificar otras suscripciones ni su estado', async () => {
  const f = customerGroups({ groups: [{ id: 'community' }, { id: 'other' }] })
  await f.api.stopCommunityPurchaseInvitations(' ANA@example.com ')
  assert.ok(f.requests[0].url.endsWith('/subscribers/ana%40example.com'))
  assert.equal(f.requests[1].method, 'DELETE')
  assert.ok(f.requests[1].url.endsWith('/subscriber-1/groups/community'))
  assert.equal(f.requests[2].method, 'POST')
  assert.ok(f.requests[2].url.endsWith('/subscriber-1/groups/customers'))
  assert.ok(f.requests.every(request => request.body === undefined))
})

test('el pago no crea contactos y los reintentos no vuelven a añadir una clienta ya clasificada', async () => {
  const missing = customerGroups({ lookupStatus: 404 })
  await missing.api.stopCommunityPurchaseInvitations('ana@example.com')
  assert.equal(missing.requests.length, 1)
  const existing = customerGroups({ groups: [{ id: 'customers' }] })
  await existing.api.stopCommunityPurchaseInvitations('ana@example.com')
  assert.equal(existing.requests.length, 2)
  assert.ok(existing.requests.every(request => request.method !== 'POST'))
})

test('la clasificación de pago no reactiva bajas y un fallo de asignación permite reintentar', async () => {
  const suppressed = customerGroups({ status: 'unsubscribed' })
  await suppressed.api.stopCommunityPurchaseInvitations('ana@example.com')
  assert.ok(suppressed.requests.every(request => request.body === undefined))
  const failed = customerGroups({ assignStatus: 503 })
  await assert.rejects(failed.api.stopCommunityPurchaseInvitations('ana@example.com'), /grupo de clientes/)
  assert.equal(failed.requests[1].method, 'DELETE')
})

test('el grupo de clientes bloquea otra entrada comercial aunque la solicitud llegue directamente', async () => {
  const f = customerGroups({ groups: [{ id: 'customers' }] })
  assert.equal(await f.api.syncCommunitySubscriber({ email: 'ana@example.com', groupId: 'community' }), 'suppressed')
  assert.equal(f.requests.length, 1)
})

test('una configuración con el mismo grupo para clientas y captación falla antes de escribir', async () => {
  const f = customerGroups({ customerGroup: 'community' })
  await assert.rejects(f.api.stopCommunityPurchaseInvitations('ana@example.com'), /distintos/)
  await assert.rejects(f.api.syncCommunitySubscriber({ email: 'ana@example.com', groupId: 'community' }), /distintos/)
  assert.equal(f.requests.length, 0)
})

test('los correos comparten marca, un único CTA principal y baja, con texto escapado y enlaces seguros', () => {
  const escape = load('src/lib/utils/escapeHtml.ts')
  const { COMMUNITY_EMAIL_DRAFTS, renderCommunityEmail } = load('src/lib/community-email-drafts.ts', { '@/lib/utils/escapeHtml': escape })
  assert.equal(COMMUNITY_EMAIL_DRAFTS.length, 4)
  for (const draft of COMMUNITY_EMAIL_DRAFTS) {
    const html = renderCommunityEmail(draft.vars, draft.preheader)
    assert.match(html, /lang="es"/)
    assert.equal((html.match(/\{\$unsubscribe\}/g) ?? []).length, 1)
    assert.equal((html.match(/utm_content=day_/g) ?? []).length, 1)
    assert.ok(html.includes(escape.escapeHtml(draft.preheader)))
  }
  const vars = { ...COMMUNITY_EMAIL_DRAFTS[0].vars, title: '<script>private</script>' }
  assert.ok(!renderCommunityEmail(vars, 'Preview').includes('<script>'))
  assert.throws(() => renderCommunityEmail({ ...vars, ctaUrl: 'javascript:alert(1)' }, 'Preview'), /Destino/)
})

function customerLead(lead, { lookupError = null, updateError = null } = {}) {
  const updates = [], filters = []
  const query = { select() { return this }, eq(key, value) { filters.push([key, value]); return this },
    maybeSingle: async () => ({ data: lead, error: lookupError }), update(patch) { updates.push(patch); return this },
    then(resolve) { return Promise.resolve({ error: updateError }).then(resolve) },
  }
  const api = load('src/lib/db/thyroid-funnel.ts', {
    '@/lib/supabase': { supabase: { from: () => query } },
    '@/lib/lead-measurement': load('src/lib/lead-measurement.ts'),
  })
  return { updates, filters, mark: () => api.markThyroidLeadAsCustomer(' ANA@example.com ') }
}

test('el pago queda en el CRM y los reintentos conservan la primera conversión y el marcador de pago', async () => {
  const converted = '2026-10-01T10:00:00Z'
  const f = customerLead({ id: 'lead-1', tags: ['via:tiroides', 'crm:tipo:suscriptor', 'crm:fase:propuesta', `crm:pago:${converted}`], converted_at: converted })
  assert.equal(await f.mark(), 'lead-1')
  assert.equal(f.filters[0][1], 'ana@example.com')
  assert.equal(f.updates[0].status, 'cliente')
  assert.equal(f.updates[0].converted_at, converted)
  assert.ok(f.updates[0].tags.includes('crm:tipo:oportunidad'))
  assert.ok(f.updates[0].tags.includes('crm:fase:pagado'))
  assert.equal(f.updates[0].tags.filter(tag => tag.startsWith('crm:pago:')).length, 1)
  assert.ok(!f.updates[0].tags.includes('crm:fase:propuesta'))
})

test('el pago no transforma pruebas en oportunidades ni modifica contactos de otros servicios', async () => {
  const f = customerLead({ id: 'lead-test', tags: ['via:tiroides', 'crm:tipo:prueba'], converted_at: null })
  await f.mark()
  assert.ok(f.updates[0].converted_at)
  assert.equal(JSON.stringify(f.updates[0].tags), JSON.stringify(['via:tiroides', 'crm:tipo:prueba']))
  for (const lead of [null, { id: 'other', tags: ['via:contacto'] }]) {
    const other = customerLead(lead)
    assert.equal(await other.mark(), null)
    assert.equal(other.updates.length, 0)
  }
  await assert.rejects(customerLead(null, { lookupError: { message: 'unavailable' } }).mark(), /findCustomer/)
})

test('confirmar una asesoría pagada utiliza su email guardado y retira las invitaciones también al reintentar', async () => {
  const calls = []
  const application = { id: 'application-1', email: 'owner@example.com', estado: 'nueva', notas: null }
  const lifecycle = load('src/lib/thyroid-lifecycle.ts')
  let failure = false
  const query = { update(patch) { calls.push(['update', patch]); return this }, eq() { return this }, ilike(field, value) { assert.equal(field, 'email'); assert.equal(value, 'owner@example.com'); return this },
    is(field, value) { calls.push(['condition', field, value]); return this },
    then(resolve) { return Promise.resolve({ error: null }).then(resolve) },
  }
  const api = load('src/lib/db/comunidad.ts', {
    '@/lib/supabase': { supabase: { from: () => query } },
    '@/lib/asesoria-notes': { mutateApplication: async (_id, mutate) => { const patch = mutate(application); if (patch) Object.assign(application, patch); return application } },
    '@/lib/thyroid-lifecycle': { ...lifecycle, deliverApplicationMessages: async id => calls.push(['delivery', id]) },
    '@/lib/db/thyroid-funnel': { markThyroidLeadAsCustomer: async email => calls.push(['crm', email]) },
    '@/lib/mailerlite': { stopCommunityPurchaseInvitations: async email => { calls.push(['stop', email]); if (failure) throw new Error('provider unavailable') } },
  })
  await api.setAsesoriaEstado('application-1', 'contactada')
  assert.equal(calls.length, 1)
  await api.setAsesoriaEstado('application-1', 'pagada')
  assert.equal(application.estado, 'pagada')
  assert.equal(JSON.stringify(calls.slice(-3)), JSON.stringify([['crm', 'owner@example.com'], ['stop', 'owner@example.com'], ['delivery', 'application-1']]))
  assert.ok(calls.some(([kind, patch]) => kind === 'update' && patch.acceso_manual === true))
  assert.ok(calls.some(([kind, field, value]) => kind === 'condition' && field === 'pagado_en' && value === null))
  failure = true
  await assert.rejects(api.setAsesoriaEstado('application-1', 'pagada'), /provider unavailable/)
  failure = false
  await api.setAsesoriaEstado('application-1', 'pagada')
  assert.equal(lifecycle.readLifecycle(application.notas).messages.filter(notice => notice.key === 'welcome').length, 1)
})

test('el acceso manual exige administrador y retira invitaciones solo al conceder acceso', async () => {
  let authorized = false, writes = 0
  const stopped = []
  const query = { update() { writes++; return this }, eq() { return this }, select() { return this }, single: async () => ({ data: { email: 'owner@example.com' }, error: null }) }
  const api = load('src/app/api/admin/programas/[id]/route.ts', {
    'next/server': { NextResponse: Response }, '@/lib/auth': { isAdminAuthenticated: async () => authorized },
    '@/lib/supabase': { supabase: { from: () => query } },
    '@/lib/mailerlite': { stopCommunityPurchaseInvitations: async email => stopped.push(email) },
  })
  const submit = enabled => api.PATCH({ json: async () => ({ acceso_manual: enabled, cliente_id: 'profile-1', email: 'untrusted@example.com' }) }, { params: Promise.resolve({ id: 'program-1' }) })
  assert.equal((await submit(true)).status, 401)
  assert.equal(writes, 0)
  authorized = true
  assert.equal((await submit(true)).status, 200)
  assert.equal(stopped[0], 'owner@example.com')
  assert.equal((await submit(false)).status, 200)
  assert.equal(stopped.length, 1)
})
