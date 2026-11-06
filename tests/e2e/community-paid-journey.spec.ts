import { expect, test } from '@playwright/test'
import { createAdminSessionToken } from '../../src/lib/admin-session'
import { getThyroidBaseProgram } from '../../src/lib/metodo-tiroides-template'

const fixture = 'http://127.0.0.1:54329'
const clientId = '66666666-6666-4666-8666-666666666666'
const programId = '88888888-8888-4888-8888-888888888888'
type Write = { table: string; method: string; rows?: { id: string; email?: string }[] }

test.beforeEach(async ({ page }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo datos y proveedores ficticios locales')
  await page.route('https://**/*', route => route.abort())
  await page.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
})

test('acceso confirmado, solicitud, pago manual, aprobación, plan y check-in forman un recorrido continuo', async ({ page, context, request }) => {
  test.setTimeout(120_000)
  await request.post(`${fixture}/__reset-journey`)
  await page.goto('/comunidad/entrar')
  await page.getByLabel('Email de acceso').fill('journey@example.com')
  await page.getByRole('button', { name: 'Recibir mi enlace de acceso' }).click()
  await expect(page.getByRole('heading', { name: 'Revisa tu correo' })).toBeVisible()
  const before = await (await request.get(`${fixture}/__writes`)).json() as Write[]
  const verificationCount = before.filter(row => row.table === 'auth').length
  await page.goto('/comunidad/confirmar?token_hash=fixture-magic-journey&type=email&next=%2Fcomunidad')
  const afterGet = await (await request.get(`${fixture}/__writes`)).json() as Write[]
  expect(afterGet.filter(row => row.table === 'auth')).toHaveLength(verificationCount)
  await page.getByRole('button', { name: 'Confirmar acceso' }).click()
  await expect(page).toHaveURL(/\/comunidad$/, { timeout: 15_000 })
  await expect(page.getByRole('checkbox', { name: /Quiero recibir ideas prácticas/ })).not.toBeChecked()
  await page.getByRole('link', { name: 'Ver cómo funciona Método BASE' }).click()
  await expect(page).toHaveURL(/metodo-tiroides\?origen=comunidad/)
  await page.getByLabel('Nombre', { exact: true }).fill('Ana Recorrido')
  await page.getByLabel('Email', { exact: true }).fill('journey@example.com')
  await page.getByLabel(/Teléfono/).fill('+34 600 000 000')
  await page.getByLabel(/conseguir/).fill('Organizar dos sesiones de fuerza a la semana con un plan adaptado y seguimiento.')
  await page.getByLabel(/días/).selectOption('2')
  await page.getByRole('button', { name: 'Solicitar mi plaza' }).click()
  await expect(page.getByRole('heading', { name: 'Solicitud recibida' })).toBeVisible()
  const applications = await (await request.get(`${fixture}/rest/v1/asesoria_solicitudes?email=eq.journey@example.com`)).json() as { id: string }[]
  const application = applications[0]
  expect(application?.id).toBeTruthy()
  await page.goto('/comunidad/metodo-base-tiroides')
  await expect(page).toHaveURL(/\/metodo-tiroides$/)

  const adminToken = await createAdminSessionToken('fixture-admin-secret')
  await context.addCookies([{ name: 'wr_admin_session', value: adminToken, domain: '127.0.0.1', path: '/' }])
  const paid = await context.request.patch('/api/admin/comunidad/asesoria', { data: { id: application?.id, estado: 'pagada' } })
  expect(paid.status()).toBe(200)
  const paidApplications = await (await request.get(`${fixture}/rest/v1/asesoria_solicitudes?email=eq.journey@example.com`)).json() as { notas: string }[]
  const encodedLifecycle = paidApplications[0].notas.match(/\[lifecycle:v1:([A-Za-z0-9_-]+)\]/)?.[1]
  expect(encodedLifecycle).toBeTruthy()
  const lifecycle = JSON.parse(Buffer.from(encodedLifecycle!, 'base64url').toString()) as { messages: { key: string }[] }
  expect(lifecycle.messages.filter(notice => notice.key === 'welcome')).toHaveLength(1)
  const marketing = await context.request.post('/api/newsletter', { data: { email: 'journey@example.com', _source: 'community', marketingConsent: true } })
  expect(marketing.status()).toBe(409)
  await page.goto('/comunidad/metodo-base-tiroides')
  await expect(page.getByRole('heading', { name: 'Completa tu evaluación inicial' })).toBeVisible()
  await page.getByRole('link', { name: /Completar evaluación/ }).click()
  await expect(page).toHaveURL(/\/cuestionario\?origen=metodo-tiroides$/)
  await expect(page.locator('input[type="email"]')).toHaveValue('journey@example.com')
  await expect(page.locator('input[type="email"]')).toHaveAttribute('readonly', '')
  const evaluations: Record<string, unknown>[] = []
  // Solo se sustituye la generación de IA por una plantilla ficticia y determinista.
  await page.route('**/api/generar-programa', async route => {
    evaluations.push(route.request().postDataJSON() as Record<string, unknown>)
    if (evaluations.length === 1) return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'No se pudo preparar el borrador de prueba. Inténtalo de nuevo.' }) })
    await request.post(`${fixture}/rest/v1/cliente_perfil`, { data: { id: clientId, email: 'journey@example.com', nombre: 'Ana Recorrido', token: 'fixture-journey-personal-plan', acceso_manual: true, pagado_en: new Date().toISOString(), estado_programa: 'activo', plan_tier: 'revisado' } })
    await request.patch(`${fixture}/rest/v1/member_profiles?email=eq.journey@example.com`, { data: { cliente_id: clientId } })
    await request.post(`${fixture}/rest/v1/programas_generados`, { data: { id: programId, cliente_id: clientId, cliente: { email: 'journey@example.com' }, vigente: true, revisado: false, revisado_en: null, version: 1, programa: getThyroidBaseProgram(2), creado_en: new Date().toISOString() } })
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, token: 'fixture-journey-personal-plan' }) })
  })
  await page.getByPlaceholder('Tu nombre', { exact: true }).fill('Ana Recorrido')
  for (let step = 0; step < 7; step++) {
    if (step === 2) await page.locator('.wrq-chip').first().click()
    await page.getByRole('button', { name: /Siguiente/ }).click()
  }
  const generate = page.getByRole('button', { name: /Generar mi plan/ })
  await expect(generate).toBeDisabled()
  await page.getByRole('checkbox', { name: /Autorizo el tratamiento/ }).check()
  await generate.click()
  await expect(page.getByText('No se pudo preparar el borrador de prueba. Inténtalo de nuevo.')).toBeVisible()
  await generate.click()
  await expect(page.getByRole('heading', { name: 'Evaluación recibida' })).toBeVisible()
  expect(evaluations).toHaveLength(2)
  expect(evaluations[1].email).toBe('journey@example.com')
  expect(evaluations[1].privacy_consent).toBe(true)
  expect(evaluations[1].origen).toBe('metodo-tiroides')
  expect(evaluations[1].nombre).toBe('Ana Recorrido')
  await page.goto('/comunidad/metodo-base-tiroides')
  await expect(page.getByText('Pendiente de aprobación', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /Abrir mi plan/ })).toHaveCount(0)
  await page.goto('/programa/fixture-journey-personal-plan')
  await expect(page.getByRole('heading', { name: /tu plan está en preparación/ })).toBeVisible()
  await expect(page.getByText('Sentadilla goblet', { exact: true })).toHaveCount(0)
  expect((await context.request.get('/api/programa/fixture-journey-personal-plan/pdf')).status()).toBe(404)
  const approval = await context.request.patch(`/api/admin/programas/${programId}`, { data: { revisado: true } })
  expect(approval.status()).toBe(200)
  const firstApproved = await (await request.get(`${fixture}/rest/v1/programas_generados?id=eq.${programId}`)).json() as { revisado_en: string }[]
  expect(firstApproved[0].revisado_en).toBeTruthy()
  const repeatedApproval = await context.request.patch(`/api/admin/programas/${programId}`, { data: { revisado: true } })
  expect(repeatedApproval.status()).toBe(200)
  const repeated = await (await request.get(`${fixture}/rest/v1/programas_generados?id=eq.${programId}`)).json() as { revisado_en: string }[]
  expect(repeated[0].revisado_en).toBe(firstApproved[0].revisado_en)
  await page.goto('/comunidad/metodo-base-tiroides')
  await expect(page.getByText('Semana 1 de 12', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: /Abrir mi plan/ }).click()
  await expect(page).toHaveURL(/\/programa\/fixture-journey-personal-plan$/)
  await expect(page.getByText('Sentadilla goblet', { exact: true })).toBeVisible()
  const pdf = await context.request.get('/api/programa/fixture-journey-personal-plan/pdf')
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()['content-type']).toContain('application/pdf')
  expect(pdf.headers()['cache-control']).toContain('no-store')
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-')
  await page.goto('/comunidad/mi-semana#checkin')
  await page.getByLabel(/Qué condiciona esta semana/).fill('Dos sesiones previstas y alternativa para un día de trabajo largo.')
  await page.getByRole('button', { name: 'Guardar mi semana' }).click()
  await expect(page.getByRole('status').filter({ hasText: /guardad/i })).toBeVisible()
  const records = await (await request.get(`${fixture}/rest/v1/community_checkins?member_id=eq.60000000-0000-4000-8000-000000000000`)).json() as { note: string }[]
  expect(records).toHaveLength(1)
  expect(records[0].note).toContain('Dos sesiones previstas')
  const leads = await (await request.get(`${fixture}/rest/v1/leads?email=eq.journey@example.com`)).json() as { status: string; tags: string[] }[]
  expect(leads[0].status).toBe('cliente')
  expect(leads[0].tags).toContain('crm:fase:pagado')
  expect(leads[0].tags).toContain('crm:tipo:oportunidad')
})

