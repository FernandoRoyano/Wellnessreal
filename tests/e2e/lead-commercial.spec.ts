import { expect, test } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', quiet: true })

const contact = {
  id: 'demo', email: 'demo@example.com', name: 'Contacto de ejemplo', phone: null,
  source: 'guia', status: 'cliente', tags: ['via:guia'], notes: null, form_data: null,
  utm_source: null, utm_medium: null, utm_campaign: null, landing_page: '/recurso-gratis',
  created_at: '2026-10-01T10:00:00Z', updated_at: '2026-10-01T10:00:00Z', contacted_at: null, converted_at: null,
}

test.beforeEach(async ({ page, baseURL }) => {
  test.skip(!baseURL || !['127.0.0.1', 'localhost'].includes(new URL(baseURL).hostname), 'Prueba con datos simulados solo en local')
  const response = await page.request.post('/api/admin/auth', { data: { password: process.env.ADMIN_PASSWORD } })
  expect(response.ok()).toBeTruthy()
  await page.addInitScript(() => localStorage.setItem('wr_cookie_consent_v2', 'rejected'))
  await page.route('**/api/admin/leads?*', route => route.fulfill({ json: {
    leads: [contact], hasMore: false,
    stats: { total: 1, commercial: { opportunities: 0, subscribers: 0, tests: 0, unreviewed: 1, conversations: 0, proposals: 0, paid: 0, legacyCustomers: 1, byChannel: [] } },
  } }))
})

test('el histórico no aparece como venta y el pago requiere confirmación', async ({ page }) => {
  let confirmed = false
  await page.route('**/api/admin/leads/demo', async route => {
    const payload = route.request().postDataJSON()
    confirmed = payload.confirmPayment === true
    await route.fulfill(confirmed
      ? { status: 200, json: { lead: { ...contact, tags: ['crm:tipo:oportunidad', 'crm:fase:pagado'] } } }
      : { status: 400, json: { error: 'Confirma que has verificado el pago antes de registrarlo.' } })
  })
  await page.goto('/admin/leads')
  await expect(page.getByText('Hay 1 registros', { exact: false })).toBeVisible()
  await expect(page.getByText('Sin atribución', { exact: true })).toBeVisible()
  await page.getByText('Contacto de ejemplo', { exact: true }).click()
  await page.getByLabel('Tipo de contacto', { exact: true }).last().selectOption('oportunidad')
  await page.getByLabel('Fase comercial').selectOption('pagado')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toHaveText('Confirma que has verificado el pago antes de registrarlo.')
  await expect(page.getByRole('heading', { name: 'Detalle del lead' })).toBeVisible()
  await page.getByRole('checkbox', { name: /He comprobado que el pago/ }).check()
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByRole('heading', { name: 'Detalle del lead' })).toHaveCount(0)
  expect(confirmed).toBe(true)
})

test('un error al guardar mantiene la ficha y sus cambios', async ({ page }) => {
  await page.route('**/api/admin/leads/demo', route => route.fulfill({ status: 409, json: { error: 'El contacto ha cambiado. Recarga antes de guardar.' } }))
  await page.goto('/admin/leads')
  await page.getByText('Contacto de ejemplo', { exact: true }).click()
  await page.getByLabel('Tipo de contacto', { exact: true }).last().selectOption('prueba')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toHaveText('El contacto ha cambiado. Recarga antes de guardar.')
  await expect(page.getByLabel('Tipo de contacto', { exact: true }).last()).toHaveValue('prueba')
})
