import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'

test.beforeEach(async ({ page, context }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo servicios y cuentas ficticios locales')
  await context.route('https://**/*', route => route.abort())
  await context.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted','1') })
  await fixtureSession(context, 'free')
  await page.goto('/comunidad/ejercicios')
})

test('search leads to a complete illustrated exercise with the requested common variants', async ({ page }) => {
  await expect(page.locator('article')).toHaveCount(7)
  await page.getByLabel('Buscar ejercicio, músculo o variante').fill('fondos')
  await expect(page.locator('article')).toHaveCount(1)
  await page.locator('article').getByRole('link').click()
  await expect(page).toHaveURL(/\/ejercicios\/flexiones$/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Flexiones en suelo')
  await expect(page.getByRole('heading', { name: 'Apoyo de pies', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Apoyo de rodillas', exact: true })).toBeVisible()
  const image = page.locator('figure img')
  await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect(page.getByRole('link', { name: /^Ampliar ilustración/ })).toHaveAttribute('target', '_blank')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
})

test('material controls fold after selection and empty searches can be cleared', async ({ page }) => {
  await page.locator('summary').filter({ hasText: 'Material:' }).click()
  await page.getByLabel('Material de alguna de las variantes').selectOption('mancuernas')
  await expect(page.getByLabel('Material de alguna de las variantes')).toBeHidden()
  await expect(page.locator('summary').filter({ hasText: 'Material:' })).toContainText('Mancuernas')
  await page.getByLabel('Buscar ejercicio, músculo o variante').fill('zancadas')
  await expect(page.locator('article')).toHaveCount(1)
  await page.getByLabel('Buscar ejercicio, músculo o variante').fill('no-existe')
  await expect(page.getByRole('heading', { name: 'No hay fichas que coincidan' })).toBeVisible()
  await page.getByRole('button', { name: 'Ver todos los ejercicios' }).click()
  await expect(page.locator('article')).toHaveCount(7)
})

test('all seven exercise pages and images work and unknown slugs return 404', async ({ page, request }) => {
  for (const slug of ['sentadilla', 'sentadilla-barra', 'zancadas', 'flexiones', 'peso-muerto', 'dominadas', 'remos']) {
    expect((await page.goto(`/comunidad/ejercicios/${slug}`))?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: 'Músculos implicados', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cómo realizarlo', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Variantes habituales', exact: true })).toBeVisible()
    expect((await request.get(`/community/exercises/${slug}-v1.webp`)).status()).toBe(200)
  }
  expect((await page.goto('/comunidad/ejercicios/unknown'))?.status()).toBe(404)
})
