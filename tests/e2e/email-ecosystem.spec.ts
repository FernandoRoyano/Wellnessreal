import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'

test.beforeEach(async ({ page }) => {
  await page.route('https://**/*', route => route.abort())
})

test('una primera visita desde un anuncio elige cookies antes de guardar su campaña', async ({ page, context }) => {
  await page.goto('/comunidad/entrar?utm_source=meta&utm_medium=paid_social&utm_campaign=community_intro&utm_content=resource_a&code=secret&email=private@example.com&fbclid=private-click')
  const banner = page.getByRole('region', { name: 'Aviso de cookies' })
  await expect(banner).toBeVisible()
  await expect(banner.locator('.surface-card-accent')).toHaveCSS('background-color', 'rgb(22, 18, 43)')
  expect((await context.cookies()).find(cookie => cookie.name === 'wr_attr')).toBeUndefined()
  await banner.getByRole('button', { name: 'Aceptar todas' }).click()
  await expect(banner).toHaveCount(0)
  await expect.poll(async () => (await context.cookies()).find(cookie => cookie.name === 'wr_attr')?.value).toContain('community_intro')
  const attribution = (await context.cookies()).find(cookie => cookie.name === 'wr_attr')?.value ?? ''
  expect(attribution).not.toMatch(/secret|private|fbclid/)
  await expect(page.getByLabel('Email de acceso')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('el miembro guarda una elección comercial separada con su email verificado', async ({ page, context, request }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo miembros y servicios ficticios')
  await fixtureSession(context, 'free')
  await page.addInitScript(() => localStorage.setItem('wr_cookie_consent_v2', 'rejected'))
  await page.goto('/comunidad')
  const email = page.getByLabel('Email para la newsletter')
  await expect(email).toHaveValue('free@example.com')
  await expect(email).toHaveAttribute('readonly', '')
  const consent = page.getByRole('checkbox', { name: /Quiero recibir ideas prácticas/ })
  await expect(consent).not.toBeChecked()
  await page.getByRole('button', { name: 'Suscribirme' }).click()
  await expect(page.getByText('Preferencia guardada.')).toHaveCount(0)
  await consent.check()
  await page.getByRole('button', { name: 'Suscribirme' }).click()
  await expect(page.getByText('Preferencia guardada. Tu acceso a la comunidad sigue igual.')).toBeVisible()
  const writes = await (await request.get('http://127.0.0.1:54329/__writes')).json() as { table: string; rows?: { email: string; form_data: { marketing_consent: { accepted: boolean; sync_status: string } } }[] }[]
  const row = writes.filter(write => write.table === 'leads').flatMap(write => write.rows ?? []).find(lead => lead.email === 'free@example.com')
  expect(row?.form_data.marketing_consent.accepted).toBe(true)
  expect(row?.form_data.marketing_consent.sync_status).toBe('held')
})

test('una clienta con acceso no puede incorporarse a las invitaciones mediante la API', async ({ context }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo clienta ficticia')
  await fixtureSession(context, 'paid')
  const response = await context.request.post('/api/newsletter', { data: { email: 'paid@example.com', _source: 'community', marketingConsent: true } })
  expect(response.status()).toBe(409)
})
