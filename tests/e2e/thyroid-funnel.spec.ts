import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/funnel/tiroides/event', (route) => route.fulfill({ status: 204 }))
  await page.addInitScript(() => {
    localStorage.setItem('wr_cookie_consent', 'rejected')
    localStorage.setItem('wr_lead_submitted', '1')
  })
})

test('el test conduce desde la portada hasta un resultado accionable', async ({ page }) => {
  await page.route('**/api/test-tiroides', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        leadId: 'lead-e2e',
        result: {
          profile: 'falta_estructura',
          intent: 'recomponer',
          requiresMedicalReview: false,
          emoji: '🟡',
          title: 'Tienes piezas sueltas: toca ordenarlas',
          summary: 'Resultado de prueba del recorrido.',
          priorities: ['Fuerza progresiva', 'Hábitos sostenibles', 'Seguimiento'],
          nextStep: 'Empieza por una estructura que puedas sostener.',
          cta: {
            label: 'Entrar en la comunidad gratis',
            href: '/comunidad/entrar',
            description: 'Continúa con el siguiente paso.',
          },
        },
      }),
    })
  })

  await page.goto('/tiroides')
  await page.getByRole('button', { name: 'Empezar mi test' }).click()

  for (let step = 0; step < 8; step += 1) {
    await page.getByTestId('thyroid-option').first().click()
  }

  await page.getByLabel('Nombre').fill('Prueba WellnessReal')
  await page.getByLabel('Email', { exact: true }).fill('prueba@example.com')
  await page.getByRole('button', { name: 'Ver mis prioridades' }).click()

  await expect(page.getByText('Tu resultado personalizado')).toBeVisible()
  await expect(page.getByRole('heading', { name: /Tienes piezas sueltas/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Entrar en la comunidad gratis' })).toBeVisible()
})

test('la solicitud obliga a completar los campos esenciales', async ({ page }) => {
  await page.goto('/metodo-tiroides#solicitud')
  await page.getByRole('button', { name: 'Solicitar mi plaza' }).click()

  await expect(page.getByLabel('Nombre')).toBeFocused()
  await expect(page.getByLabel('Nombre')).toHaveAttribute('required', '')
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('type', 'email')
  await expect(page.getByLabel('Teléfono')).toHaveAttribute('type', 'tel')
})
