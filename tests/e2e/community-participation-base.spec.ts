import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'
import { THYROID_PROGRAM } from '../../src/lib/metodo-tiroides'

test.beforeEach(async ({ context }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo servicios y cuentas ficticios locales')
  await context.route('https://**/*', route => route.abort())
  await context.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
  await fixtureSession(context, 'free')
})

test('a first lesson prepares an optional editable response without publishing', async ({ page }) => {
  await page.goto('/comunidad/empieza-aqui/lee-esto-primero')
  const invitation = page.getByRole('region', { name: '¿Qué idea te gustaría probar esta semana?', exact: true })
  await expect(invitation).toContainText('Una frase es suficiente')
  const writes: string[] = []
  page.on('request', request => { if (request.method() === 'POST') writes.push(request.url()) })
  await invitation.getByRole('link', { name: 'Preparar mi respuesta en el foro', exact: true }).click()
  await expect(page.getByLabel('Título del tema')).toHaveValue('¿Qué idea te gustaría probar esta semana?')
  await expect(page.getByLabel('Tu idea o pregunta (opcional)')).toHaveValue('')
  await page.getByLabel('Título del tema').fill('Voy a preparar mi material')
  await expect(page.getByLabel('Título del tema')).toHaveValue('Voy a preparar mi material')
  await expect(page.getByText('Participar es opcional.', { exact: false })).toBeVisible()
  expect(writes).toHaveLength(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
})

test('BASE explains fit, scope, total cost and application before any payment', async ({ page }) => {
  await page.goto('/comunidad')
  const offer = page.getByRole('region', { name: 'Acompañamiento de Método BASE', exact: true })
  await offer.locator('summary').click()
  await expect(offer).toContainText('dos revisiones individuales')
  await expect(offer).toContainText('no implica pago ni confirma una plaza')
  await expect(offer).toContainText(`${THYROID_PROGRAM.price} €`)
  await expect(offer).toContainText(`${THYROID_PROGRAM.installmentCount * THYROID_PROGRAM.installmentPrice} € en total`)
  await offer.getByRole('link', { name: 'Consultar condiciones y preparar mi solicitud', exact: true }).click()
  await expect(page).toHaveURL(/\/metodo-tiroides\?origen=comunidad#solicitud-formulario$/)
  await expect(page.locator('#solicitud-formulario')).toContainText('Cuéntame desde dónde empiezas')
  await expect(page.getByText('No hay ningún cobro en este formulario.', { exact: false })).toBeVisible()
})

test('old member offer uses the same scope and paid members keep their private entry', async ({ page, context }) => {
  await page.goto('/comunidad/asesoria')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Método BASE Tiroides')
  await expect(page.getByRole('heading', { name: 'Contenido y directos privados' })).toBeVisible()
  await expect(page.getByText('Directo conmigo cada semana (60 min)', { exact: true })).toHaveCount(0)
  await page.goto('/comunidad/recorrido')
  await expect(page.getByRole('link', { name: 'Ver programa y solicitud', exact: true })).toHaveAttribute('href', '/metodo-tiroides?origen=comunidad')
  await fixtureSession(context, 'paid')
  await page.goto('/comunidad')
  const paid = page.getByRole('region', { name: 'Tu programa', exact: true })
  await expect(paid.getByRole('link', { name: 'Ir a mi programa', exact: true })).toHaveAttribute('href', '/comunidad/metodo-base-tiroides')
  await expect(paid.locator('summary')).toHaveCount(0)
})
