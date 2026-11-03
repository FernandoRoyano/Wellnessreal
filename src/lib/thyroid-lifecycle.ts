import { supabase } from '@/lib/supabase'
import { mutateApplication, type ApplicationRecord } from '@/lib/asesoria-notes'
import { EmailDeliveryError, sendEmail } from '@/lib/email'
import { escapeHtml } from '@/lib/utils/escapeHtml'
import { currentWeekStart } from '@/lib/community-tools'
import { createHash } from 'node:crypto'
import { programProgress } from '@/lib/program-calendar'

type NoticeKind = 'application' | 'welcome' | 'ready' | 'checkin' | 'review' | 'closing' | 'admin_review' | 'admin_delivery'
type NoticeStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'uncertain' | 'skipped'
interface MailContent { to: string; subject: string; html: string; replyTo: string }
export interface LifecycleNotice {
  key: string
  kind: NoticeKind
  dueAt: string
  status: NoticeStatus
  programId?: string
  relatedKey?: string
  week?: number
  lease?: string
  attemptedAt?: string
  claimedAt?: string
  provider?: 'resend' | 'smtp'
  payload?: { nombre: string; email: string }
  payloadHash?: string
  error?: string
}
interface Lifecycle {
  version: 1
  startedAt?: string
  clientId?: string
  messages: LifecycleNotice[]
}

const MARKER = /\[lifecycle:v1:([A-Za-z0-9_-]+)\]/
const DAY = 86_400_000
const PORTAL = '/comunidad/metodo-base-tiroides'

export function readLifecycle(notes: string | null): Lifecycle {
  const encoded = notes?.match(MARKER)?.[1]
  if (!encoded) return { version: 1, messages: [] }
  const state = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Lifecycle
  if (state.version !== 1 || !Array.isArray(state.messages)) throw new Error('[ThyroidLifecycle:read] Registro inválido')
  return state
}

function writeLifecycle(notes: string | null, state: Lifecycle): string {
  const marker = `[lifecycle:v1:${Buffer.from(JSON.stringify(state)).toString('base64url')}]`
  return `${notes?.replace(MARKER, '').trim() ?? ''}\n${marker}`.trim()
}

export function enqueueNotice(notes: string | null, notice: Omit<LifecycleNotice, 'status'>): string {
  const state = readLifecycle(notes)
  if (!state.messages.some((message) => message.key === notice.key)) state.messages.push({ ...notice, status: 'pending' })
  return writeLifecycle(notes, state)
}

export function lifecycleSummary(notes: string | null) {
  return readLifecycle(notes).messages.map(({ key, kind, status, dueAt, error }) => ({ key, kind, status, dueAt, error }))
}

export async function applicationNotificationStatus(id: string, key: string): Promise<NoticeStatus | null> {
  const application = await mutateApplication(id, () => null)
  return readLifecycle(application.notas).messages.find((message) => message.key === key)?.status ?? null
}

export async function planNotificationStatus(programId: string, email: string): Promise<NoticeStatus | null> {
  const { data, error } = await supabase.from('asesoria_solicitudes').select('notas')
    .ilike('email', email.replace(/[\\%_]/g, '\\$&')).eq('estado', 'pagada')
    .order('creado_en', { ascending: false }).limit(1).maybeSingle()
  if (error) throw new Error('[ThyroidLifecycle:status] No se pudo consultar el aviso')
  return readLifecycle(data?.notas ?? null).messages.find((message) => message.key === `ready:${programId}`)?.status ?? null
}

function loginLink(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'
  return `${base}/comunidad/entrar?next=${encodeURIComponent(path)}`
}