test('un enlace caducado ofrece reintento sin iniciar una sesión y conserva el destino', async ({ page, context }) => {
  const destination = '/comunidad/entrena-organizate/por-que-empezar-con-fuerza'
  await page.goto(`/comunidad/confirmar?token_hash=fixture-expired&type=email&next=${encodeURIComponent(destination)}`)
  await page.getByRole('button', { name: 'Confirmar acceso' }).click()
  await expect(page.getByRole('alert').filter({ hasText: /caducado|usado/ })).toBeVisible()
  expect((await context.cookies()).find(cookie => cookie.name === 'sb-127-auth-token')).toBeUndefined()
  await page.getByRole('link', { name: 'Pedir un nuevo enlace de acceso' }).click()
  await expect(page.getByLabel('Email de acceso')).toBeVisible()
  await expect(page.locator('input[name="next"]')).toHaveValue(destination)
})

test('el pago manual de un perfil existente activa acceso y conserva la fecha y una sola confirmación', async ({ context, request }) => {
  await request.post(`${fixture}/__reset-journey`)
  const paidAt = '2026-10-01T10:00:00.000Z'
  const id = '99999999-9999-4999-8999-999999999999'
  await request.post(`${fixture}/rest/v1/cliente_perfil`, { data: { id: clientId, email: 'journey@example.com', acceso_manual: false, pagado_en: paidAt, estado_programa: 'activo' } })
  await request.post(`${fixture}/rest/v1/asesoria_solicitudes`, { data: { id, email: 'journey@example.com', nombre: 'Ana Recorrido', estado: 'aceptada', notas: null } })
  const denied = await context.request.patch('/api/admin/comunidad/asesoria', { data: { id, estado: 'pagada' } })
  expect(denied.status()).toBe(401)
  await context.addCookies([{ name: 'wr_admin_session', value: await createAdminSessionToken('fixture-admin-secret'), domain: '127.0.0.1', path: '/' }])
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await context.request.patch('/api/admin/comunidad/asesoria', { data: { id, estado: 'pagada' } })
    expect(response.status()).toBe(200)
  }
  const profiles = await (await request.get(`${fixture}/rest/v1/cliente_perfil?email=eq.journey@example.com`)).json() as { acceso_manual: boolean; pagado_en: string }[]
  expect(profiles[0].acceso_manual).toBe(true)
  expect(profiles[0].pagado_en).toBe(paidAt)
  const applications = await (await request.get(`${fixture}/rest/v1/asesoria_solicitudes?id=eq.${id}`)).json() as { estado: string; notas: string }[]
  expect(applications[0].estado).toBe('pagada')
  const encoded = applications[0].notas.match(/\[lifecycle:v1:([A-Za-z0-9_-]+)\]/)?.[1]
  const lifecycle = JSON.parse(Buffer.from(encoded!, 'base64url').toString()) as { messages: { key: string }[] }
  expect(lifecycle.messages.filter(notice => notice.key === 'welcome')).toHaveLength(1)
})
