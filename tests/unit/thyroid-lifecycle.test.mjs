import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as nodeCrypto from 'node:crypto'

function load(path, dependencies, globals) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const compiled = { exports: {} }
  vm.runInNewContext(source, { module: compiled, exports: compiled.exports, Buffer, crypto, Response,
    console: { error() {} }, require: (name) => dependencies[name] ?? {}, ...globals }, { filename: path })
  return compiled.exports
}

class EmailDeliveryError extends Error {
  constructor(status) { super('provider rejected'); this.status = status }
}

function fixture({ resend = true } = {}) {
  let now = Date.parse('2026-11-02T10:00:00Z')
  class Clock extends Date {
    constructor(value) { super(value ?? now) }
    static now() { return now }
  }
  const tables = {
    asesoria_solicitudes: [{ id: 'application-1', nombre: 'Ana <script>', email: 'ana@example.com', estado: 'pagada', member_id: 'member-1', notas: '[payment:one_time]' }],
    cliente_perfil: [{ id: 'client-1', email: 'ana@example.com', acceso_manual: true, pagado_en: null, estado_programa: 'activo' }],
    programas_generados: [{ id: 'program-1', cliente_id: 'client-1', vigente: true, revisado: true, revisado_en: new Clock().toISOString(), cliente: { email: 'ana@example.com' } }],
    member_profiles: [{ id: 'member-1', email: 'ana@example.com' }],
    community_checkins: [],
  }
  let failSentWrite = false
  const supabase = { from(table) {
    const filters = []
    let patch, insert, start = 0, end = Infinity
    const query = {
      select() { return this }, order() { return this },
      contains(field, value) { filters.push((row) => Object.entries(value).every(([key, expected]) => row[field]?.[key] === expected)); return this },
      not(field, operator, value) { assert.equal(operator, 'is'); filters.push((row) => row[field] !== value && row[field] !== undefined); return this },
      limit(count) { end = count - 1; return this },
      range(from, to) { start = from; end = to; return this },
      eq(field, value) { filters.push((row) => row[field] === value); return this },
      is(field, value) { return this.eq(field, value) },
      ilike(field, value) { filters.push((row) => String(row[field]).toLowerCase() === value.replace(/\\([_%\\])/g, '$1').toLowerCase()); return this },
      like(field) { filters.push((row) => row[field]?.includes('[lifecycle:v1:')); return this },
      update(value) { patch = value; return this },
      insert(value) { insert = value; return this },
      async execute(single) {
        if (insert) tables[table].push(structuredClone(insert))
        const rows = tables[table].filter((row) => filters.every((filter) => filter(row))).slice(start, end + 1)
        if (patch && failSentWrite && patch.notas && lifecycle.readLifecycle(patch.notas).messages.some((message) => message.status === 'sent')) {
          failSentWrite = false
          return { data: null, error: { message: 'write unavailable' } }
        }
        if (patch) rows.forEach((row) => Object.assign(row, patch))
        return { data: structuredClone(single ? rows[0] ?? null : rows), error: null }
      },
      single() { return this.execute(true) }, maybeSingle() { return this.execute(true) },
      then(resolve, reject) { return this.execute(false).then(resolve, reject) },
    }
    return query
  } }
  const sent = []
  let sendError = null
  const notes = load('src/lib/asesoria-notes.ts', { '@/lib/supabase': { supabase } }, {})
  function weekStart(date = new Clock()) {
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() || 7) + 1)
    return monday.toISOString().slice(0, 10)
  }
  const email = { EmailDeliveryError, sendEmail: async (message) => { if (sendError) throw sendError; sent.push(message) } }
  const lifecycle = load('src/lib/thyroid-lifecycle.ts', {
    '@/lib/supabase': { supabase }, '@/lib/asesoria-notes': notes,
    '@/lib/program-calendar': load('src/lib/program-calendar.ts', {}, { Date: Clock }),
    'node:crypto': nodeCrypto,
    '@/lib/email': email,
    '@/lib/community-tools': { currentWeekStart: weekStart },
    '@/lib/utils/escapeHtml': { escapeHtml: (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]) },
  }, { Date: Clock, process: { env: resend ? { RESEND_API_KEY: 'test-only' } : {} } })
  const application = tables.asesoria_solicitudes[0]
  function enqueue(kind, options = {}) {
    application.notas = lifecycle.enqueueNotice(application.notas, { key: kind, kind, dueAt: new Clock().toISOString(), ...options })
  }
  return { lifecycle, notes, tables, sent, application, enqueue, weekStart, supabase, email, Clock,
    time: () => now, tick: (ms) => { now += ms },
    failSentWrite: () => { failSentWrite = true }, failEmail: (error) => { sendError = error } }
}