export function lifecycleEmail(application: ApplicationRecord, notice: LifecycleNotice): MailContent {
  const name = escapeHtml(application.nombre)
  let subject: string
  let content: string
  let label = 'Entrar en mi programa'
  let path = PORTAL
  let to = application.email
  switch (notice.kind) {
    case 'application':
      subject = 'Hemos recibido tu solicitud · WellnessReal'
      content = `<h1>Solicitud recibida</h1><p>Hola ${name}. Tu solicitud de valoración ha quedado guardada.</p><p>Fernando revisará tu situación y te responderá a este correo para valorar contigo si el programa encaja. Si encaja, recibirás las opciones de pago y los pasos para empezar.</p><p>Enviar la solicitud no reserva una plaza ni genera ningún cobro. Puedes responder a este correo si necesitas corregir algo.</p>`
      label = 'Consultar el programa'
      path = '/metodo-tiroides'
      break
    case 'welcome':
      subject = 'Pago confirmado: estos son tus siguientes pasos · WellnessReal'
      content = `<h1>Tu pago está confirmado</h1><p>Hola ${name}. Ya puedes preparar tu inicio:</p><ol><li>Entra con el mismo correo de tu compra: <strong>${escapeHtml(application.email)}</strong>.</li><li>Abre el enlace de acceso que recibirás por email y confirma la entrada.</li><li>Completa la evaluación inicial.</li></ol><p>Fernando revisará tu plan antes de publicarlo. Recibirás otro correo cuando esté aprobado. Las 12 semanas de acompañamiento empiezan con esa aprobación.</p><p>No necesitas ver ningún vídeo para completar estos pasos. Si elegiste dos pagos, el enlace del segundo y último pago llegará a los 30 días del primero; no es una suscripción.</p>`
      label = 'Completar mi evaluación'
      path = '/cuestionario?origen=metodo-tiroides'
      break
    case 'ready':
      subject = 'Tu plan ya está aprobado · WellnessReal'
      content = `<h1>Tu plan está listo</h1><p>Hola ${name}. Fernando ha revisado y aprobado tu plan personalizado.</p><p>Entra con el correo de tu compra para consultar tus sesiones, las pautas y el check-in semanal. Empieza leyendo el plan y organiza la primera semana a tu ritmo.</p><p>Si algo no encaja o aparece una molestia, comunícalo antes de seguir. Puedes responder a este correo para resolver dudas.</p>`
      break
    case 'checkin':
      subject = 'Tu check-in semanal · WellnessReal'
      content = `<h1>Un momento para revisar tu semana</h1><p>Hola ${name}. Si aún no lo has hecho, completa el check-in de esta semana en tu espacio.</p><p>Cuenta cómo han ido el entrenamiento, el descanso y la energía. Una semana difícil también aporta información: no necesitas haberlo cumplido todo.</p>`
      path = '/comunidad/mi-semana#checkin'
      label = 'Completar mi check-in'
      break
    case 'review':
      subject = 'Prepara tu revisión individual · WellnessReal'
      content = `<h1>Prepara tu ${notice.week === 4 ? 'primera' : 'segunda'} revisión</h1><p>Hola ${name}. Has llegado a la semana ${notice.week} de tu recorrido. Es un buen momento para revisar contigo cómo está encajando el plan.</p><p>Actualiza tu check-in y responde a este correo para coordinar la revisión con Fernando. Si ya habéis acordado una fecha, conserva esa cita.</p><p>Este aviso no reserva una cita ni cambia la fecha que hayáis acordado.</p>`
      path = '/comunidad/mi-semana#checkin'
      label = 'Actualizar mi check-in'
      break
    case 'closing':
      subject = 'Cierre de tus 12 semanas: próximos pasos · WellnessReal'
      content = `<h1>Revisamos el recorrido y el siguiente paso</h1><p>Hola ${name}. Han transcurrido las 12 semanas desde la aprobación de tu primer plan.</p><p>Antes de cerrar esta etapa, revisa tu punto de partida, lo que has podido sostener y lo que todavía necesita ajustes. Completa tu último check-in y responde a este correo para compartirlo con Fernando y acordar las pautas que te llevarás para continuar.</p><p>Si quieres seguir con acompañamiento, coméntalo con Fernando. La continuidad se acuerda por separado: no hay renovación automática ni nuevos cobros por este cierre.</p>`
      break
    case 'admin_review':
      to = 'info@wellnessreal.es'
      subject = 'Hay un plan pendiente de revisión · WellnessReal'
      content = `<h1>Plan preparado para revisar</h1><p>La evaluación o actualización de ${name} ya tiene un borrador guardado.</p><p>Revisa el plan en el panel y apruébalo cuando esté listo para entregarlo. El cliente recibirá su aviso después de la aprobación.</p>`
      path = `/admin/programas/${encodeURIComponent(notice.programId ?? '')}`
      label = 'Revisar el plan'
      break
    case 'admin_delivery':
      to = 'info@wellnessreal.es'
      subject = 'Un correo de acompañamiento necesita revisión · WellnessReal'
      content = `<h1>Revisar un envío</h1><p>Un aviso dirigido a ${name} ha sido rechazado o su entrega no se ha podido confirmar.</p><p>Comprueba su estado en Solicitudes y en el proveedor antes de reenviarlo. Un resultado sin confirmar puede corresponder a un correo ya enviado.</p>`
      path = '/admin/comunidad/asesoria'
      label = 'Consultar el envío'
      break
  }
  const href = notice.kind === 'application' || notice.kind.startsWith('admin_')
    ? `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'}${path}`
    : loginLink(path)
  return {
    to, subject, replyTo: 'info@wellnessreal.es',
    html: `<div style="max-width:600px;margin:auto;padding:32px;background:#16122b;color:#fff;font-family:Arial,sans-serif;line-height:1.7"><p style="color:#fcee21;font-weight:700">WELLNESSREAL</p>${content}<p><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;background:#fcee21;color:#16122b;text-decoration:none;border-radius:10px;font-weight:700">${label}</a></p><p>Fernando · WellnessReal<br>¿Necesitas ayuda? Responde a este correo.</p></div>`,
  }
}

