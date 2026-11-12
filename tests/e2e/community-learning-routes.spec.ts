import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'

const fixture = 'http://127.0.0.1:54329'
const freeId = '30000000-0000-4000-8000-000000000000'
const welcome = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const force = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const routine = 'dddddddd-eeee-4ddd-8ddd-dddddddddddd'

test.beforeEach(async ({ page, context, request }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo datos y servicios locales ficticios')
  await context.route('https://**/*', route => route.abort())
  await context.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
  await request.delete(`${fixture}/rest/v1/lesson_progress?member_id=eq.${freeId}`)
  const rows = await (await request.get(`${fixture}/rest/v1/lessons?id=eq.${routine}`)).json() as unknown[]
  if (!rows.length) await request.post(`${fixture}/rest/v1/lessons`, { data: { id: routine, space_id: '11111111-2222-4111-8111-111111111111', slug: 'primera-rutina-fuerza', title: 'Tu primera rutina de fuerza', content: 'Texto de prueba que no debe mostrarse antes del desbloqueo', access_tier: 'free', published: true, drip_days: 9999, sort_order: 5 } })
  await fixtureSession(context, 'free')
  await page.goto('/comunidad/rutas')
})

test('three free routes lead into a reader and retain their context after completion', async ({ page }) => {
  await expect(page.getByRole('navigation', { name: 'Elegir ruta de aprendizaje' }).getByRole('link')).toHaveCount(3)
  await page.getByRole('link', { name: /^Empiezo/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Empiezo')
  await page.getByRole('link', { name: 'Continuar esta ruta', exact: true }).click()
  await expect(page).toHaveURL(/lee-esto-primero\?ruta=empezar/, { timeout: 15_000 })
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.getByRole('button', { name: /Lección completada/ })).toBeVisible()
  await page.getByRole('link', { name: 'Continuar ruta: Empiezo', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Continuar esta ruta', exact: true })).toHaveAttribute('href', '/comunidad/entrena-organizate/por-que-empezar-con-fuerza?ruta=empezar')
  await page.locator('summary').filter({ hasText: 'Cambiar ruta' }).click()
  await page.getByRole('link', { name: /^Retomo/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Retomo')
  await page.locator('summary').filter({ hasText: 'Cambiar ruta' }).click()
  await expect(page.getByRole('link', { name: /^Retomo/ })).toContainText('1 de 3 lecturas completadas')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
})

test('the next locked reading has no link and an immediately usable resource remains', async ({ page, request }) => {
  await request.post(`${fixture}/rest/v1/lesson_progress?on_conflict=member_id,lesson_id`, { data: [{ member_id: freeId, lesson_id: welcome }, { member_id: freeId, lesson_id: force }] })
  await page.goto('/comunidad/rutas?ruta=empezar')
  await expect(page.getByText(/Disponible en \d+ días/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continuar esta ruta', exact: true })).toHaveCount(0)
  await expect(page.locator('a[href*="/primera-rutina-fuerza"]')).toHaveCount(0)
  await expect(page.getByText('Texto de prueba que no debe mostrarse antes del desbloqueo')).toHaveCount(0)
  const resource = page.getByRole('link', { name: /Abrir planificador semanal/ })
  await expect(resource).toHaveAttribute('href', '/community/resources/planificador-semanal-tiroides.pdf')
})

test('completed routes can be reviewed without restarting and unavailable lessons are explicit', async ({ page, request }) => {
  await request.patch(`${fixture}/rest/v1/lessons?id=eq.${routine}`, { data: { drip_days: 0 } })
  try {
    await request.post(`${fixture}/rest/v1/lesson_progress?on_conflict=member_id,lesson_id`, { data: [welcome, force, routine].map(lesson_id => ({ member_id: freeId, lesson_id })) })
    await page.goto('/comunidad/rutas?ruta=empezar')
    await expect(page.getByRole('heading', { name: 'Has completado las lecturas de esta ruta' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Continuar esta ruta', exact: true })).toHaveCount(0)
    await page.goto('/comunidad/rutas?ruta=organizar')
    await expect(page.getByText('Esta lectura no está disponible ahora.')).toHaveCount(2)
    expect((await page.goto('/comunidad/rutas?ruta=invalid'))?.status()).toBe(404)
  } finally { await request.patch(`${fixture}/rest/v1/lessons?id=eq.${routine}`, { data: { drip_days: 9999 } }) }
})
