import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'

test.beforeEach(async ({ page }) => {
  await page.route('https://**/*', route => route.abort())
  await page.addInitScript(() => {
    localStorage.setItem('wr_cookie_consent_v2', 'rejected')
    localStorage.setItem('wr_lead_submitted', '1')
  })
})

test('portada y menú priorizan comunidad y conservan el programa', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aprende a entrenar y organizar tus hábitos cuando tu energía cambia.')
  const hero = page.locator('main section').first()
  await expect(hero.getByRole('link', { name: 'Entrar gratis a la comunidad' })).toHaveAttribute('href', '/comunidad/entrar')
  await expect(hero.getByRole('link', { name: 'Conocer Método BASE Tiroides' })).toHaveAttribute('href', '/metodo-tiroides')
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Entrar gratis a la comunidad' })).toBeVisible()
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('el acceso conserva confirmación, reintento y límites sin suscribir a campañas', async ({ page }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Requiere el servicio local; no solicita correos reales')
  await page.goto('/comunidad/entrar')
  await expect(page.getByText(/La suscripción a ideas y ofertas/)).toBeVisible()
  await page.getByLabel('Email de acceso').fill('access@example.com')
  await page.getByRole('button', { name: 'Recibir mi enlace de acceso' }).click()
  await expect(page.getByRole('heading', { name: 'Revisa tu correo' })).toBeVisible()
  await page.getByRole('button', { name: 'Volver a pedir el enlace o corregir mi email' }).click()
  await page.getByLabel('Email de acceso').fill('limit@example.com')
  await page.getByRole('button', { name: 'Recibir mi enlace de acceso' }).click()
  await expect(page.getByRole('alert').filter({ hasText: /espera|límite/i })).toBeVisible()
  await expect(page.getByLabel('Email de acceso')).toHaveValue('limit@example.com')
})

test('miembro gratuito: primer paso, progreso y contenido de pago protegido', async ({ page, context }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Usa miembros ficticios locales')
  await fixtureSession(context, 'free')
  await page.goto('/comunidad/entrar?next=/comunidad')
  await expect(page).toHaveURL(/\/comunidad$/)
  await expect(page.getByRole('heading', { name: 'Empieza aquí: una primera visita útil' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver cómo funciona Método BASE' })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /Quiero recibir ideas prácticas/ })).not.toBeChecked()
  await page.getByRole('link', { name: '2. Abre tu primera lección' }).click()
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.getByRole('button', { name: /Lección completada/ })).toBeVisible()
  await expect.poll(async () => (await context.cookies()).find(cookie => cookie.name === 'wr_lesson_progress')?.value).toContain('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
  await page.goto('/comunidad')
  await expect(page.getByRole('heading', { name: 'Empieza aquí: una primera visita útil' })).toHaveCount(0)
  const privateResponse = await page.goto('/comunidad/metodo-base-tiroides/privada')
  expect(privateResponse?.status()).toBe(404)
  await expect(page.getByText('Contenido premium reservado.')).toHaveCount(0)
})

test('clienta actual encuentra su programa y no vuelve a recibir la invitación de compra', async ({ page, context }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Usa una clienta ficticia local')
  await fixtureSession(context, 'paid')
  await page.goto('/comunidad')
  await expect(page.getByRole('heading', { name: 'Tu Método BASE, a mano.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ir a mi programa', exact: true })).toHaveAttribute('href', '/comunidad/metodo-base-tiroides')
  await expect(page.getByRole('link', { name: 'Ver cómo funciona Método BASE' })).toHaveCount(0)
  await expect(page.getByRole('checkbox', { name: /Quiero recibir ideas prácticas/ })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('la solicitud desde la comunidad llega al registro comercial sin pagos ni correos reales', async ({ page, request }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo servicios locales ficticios')
  await page.goto('/metodo-tiroides?origen=comunidad#solicitud')
  await page.getByLabel('Nombre', { exact: true }).fill('Ana Prueba Local')
  await page.getByLabel('Email', { exact: true }).fill('application-fixture@example.com')
  await page.getByLabel(/Teléfono/).fill('+34 600 000 000')
  await page.getByLabel(/conseguir/).fill('Quiero organizar dos sesiones de fuerza por semana y progresar con seguimiento.')
  await page.getByLabel(/días/).selectOption('2')
  await page.getByRole('button', { name: 'Solicitar mi plaza' }).click()
  await expect(page.getByRole('heading', { name: 'Solicitud recibida' })).toBeVisible()
  const writes = await (await request.get('http://127.0.0.1:54329/__writes')).json() as { table: string; method: string; rows?: { email: string; phone: string; form_data: { origin: string } }[] }[]
  const lead = writes.filter(write => write.table === 'leads' && write.method === 'POST').flatMap(write => write.rows ?? []).find(row => row.email === 'application-fixture@example.com')
  expect(lead?.phone).toBe('+34 600 000 000')
  expect(lead?.form_data.origin).toBe('community')
})