/** La marca del borrador permite que el cron recupere un aviso interrumpido. */
export async function queueProgramReview(programId: string): Promise<number> {
  const { data: program, error } = await supabase.from('programas_generados')
    .select('id,vigente,revisado,cliente:cliente_perfil(email)').eq('id', programId).single()
  if (error) throw new Error('[ThyroidLifecycle:review] No se pudo consultar el borrador')
  if (!program?.vigente || program.revisado) return 0
  const client = program.cliente as unknown as { email: string } | null
  if (!client) return 0
  const { data: application, error: applicationError } = await supabase.from('asesoria_solicitudes')
    .select('id').eq('estado', 'pagada').ilike('email', client.email.replace(/[\\%_]/g, '\\$&'))
    .order('creado_en', { ascending: false }).limit(1).maybeSingle()
  if (applicationError) throw new Error('[ThyroidLifecycle:review] No se pudo consultar la solicitud')
  if (!application) return 0
  await mutateApplication(application.id, (current) => {
    const notes = enqueueNotice(current.notas, { key: `admin-review:${programId}`, kind: 'admin_review', programId, dueAt: new Date().toISOString() })
    return notes === current.notas ? null : { notas: notes }
  })
  return deliverApplicationMessages(application.id)
}

async function queueDeliveryAlerts(id: string): Promise<boolean> {
  let added = false
  await mutateApplication(id, (application) => {
    added = false
    const state = readLifecycle(application.notas)
    let notes = application.notas
    for (const notice of state.messages) {
      if (notice.kind.startsWith('admin_') || !notice.error || !['failed', 'uncertain', 'pending', 'sending'].includes(notice.status)) continue
      const key = `admin-delivery:${notice.key}`
      if (state.messages.some((message) => message.key === key)) continue
      notes = enqueueNotice(notes, { key, kind: 'admin_delivery', relatedKey: notice.key, dueAt: new Date().toISOString() })
      added = true
    }
    return added && notes ? { notas: notes } : null
  })
  return added
}

/** Solo las nuevas aprobaciones activan el recorrido; nunca se importa un histórico. */
export async function queuePlanApproval(programId: string): Promise<string | null> {
  const { data: program, error } = await supabase.from('programas_generados')
    .select('id,cliente_id,vigente,revisado,revisado_en,cliente:cliente_perfil(email)').eq('id', programId).single()
  if (error) throw new Error('[ThyroidLifecycle:approval] No se pudo consultar el plan')
  if (!program?.vigente) return null
  const client = program.cliente as unknown as { email: string } | null
  if (!client) return null
  const { data: application, error: applicationError } = await supabase.from('asesoria_solicitudes')
    .select('id,notas').ilike('email', client.email.replace(/[\\%_]/g, '\\$&')).eq('estado', 'pagada')
    .order('creado_en', { ascending: false }).limit(1).maybeSingle()
  if (applicationError) throw new Error('[ThyroidLifecycle:approval] No se pudo consultar el pago')
  if (!application) return null
  const existing = readLifecycle(application.notas)
  if (program.revisado && !existing.messages.some((message) => message.key === `ready:${programId}`)) return null
  await mutateApplication(application.id, (current) => {
    const notes = enqueueNotice(current.notas, { key: `ready:${programId}`, kind: 'ready', programId, dueAt: new Date().toISOString() })
    return notes === current.notas ? null : { notas: notes }
  })
  return application.id as string
}

