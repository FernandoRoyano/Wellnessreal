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
  await page.getByRole('button', { name: 'Ver mis prioridades y recibir la guía' }).click()

  await expect(page.getByText('Orientación según tus respuestas')).toBeVisible()
  await expect(page.getByRole('heading', { name: /Tienes piezas sueltas/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Entrar en la comunidad gratis' })).toBeVisible()
})

test('antes de abrir solicitudes se muestra la lista prioritaria', async ({ page }) => {
  await page.route('**/api/tiroides-priority', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, leadId: 'lead-priority-e2e' }),
    })
  )
  await page.goto('/metodo-tiroides#solicitud')
  await expect(page.getByRole('heading', { name: 'Recibe primero la apertura' })).toBeVisible()
  await page.getByLabel('Nombre').fill('Prueba WellnessReal')
  await page.getByLabel('Email', { exact: true }).fill('prueba@example.com')
  await page.getByRole('button', { name: 'Entrar en la lista prioritaria' }).click()

  await expect(page.getByRole('heading', { name: 'Estás en la lista prioritaria' })).toBeVisible()
})

test('la clase gratuita conserva contenido útil cuando no hay vídeo configurado', async ({ page }) => {
  await page.route('**/api/tiroides-clase', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, leadId: 'lead-clase-e2e' }),
    })
  )

  await page.goto('/tiroides/clase')
  await page.getByLabel('Tu nombre').fill('Prueba WellnessReal')
  await page.getByLabel('Tu mejor email').fill('prueba@example.com')
  await page.getByRole('button', { name: 'Ver la clase gratuita' }).click()

  await expect(page).toHaveURL(/\/tiroides\/clase\/video$/)
  await expect(page.getByText('Clase disponible en formato práctico')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'No decidas entre hacerlo todo o no hacer nada.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Conocer Método BASE Tiroides' }).first()).toBeVisible()
})

test('la valoración individual se completa en un único formulario', async ({ page }) => {
  await page.route('**/api/valoracion', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  )

  await page.goto('/valoracion')
  await page.getByLabel('Nombre').fill('Prueba WellnessReal')
  await page.getByLabel('Email', { exact: true }).fill('prueba@example.com')
  await page.getByLabel('Teléfono').fill('600000000')
  await page.getByLabel('Objetivo principal').selectOption('mejorar-salud')
  await page.getByLabel('Experiencia entrenando').selectOption('principiante')
  await page.getByLabel('¿Qué quieres conseguir?').fill('Quiero ganar fuerza y construir una rutina que pueda mantener cada semana.')
  await page.getByLabel('Días por semana').selectOption('2 días')
  await page.getByLabel('Tiempo por sesión').selectOption('45 min')
  await page.getByRole('button', { name: 'Enviar solicitud de valoración' }).click()

  await expect(page).toHaveURL(/\/gracias-valoracion$/)
})

test('la confirmación de pago no se muestra sin una sesión de Stripe', async ({ page }) => {
  await page.goto('/metodo-tiroides/pago-confirmado')

  await expect(page).toHaveURL(/\/metodo-tiroides\?payment=unverified$/)
  await expect(page.getByText('Pago verificado. Empezamos.')).toHaveCount(0)
})
