import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'

test.beforeEach(async ({ page, context }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Requiere proveedores y datos locales ficticios')
  await page.route('https://**/*', route => route.abort())
  await page.addInitScript(() => localStorage.setItem('wr_cookie_consent_v2', 'rejected'))
  await fixtureSession(context, 'free')
})

test('bienvenida, lección práctica, planificación y siguiente visita forman un recorrido', async ({ page }) => {
  await page.goto('/comunidad')
  await expect(page.getByRole('link', { name: '1. Lee la bienvenida' })).toHaveAttribute('href', '/comunidad/empieza-aqui/lee-esto-primero')
  await expect(page.getByRole('link', { name: '2. Lee «Por qué empezar con fuerza»' })).toHaveAttribute('href', '/comunidad/entrena-organizate/por-que-empezar-con-fuerza')
  const resource = page.getByRole('link', { name: '3. Abre el planificador y reserva un momento posible' })
  await expect(resource).toHaveAttribute('href', '/community/resources/planificador-semanal-tiroides.pdf')
  expect((await page.request.get('/community/resources/planificador-semanal-tiroides.pdf')).status()).toBe(200)
  await page.getByRole('link', { name: 'Empezar por la bienvenida', exact: true }).click()
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.getByRole('button', { name: /Lección completada/ })).toBeVisible()
  await page.getByRole('link', { name: 'Leer mi primera lección de fuerza' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Por qué empezar con fuerza')
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.getByRole('button', { name: /Lección completada/ })).toBeVisible()
  await page.getByRole('link', { name: 'Volver a Mi semana' }).click()
  await expect(page.getByText('Estás al día', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /Reserva un momento posible/ })).toHaveAttribute('href', '/community/resources/planificador-semanal-tiroides.pdf')
  await page.goto('/comunidad')
  await expect(page.getByRole('heading', { name: 'Estás al día con tus lecciones disponibles' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continuar mi aprendizaje', exact: true })).toHaveCount(0)
  await page.screenshot({ path: `tmp/free-journey-${test.info().project.name}.png`, fullPage: true })
})