interface ClientState { id: string; estado_programa: string; acceso_manual: boolean; email: string }
async function activeClient(application: ApplicationRecord): Promise<ClientState | null> {
  if (application.estado !== 'pagada') return null
  const { data, error } = await supabase.from('cliente_perfil').select('id,estado_programa,acceso_manual,email')
    .ilike('email', application.email.replace(/[\\%_]/g, '\\$&')).maybeSingle()
  if (error) throw new Error('[ThyroidLifecycle:client] No se pudo consultar el acceso')
  return data?.estado_programa === 'activo' && data.acceso_manual ? data as ClientState : null
}

async function noticeAllowed(application: ApplicationRecord, notice: LifecycleNotice): Promise<'send' | 'wait' | 'skip'> {
  if (notice.kind === 'admin_delivery') {
    const related = readLifecycle(application.notas).messages.find((message) => message.key === notice.relatedKey)
    return related && ['sent', 'skipped'].includes(related.status) ? 'skip' : 'send'
  }
  if (notice.kind === 'admin_review') {
    const { data: draft, error } = await supabase.from('programas_generados').select('vigente,revisado').eq('id', notice.programId!).maybeSingle()
    if (error) throw new Error('[ThyroidLifecycle:review] No se pudo consultar la revisión')
    return application.estado === 'pagada' && draft?.vigente && !draft.revisado ? 'send' : 'skip'
  }
  if (notice.kind === 'application') return application.estado === 'descartada' ? 'skip' : 'send'
  if (notice.kind === 'welcome') return application.estado === 'pagada' ? 'send' : 'wait'
  const client = await activeClient(application)
  if (!client) return 'wait'
  const { data: plan, error } = await supabase.from('programas_generados').select('id,revisado,revisado_en')
    .eq('cliente_id', client.id).eq('vigente', true).maybeSingle()
  if (error) throw new Error('[ThyroidLifecycle:plan] No se pudo consultar la revisión')
  if (!plan?.revisado) return 'wait'
  if (notice.kind === 'ready' && plan.id !== notice.programId) return 'skip'
  if (notice.kind === 'checkin') {
    // El check-in se guarda por semana natural, con el mismo criterio que la interfaz.
    if (currentWeekStart(new Date(notice.dueAt)) !== currentWeekStart()) return 'skip'
    const { data: member, error: memberError } = await supabase.from('member_profiles').select('id')
      .ilike('email', client.email.replace(/[\\%_]/g, '\\$&')).maybeSingle()
    if (memberError) throw new Error('[ThyroidLifecycle:checkin] No se pudo consultar el miembro')
    if (member) {
      const { data: checkin, error: checkinError } = await supabase.from('community_checkins').select('id')
        .eq('member_id', member.id).eq('week_start', currentWeekStart()).maybeSingle()
      if (checkinError) throw new Error('[ThyroidLifecycle:checkin] No se pudo consultar el check-in')
      if (checkin) return 'skip'
    }
  }
  if (notice.kind === 'review') {
    const start = readLifecycle(application.notas).startedAt
    if (!start || Math.floor((Date.now() - Date.parse(start)) / (7 * DAY)) + 1 !== notice.week) return 'skip'
  }
  return 'send'
}

async function finishNotice(id: string, key: string, lease: string, status: NoticeStatus, error?: string): Promise<void> {
  await mutateApplication(id, (application) => {
    const state = readLifecycle(application.notas)
    const notice = state.messages.find((message) => message.key === key)
    if (!notice || notice.lease !== lease) return null
    notice.status = status
    notice.error = error
    if (status === 'pending') {
      delete notice.attemptedAt
      delete notice.provider
    }
    if (['sent', 'failed', 'uncertain', 'skipped'].includes(status)) {
      delete notice.payload
      delete notice.payloadHash
      delete notice.provider
      delete notice.attemptedAt
      delete notice.claimedAt
      delete notice.lease
    }
    return { notas: writeLifecycle(application.notas, state) }
  })
}