test('dos trabajadores y sucesivos reintentos envían una sola confirmación', async () => {
  const f = fixture()
  f.enqueue('application')
  await Promise.all([f.lifecycle.deliverApplicationMessages(f.application.id), f.lifecycle.deliverApplicationMessages(f.application.id)])
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.sent.length, 1)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'sent')
  assert.match(f.application.notas, /payment:one_time/)
})

test('las modificaciones concurrentes conservan los dos marcadores', async () => {
  const f = fixture()
  await Promise.all(['a', 'b'].map((marker) => f.notes.mutateApplication(f.application.id, (current) => ({ notas: `${current.notas}\n[${marker}]` }))))
  assert.match(f.application.notas, /\[a\]/)
  assert.match(f.application.notas, /\[b\]/)
})

test('no se avisa de un plan sin aprobar; la aprobación no duplica ni reinicia el recorrido', async () => {
  const f = fixture()
  const program = f.tables.programas_generados[0]
  program.revisado = false
  const applicationId = await f.lifecycle.queuePlanApproval(program.id)
  await f.lifecycle.deliverApplicationMessages(applicationId)
  assert.equal(f.sent.length, 0)
  program.revisado = true
  await f.lifecycle.startJourney(applicationId, program.id)
  await f.lifecycle.deliverApplicationMessages(applicationId)
  const start = f.lifecycle.readLifecycle(f.application.notas).startedAt
  f.tick(7 * 86_400_000)
  await f.lifecycle.queuePlanApproval(program.id)
  await f.lifecycle.startJourney(applicationId, program.id)
  await f.lifecycle.deliverApplicationMessages(applicationId)
  assert.equal(f.sent.length, 1)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).startedAt, start)
})

test('el despliegue y el cron no incorporan aprobaciones históricas', async () => {
  const f = fixture()
  assert.equal(await f.lifecycle.queuePlanApproval('program-1'), null)
  const result = await f.lifecycle.processThyroidLifecycle()
  assert.equal(result.sent, 0)
  assert.equal(f.sent.length, 0)
  assert.equal(f.application.notas, '[payment:one_time]')
})

test('el check-in completado en la semana actual evita el recordatorio', async () => {
  const f = fixture()
  f.tables.community_checkins.push({ id: 'checkin-1', member_id: 'member-1', week_start: f.weekStart() })
  f.enqueue('checkin')
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.sent.length, 0)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'skipped')
})

test('un check-in antiguo no oculta el recordatorio actual', async () => {
  const f = fixture()
  f.tables.community_checkins.push({ id: 'checkin-1', member_id: 'member-1', week_start: '2026-10-26' })
  f.enqueue('checkin')
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.sent.length, 1)
  assert.match(f.sent[0].html, /next=%2Fcomunidad%2Fmi-semana%23checkin/)
})

test('no se mandan recordatorios con acceso revocado, pausado o finalizado', async () => {
  for (const patch of [{ acceso_manual: false }, { estado_programa: 'pausado' }, { estado_programa: 'finalizado' }]) {
    const f = fixture()
    Object.assign(f.tables.cliente_perfil[0], patch)
    f.enqueue('checkin')
    await f.lifecycle.deliverApplicationMessages(f.application.id)
    assert.equal(f.sent.length, 0)
    assert.equal((await f.lifecycle.processThyroidLifecycle()).errors, 0)
  }
})

