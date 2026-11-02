import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/funnel/tiroides/event', (route) => route.fulfill({ status: 204 }))
  await page.addInitScript(() => {
    localStorage.setItem('wr_cookie_consent_v2', 'rejected')
    localStorage.setItem('wr_lead_submitted', '1')
  })
})

test('la descarga abre el formulario directamente y mantiene el test opcional', async ({ page }) => {
  await page.goto('/tiroides?recurso=guia#test')
  await expect(page.getByRole('heading', { name: 'Llévate la guía gratis' })).toBeVisible()
  await expect(page.getByLabel('Nombre', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Prefiero hacer el test' }).click()
  await expect(page.getByRole('button', { name: 'Empezar mi test' })).toBeVisible()
})

test('el error conserva los datos y permite reintentar hasta obtener la descarga', async ({ page }) => {
  let attempts = 0
  await page.route('**/api/newsletter', (route) => {
    attempts += 1
    return route.fulfill({
      status: attempts === 1 ? 500 : 200,
      contentType: 'application/json',
      body: JSON.stringify(attempts === 1 ? { error: 'Error guardando' } : { success: true }),
    })
  })
  await page.goto('/tiroides?recurso=guia#test')
  await page.getByLabel('Nombre', { exact: true }).fill('Prueba')
  await page.getByLabel('Email', { exact: true }).fill('test@example.com')
  await page.getByRole('button', { name: 'Descargar la guía gratis' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'Hubo un problema' })).toBeVisible()
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('test@example.com')
  await page.getByRole('button', { name: 'Descargar la guía gratis' }).click()
  await expect(page).toHaveURL(/\/gracias-tiroides$/)
  await expect(page.getByRole('link', { name: 'Descargar guía gratis', exact: true })).toHaveAttribute('href', '/tiroides.pdf')
})

test('la entrada habitual sigue mostrando el test', async ({ page }) => {
  await page.goto('/tiroides')
  await expect(page.getByRole('button', { name: 'Empezar mi test' })).toBeVisible()
})