/** Reserva persistida antes de contactar al proveedor; no reenvía resultados SMTP ambiguos. */
export async function deliverApplicationMessages(id: string): Promise<number> {
  let sent = 0
  const application = await mutateApplication(id, () => null)
  for (const candidate of readLifecycle(application.notas).messages) {
    if (!['pending', 'sending'].includes(candidate.status) || Date.parse(candidate.dueAt) > Date.now()) continue
    const current = await mutateApplication(id, () => null)
    const allowed = await noticeAllowed(current, candidate)
    if (allowed === 'wait') continue
    const lease = crypto.randomUUID()
    const claimed = await mutateApplication(id, (current) => {
      const state = readLifecycle(current.notas)
      const notice = state.messages.find((message) => message.key === candidate.key)
      if (!notice || !['pending', 'sending'].includes(notice.status)) return null
      if (notice.status === 'sending') {
        const elapsed = Date.now() - Date.parse(notice.attemptedAt ?? '')
        if (Date.now() - Date.parse(notice.claimedAt ?? notice.attemptedAt ?? '') < 10 * 60_000) return null
        // Resend conserva la clave 24 h; fuera de esa ventana hay que revisar el envío.
        if (notice.provider !== 'resend' || elapsed >= 23 * 60 * 60_000) {
          notice.status = 'uncertain'
          notice.error = 'Resultado del proveedor sin confirmar; revisar antes de reenviar'
          return { notas: writeLifecycle(current.notas, state) }
        }
      }
      notice.status = allowed === 'skip' ? 'skipped' : 'sending'
      notice.lease = lease
      notice.claimedAt = new Date().toISOString()
      notice.provider ??= process.env.RESEND_API_KEY ? 'resend' : 'smtp'
      notice.attemptedAt ??= new Date().toISOString()
      notice.payload ??= { nombre: current.nombre, email: current.email }
      const mail = lifecycleEmail({ ...current, ...notice.payload }, notice)
      notice.payloadHash ??= createHash('sha256').update(JSON.stringify(mail)).digest('hex')
      return { notas: writeLifecycle(current.notas, state) }
    })
    const notice = readLifecycle(claimed.notas).messages.find((message) => message.key === candidate.key)
    if (notice?.lease !== lease || notice.status !== 'sending' || !notice.payload) continue
    try {
      const mail = lifecycleEmail({ ...claimed, ...notice.payload }, notice)
      if (createHash('sha256').update(JSON.stringify(mail)).digest('hex') !== notice.payloadHash) {
        await finishNotice(id, notice.key, lease, 'uncertain', 'Contenido cambiado durante un envío pendiente')
        continue
      }
      if (notice.provider !== (process.env.RESEND_API_KEY ? 'resend' : 'smtp')) {
        await finishNotice(id, notice.key, lease, 'uncertain', 'Proveedor cambiado durante un envío pendiente')
        continue
      }
      await sendEmail({ ...mail, idempotencyKey: `thyroid:${id}:${notice.key}` })
    } catch (error) {
      const smtpStatus = error && typeof error === 'object' && 'responseCode' in error ? Number(error.responseCode) : 0
      const rejected = error instanceof EmailDeliveryError ? error.status < 500 : smtpStatus >= 400
      const retryable = error instanceof EmailDeliveryError ? error.status === 429 : smtpStatus >= 400 && smtpStatus < 500
      // Sin confirmación de rechazo, solo Resend permite repetir con la misma clave.
      const status = rejected ? (retryable ? 'pending' : 'failed') : notice.provider === 'resend' ? 'sending' : 'uncertain'
      await finishNotice(id, notice.key, lease, status, rejected ? 'Proveedor rechazó el envío' : 'Envío sin confirmar')
      console.error('[ThyroidLifecycle:delivery]', { applicationId: id, key: notice.key, status })
      continue
    }
    // Fuera del catch de envío: si falla guardar el éxito no se convierte en un rechazo.
    await finishNotice(id, notice.key, lease, 'sent')
    sent += 1
  }
  // Los avisos administrativos no generan otros avisos si falla su proveedor.
  if (await queueDeliveryAlerts(id)) sent += await deliverApplicationMessages(id)
  return sent
}

