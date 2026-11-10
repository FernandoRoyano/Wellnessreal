import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'
import { createAdminSessionToken } from '../../src/lib/admin-session'

const fixture = 'http://127.0.0.1:54329'
test.beforeEach(async ({ page }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo proveedores y datos locales ficticios')
  await page.route('https://**/*', route => route.abort())
  await page.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
})

test('las dos confirmaciones orientan a comunidad sin vender rapidez o entrenamiento individual', async ({ page }) => {
  await page.goto('/gracias-recurso')
  await expect(page.getByRole('link', { name: 'Entrar en la comunidad', exact: true })).toHaveAttribute('href', '/comunidad/entrar')
  await expect(page.locator('main a[href="/servicios/entrenamiento-online"]')).toHaveCount(0)
  await expect(page.locator('main a[href="/tiroides#test"]')).toHaveCount(0)
  await page.goto('/gracias-tiroides')
  await expect(page.getByRole('link', { name: 'Entrar en la comunidad', exact: true })).toHaveAttribute('href', '/comunidad/entrar')
  await expect(page.getByText('Entras con tu email en 10 segundos.', { exact: false })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Solicitar valoración gratuita', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Ver Método BASE', exact: true })).toHaveAttribute('href', '/metodo-tiroides')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
})

test('el acceso confirma el email normalizado y permite corregirlo', async ({ page }) => {
  await page.goto('/comunidad/entrar')
  await page.getByLabel('Email de acceso').fill('FREE@EXAMPLE.COM')
  await page.getByRole('button', { name: 'Recibir mi enlace de acceso' }).click()
  await expect(page.getByRole('status')).toContainText('free@example.com')
  await page.getByRole('button', { name: 'Volver a pedir el enlace o corregir mi email' }).click()
  await expect(page.getByLabel('Email de acceso')).toHaveValue('FREE@EXAMPLE.COM')
})

test('la búsqueda reconoce sinónimos y muestra desbloqueos sin dar acceso al contenido', async ({ page, context, request }) => {
  await fixtureSession(context, 'free')
  const rows = await (await request.get(`${fixture}/rest/v1/lessons?slug=eq.fatiga-futura`)).json() as unknown[]
  if (!rows.length) await request.post(`${fixture}/rest/v1/lessons`, { data: { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', space_id: '11111111-2222-4111-8111-111111111111', slug: 'fatiga-futura', title: 'Cómo organizarte cuando estás cansada', content: 'Contenido futuro de prueba', access_tier: 'free', published: true, drip_days: 9999, sort_order: 2 } })
  await page.goto('/comunidad/buscar')
  await page.getByLabel('Buscar por tema o lección').fill('fatiga')
  const result = page.locator('.community-search-results article').filter({ hasText: 'Cómo organizarte cuando estás cansada' })
  await expect(result).toBeVisible()
  await expect(result).toContainText(/Disponible en \d+ días/)
  await expect(result.locator('a')).toHaveCount(0)
  await expect(page.getByText('Contenido futuro de prueba')).toHaveCount(0)
})

test('la actividad respeta consentimiento, sesión y deduplicación diaria', async ({ page, context, request }) => {
  expect((await request.post('/api/comunidad/activity', { data: {} })).status()).toBe(401)
  await fixtureSession(context, 'free')
  const activityRequests: string[] = []
  page.on('request', req => { if (req.url().includes('/api/comunidad/activity')) activityRequests.push(req.postData() ?? '') })
  await page.goto('/comunidad')
  await page.waitForTimeout(300)
  expect(activityRequests).toHaveLength(0)
  await page.evaluate(() => { localStorage.setItem('wr_cookie_consent_v2', 'accepted'); window.dispatchEvent(new Event('wr-consent-changed')) })
  await expect.poll(() => activityRequests.length).toBe(1)
  const tracking = { anonymousId: '00000000-0000-4000-8000-000000000001', sessionId: '00000000-0000-4000-8000-000000000002' }
  expect((await context.request.post('/api/comunidad/activity', { data: '{', headers: { 'content-type': 'application/json' } })).status()).toBe(400)
  expect((await context.request.post('/api/comunidad/activity', { data: { action: 'visit', consent: true, tracking }, headers: { origin: 'https://example.com' } })).status()).toBe(403)
  expect((await context.request.post('/api/comunidad/activity', { data: { action: 'visit', consent: false, tracking } })).status()).toBe(400)
  expect((await context.request.post('/api/comunidad/activity', { data: { action: 'resource', consent: true, tracking } })).status()).toBe(204)
  expect((await context.request.post('/api/comunidad/activity', { data: { action: 'resource', consent: true, tracking } })).status()).toBe(204)
  const events = await (await request.get(`${fixture}/rest/v1/thyroid_funnel_events?event_name=eq.community_resource_click`)).json() as { metadata: object }[]
  expect(events).toHaveLength(1)
  expect(Object.keys(events[0].metadata)).toEqual(['member_id'])
})

test('el panel protege las métricas y muestra retorno pendiente cuando falta una cohorte completa', async ({ page, context, request, baseURL }) => {
  expect((await request.get('/api/admin/funnel-tiroides?days=30')).status()).toBe(401)
  await context.addCookies([{ name: 'wr_admin_session', value: await createAdminSessionToken('fixture-admin-secret'), url: baseURL! }])
  const response = await context.request.get('/api/admin/funnel-tiroides?days=30')
  expect(response.status()).toBe(200)
  const data = await response.json() as { communityRetention: { enabled: boolean; returnRate: number | null } }
  expect(data.communityRetention.enabled).toBe(true)
  expect(data.communityRetention.returnRate).toBeNull()
  await page.goto('/admin/funnel-tiroides')
  await expect(page.getByRole('heading', { name: 'Continuidad en la comunidad' })).toBeVisible()
  await expect(page.getByText('0 de 0 altas con ventana completa')).toBeVisible()
})
