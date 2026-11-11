import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'
import { getCommunityWeeklyPlan } from '../../src/lib/community-weekly-plan'

test.beforeEach(async ({ page }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo proveedores y datos locales ficticios')
  await page.route('https://**/*', route => route.abort())
  await page.addInitScript(() => {
    localStorage.setItem('wr_cookie_consent_v2', 'rejected')
    localStorage.setItem('wr_lead_submitted', '1')
  })
})

test('weekly proposal and BASE example preserve free access and editable participation', async ({ page, context }) => {
  await fixtureSession(context, 'free')
  await page.goto('/comunidad')
  const weekly = page.getByRole('region', { name: 'Una lectura, una acción y una pregunta.' })
  await expect(weekly.locator('article')).toHaveCount(2)
  await expect(weekly).toContainText('recursos ya disponibles')
  const invitation = page.getByRole('region', { name: 'Acompañamiento de Método BASE' })
  await invitation.locator('summary').click()
  await expect(invitation).toContainText('Ejemplo didáctico')
  await expect(invitation).toContainText('BASE es de pago')
  await expect(invitation).toContainText('Seguir aprendiendo gratis')
  const posts: string[] = []
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()) })
  await weekly.getByRole('link', { name: 'Preparar una respuesta en el foro' }).first().click()
  await expect(page).toHaveURL(/\/comunidad\/preguntas-apoyo\?pregunta=/, { timeout: 15_000 })
  await expect(page.getByLabel('Título del tema')).not.toHaveValue('')
  await expect(page.getByLabel('Tu idea o pregunta (opcional)')).toHaveValue('')
  await page.getByLabel('Título del tema').fill('Una pregunta de organización')
  expect(posts).toHaveLength(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
})

test('unrecognized prompt stays closed and paid members retain their program', async ({ page, context }) => {
  await fixtureSession(context, 'paid')
  await page.goto('/comunidad/preguntas-apoyo?pregunta=untrusted')
  await expect(page.getByLabel('Título del tema')).toHaveCount(0)
  await page.getByRole('button', { name: '¿Qué idea has podido aplicar?', exact: true }).click()
  await expect(page.getByLabel('Título del tema')).toHaveValue('¿Qué idea has podido aplicar?')
  await page.goto('/comunidad')
  await expect(page.getByRole('link', { name: 'Ir a mi programa' })).toHaveAttribute('href', '/comunidad/metodo-base-tiroides')
  await expect(page.locator('summary').filter({ hasText: 'Ver un ejemplo de qué añade BASE' })).toHaveCount(0)
})

test('the calendar respects a future lesson unlock at a narrow viewport', async ({ page, context, request }) => {
  const topic = getCommunityWeeklyPlan()[0]
  const endpoint = `http://127.0.0.1:54329/rest/v1/lessons?slug=eq.${topic.lesson}`
  const rows = await (await request.get(endpoint)).json() as { drip_days: number }[]
  if (rows.length) {
    await request.patch(endpoint, { data: { drip_days: 9999 } })
  } else {
    await request.post('http://127.0.0.1:54329/rest/v1/lessons', { data: { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', space_id: '11111111-2222-4111-8111-111111111111', slug: topic.lesson, title: 'Lectura futura del calendario', content: 'Contenido que sigue bloqueado', access_tier: 'free', published: true, drip_days: 9999, sort_order: 3 } })
  }
  try {
    await fixtureSession(context, 'free')
    await page.setViewportSize({ width: 320, height: 780 })
    await page.goto('/comunidad')
    const current = page.getByRole('region', { name: 'Una lectura, una acción y una pregunta.' }).locator('article').first()
    await expect(current).toContainText(/La lectura se abre para ti en \d+ días/)
    await expect(current.locator(`a[href="/comunidad/${topic.space}/${topic.lesson}"]`)).toHaveCount(0)
    await expect(current.getByRole('link', { name: /Abrir.*PDF/ })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  } finally {
    await request.patch(endpoint, { data: rows.length ? { drip_days: rows[0].drip_days } : { published: false } })
  }
})