export async function startJourney(id: string, programId: string): Promise<void> {
  const { data: program, error } = await supabase.from('programas_generados').select('cliente_id,revisado_en,revisado').eq('id', programId).single()
  if (error || !program?.revisado || !program.revisado_en) throw new Error('[ThyroidLifecycle:start] No se pudo confirmar el inicio')
  const { data: firstApproval, error: approvalError } = await supabase.from('programas_generados')
    .select('revisado_en').eq('cliente_id', program.cliente_id).eq('revisado', true)
    .not('revisado_en', 'is', null).order('revisado_en', { ascending: true }).limit(1).maybeSingle()
  if (approvalError) throw new Error('[ThyroidLifecycle:start] No se pudo consultar la primera aprobación')
  await mutateApplication(id, (application) => {
    const state = readLifecycle(application.notas)
    if (state.startedAt) return null
    state.startedAt = firstApproval?.revisado_en ?? program.revisado_en
    state.clientId = program.cliente_id
    return { notas: writeLifecycle(application.notas, state) }
  })
}

export function scheduleJourney(notes: string | null, now = new Date()): string | null {
  const state = readLifecycle(notes)
  if (!state.startedAt) return null
  const start = Date.parse(state.startedAt)
  const days = Math.floor((now.getTime() - start) / DAY)
  if (days < 0) return null
  // Un único aviso al final de cada semana; las semanas 4 y 9 preparan la revisión.
  const week = programProgress(state.startedAt, now.getTime()).week
  if (week === 12 && days < 84) return null // El cierre incluye el último check-in.
  const dueDay = [4, 9].includes(week) ? (week - 1) * 7 : week * 7 - 1
  if (days < 84 && days < dueDay) return null
  const kind: NoticeKind = days >= 84 ? 'closing' : [4, 9].includes(week) ? 'review' : 'checkin'
  const key = kind === 'closing' ? 'closing' : `week:${week}`
  if (state.messages.some((message) => message.key === key)) return null
  return enqueueNotice(notes, { key, kind, week, dueAt: now.toISOString() })
}

export async function processThyroidLifecycle(): Promise<{ sent: number; errors: number }> {
  let sent = 0
  let errors = 0
  for (let offset = 0; ; offset += 100) {
    const { data: drafts, error: draftError } = await supabase.from('programas_generados').select('id')
      .eq('vigente', true).eq('revisado', false).contains('meta', { notify_review: true }).order('id').range(offset, offset + 99)
    if (draftError) throw new Error('[ThyroidLifecycle:cron] No se pudieron consultar las revisiones pendientes')
    for (const draft of drafts ?? []) {
      try { sent += await queueProgramReview(draft.id) } catch {
        errors += 1
        console.error('[ThyroidLifecycle:cron] Revisión pendiente de aviso', { programId: draft.id })
      }
    }
    if (!drafts || drafts.length < 100) break
  }
  // Paginar evita que solicitudes antiguas dejen fuera las nuevas.
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabase.from('asesoria_solicitudes').select('id')
      .like('notas', '%[lifecycle:v1:%').order('id').range(offset, offset + 99)
    if (error) throw new Error('[ThyroidLifecycle:cron] No se pudieron consultar los avisos')
    for (const application of data ?? []) {
      try {
        const current = await mutateApplication(application.id, () => null)
        // Recuperar el inicio aunque un proceso terminase después de registrar el envío.
        const state = readLifecycle(current.notas)
        const ready = state.messages.find((message) => message.kind === 'ready')
        if (!state.startedAt && ready?.programId) {
          const { data: program, error: planError } = await supabase.from('programas_generados')
            .select('revisado,vigente').eq('id', ready.programId).maybeSingle()
          if (planError) throw new Error('[ThyroidLifecycle:cron] No se pudo consultar el inicio')
          if (program?.revisado && program.vigente) await startJourney(application.id, ready.programId)
        }
        if (await activeClient(current)) await mutateApplication(application.id, (record) => {
          const notes = scheduleJourney(record.notas)
          return notes ? { notas: notes } : null
        })
        sent += await deliverApplicationMessages(application.id)
        const latest = await mutateApplication(application.id, () => null)
        if (readLifecycle(latest.notas).messages.some((message) => (['failed', 'uncertain'].includes(message.status)
          || (['pending', 'sending'].includes(message.status) && message.error))
          && Date.parse(message.dueAt) <= Date.now())) errors += 1
      } catch {
        errors += 1
        console.error('[ThyroidLifecycle:cron] Solicitud pendiente de reintento', { applicationId: application.id })
      }
    }
    if (!data || data.length < 100) break
  }
  return { sent, errors }
}