test('el calendario prepara revisiones en semanas 4 y 9 y cierra a los 84 días sin recuperar avisos atrasados', async () => {
  const f = fixture()
  await f.lifecycle.startJourney(f.application.id, 'program-1')
  const start = f.time()
  assert.equal(f.lifecycle.scheduleJourney(f.application.notas, new Date(start + 5 * 86_400_000)), null)
  for (const [days, kind, week] of [[6, 'checkin', 1], [21, 'review', 4], [56, 'review', 9], [84, 'closing', 12]]) {
    const notes = f.lifecycle.scheduleJourney(f.application.notas, new Date(start + days * 86_400_000))
    const messages = f.lifecycle.readLifecycle(notes).messages
    assert.equal(messages.length, 1)
    assert.equal(messages[0].kind, kind)
    assert.equal(messages[0].week, week)
  }
  f.application.notas = f.lifecycle.scheduleJourney(f.application.notas, new Date(start + 84 * 86_400_000))
  assert.equal(f.lifecycle.scheduleJourney(f.application.notas, new Date(start + 85 * 86_400_000)), null)
})

test('un rechazo transitorio se conserva para reintentar sin perder la solicitud', async () => {
  const f = fixture()
  f.enqueue('application')
  f.failEmail(new EmailDeliveryError(429))
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'pending')
  f.failEmail(null)
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.sent.length, 1)
})

test('un envío SMTP ambiguo queda para revisión y nunca se reenvía automáticamente', async () => {
  const f = fixture({ resend: false })
  f.enqueue('application')
  f.failEmail(new Error('socket disconnected'))
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  f.failEmail(null)
  f.tick(2 * 86_400_000)
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'uncertain')
  assert.equal(f.sent.length, 0)
})

test('si falla guardar el éxito se conserva la clave y el contenido del reintento Resend', async () => {
  const f = fixture()
  f.enqueue('application')
  f.failSentWrite()
  await assert.rejects(f.lifecycle.deliverApplicationMessages(f.application.id))
  f.application.nombre = 'Nombre cambiado'
  f.tick(11 * 60_000)
  await Promise.all([f.lifecycle.deliverApplicationMessages(f.application.id), f.lifecycle.deliverApplicationMessages(f.application.id)])
  assert.equal(f.sent.length, 2)
  assert.equal(f.sent[0].idempotencyKey, f.sent[1].idempotencyKey)
  assert.equal(f.sent[0].html, f.sent[1].html)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'sent')
})

test('no se repite un envío ambiguo fuera de la ventana de idempotencia del proveedor', async () => {
  const f = fixture()
  f.enqueue('application')
  f.failEmail(new Error('connection lost'))
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  f.tick(24 * 60 * 60_000)
  f.failEmail(null)
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'uncertain')
  assert.equal(f.sent.length, 0)
})

test('los correos escapan el nombre y no inventan citas ni renovaciones', () => {
  const f = fixture()
  const welcome = f.lifecycle.lifecycleEmail(f.application, { kind: 'welcome' })
  assert.match(welcome.html, /Ana &lt;script&gt;/)
  assert.match(welcome.html, /cuestionario%3Forigen%3Dmetodo-tiroides/)
  const review = f.lifecycle.lifecycleEmail(f.application, { kind: 'review', week: 4 })
  assert.match(review.html, /no reserva una cita/)
  const closing = f.lifecycle.lifecycleEmail(f.application, { kind: 'closing' })
  assert.match(closing.html, /no hay renovación automática/)
})

function webhook(f, session) {
  return load('src/app/api/stripe/webhook/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/stripe': { getStripe: () => ({ webhooks: { constructEvent: () => ({ id: 'evt-test', type: 'checkout.session.completed', data: { object: session } }) } }) },
    '@/lib/supabase': { supabase: f.supabase }, '@/lib/asesoria-notes': f.notes,
    '@/lib/thyroid-lifecycle': f.lifecycle,
    '@/lib/db/thyroid-funnel': { markThyroidLeadAsCustomer: async () => null, recordThyroidFunnelEvent: async () => {} },
  }, { process: { env: {} }, Date: f.Clock })
}

test('el webhook repetido del pago inicial conserva la fecha y una sola bienvenida', async () => {
  const f = fixture()
  f.application.notas = null
  f.application.estado = 'aceptada'
  const session = { payment_status: 'paid', metadata: { kind: 'metodo_tiroides', asesoria_id: f.application.id, payment_plan: 'installments', installment_index: '1' } }
  const api = webhook(f, session)
  const request = () => new Request('https://example.com/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': 'test' }, body: '{}' })
  assert.equal((await api.POST(request())).status, 200)
  const date = f.tables.cliente_perfil[0].pagado_en
  assert.equal((await api.POST(request())).status, 200)
  assert.equal(f.application.estado, 'pagada')
  assert.equal(f.sent.length, 1)
  assert.equal(f.tables.cliente_perfil[0].pagado_en, date)
  assert.match(f.application.notas, /payment:installments:1/)
})

test('el segundo pago no vuelve a enviar la bienvenida y un fallo de correo no revierte el pago', async () => {
  const f = fixture()
  const session = { payment_status: 'paid', metadata: { kind: 'metodo_tiroides', asesoria_id: f.application.id, payment_plan: 'installments', installment_index: '2' } }
  const request = () => new Request('https://example.com/webhook', { method: 'POST', headers: { 'stripe-signature': 'test' }, body: '{}' })
  assert.equal((await webhook(f, session).POST(request())).status, 200)
  assert.equal(f.sent.length, 0)
  f.application.notas = null
  session.metadata.installment_index = '1'
  f.failEmail(new EmailDeliveryError(429))
  assert.equal((await webhook(f, session).POST(request())).status, 200)
  assert.equal(f.application.estado, 'pagada')
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[0].status, 'pending')
})

test('la solicitud queda guardada con aviso pendiente aunque falle el proveedor', async () => {
  const f = fixture()
  const { createAsesoriaSolicitud } = load('src/lib/db/comunidad.ts', {
    '@/lib/supabase': { supabase: f.supabase }, '@/lib/thyroid-lifecycle': f.lifecycle,
    '@/lib/email': f.email, '@/lib/utils/escapeHtml': { escapeHtml: (value) => value ?? '' },
  }, { process: { env: {} }, Date: f.Clock })
  f.failEmail(new EmailDeliveryError(429))
  await createAsesoriaSolicitud({ memberId: null, nombre: 'Test', email: 'new@example.com' })
  const saved = f.tables.asesoria_solicitudes.find((row) => row.email === 'new@example.com')
  assert.ok(saved)
  assert.equal(f.lifecycle.readLifecycle(saved.notas).messages[0].status, 'pending')
})

test('un borrador nuevo avisa a Fernando una sola vez sin entregar el plan al cliente', async () => {
  const f = fixture()
  f.tables.programas_generados[0].revisado = false
  await Promise.all([f.lifecycle.queueProgramReview('program-1'), f.lifecycle.queueProgramReview('program-1')])
  await f.lifecycle.queueProgramReview('program-1')
  assert.equal(f.sent.length, 1)
  assert.equal(f.sent[0].to, 'info@wellnessreal.es')
  assert.match(f.sent[0].html, /https:\/\/wellnessreal.es\/admin\/programas\/program-1/)
  assert.equal(f.tables.programas_generados[0].revisado, false)
})

test('el cron recupera el aviso de un borrador marcado y omite los borradores históricos', async () => {
  const f = fixture()
  f.tables.programas_generados[0].revisado = false
  await f.lifecycle.processThyroidLifecycle()
  assert.equal(f.sent.length, 0)
  f.tables.programas_generados[0].meta = { notify_review: true }
  await f.lifecycle.processThyroidLifecycle()
  await f.lifecycle.processThyroidLifecycle()
  assert.equal(f.sent.length, 1)
  assert.equal(f.sent[0].to, 'info@wellnessreal.es')
})

test('un fallo del correo del cliente genera un único aviso a Fernando y no una cadena de alertas', async () => {
  const f = fixture()
  f.enqueue('application')
  f.failEmail(new EmailDeliveryError(400))
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  const notices = f.lifecycle.readLifecycle(f.application.notas).messages
  assert.equal(notices.length, 2)
  assert.equal(notices[1].kind, 'admin_delivery')
  assert.equal(notices[1].status, 'failed')
  f.failEmail(null)
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages.length, 2)
})

test('un aviso administrativo de fallo pendiente se omite si el correo del cliente ya se ha recuperado', async () => {
  const f = fixture()
  f.enqueue('application')
  f.failEmail(new EmailDeliveryError(429))
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  f.failEmail(null)
  await f.lifecycle.deliverApplicationMessages(f.application.id)
  assert.equal(f.sent.length, 1)
  assert.equal(f.lifecycle.readLifecycle(f.application.notas).messages[1].status, 'skipped')
})
