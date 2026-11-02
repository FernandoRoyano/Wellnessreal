import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('la portada cabe a 320px y el aviso no desplaza el contenido al hidratar', async ({ page, context }) => {
  await page.setViewportSize({ width: 320, height: 812 })
  await page.addInitScript(() => {
    const audit = window as typeof window & { auditCls: number }
    audit.auditCls = 0
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!shift.hadRecentInput) audit.auditCls += shift.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto('/')
  await expect(page.getByRole('region', { name: 'Aviso de cookies' })).toBeVisible()
  const heading = await page.locator('h1').boundingBox()
  expect(heading?.x).toBeGreaterThanOrEqual(0)
  expect((heading?.x ?? 0) + (heading?.width ?? 0)).toBeLessThanOrEqual(320)
  expect(await page.evaluate(() => (window as typeof window & { auditCls: number }).auditCls)).toBeLessThanOrEqual(0.1)
  await page.getByRole('button', { name: 'Solo esenciales' }).click()
  await page.getByRole('link', { name: 'Busco entrenamiento personalizado' }).click({ trial: true })
  expect((await context.cookies()).some(cookie => cookie.name === 'wr_attr')).toBe(false)
  await page.reload()
  await expect(page.getByRole('region', { name: 'Aviso de cookies' })).toHaveCount(0)
})

test('la atribución necesita aceptación y se borra al retirarla', async ({ page, context }) => {
  await page.goto('/?utm_source=test&utm_campaign=consent')
  expect((await context.cookies()).some(cookie => cookie.name === 'wr_attr')).toBe(false)
  await page.getByRole('button', { name: 'Aceptar todas' }).click()
  await expect.poll(async () => (await context.cookies()).some(cookie => cookie.name === 'wr_attr')).toBe(true)
  await page.evaluate(() => window.dispatchEvent(new Event('wr-open-cookie-settings')))
  await page.getByRole('button', { name: 'Solo esenciales' }).click()
  expect((await context.cookies()).some(cookie => cookie.name === 'wr_attr')).toBe(false)
})

test('Meta encola una visita al aceptar y otra al navegar, sin duplicados', async ({ page }) => {
  await page.route('https://connect.facebook.net/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }))
  await page.goto('/')
  await page.getByRole('button', { name: 'Aceptar todas' }).click()
  const visits = () => page.evaluate(() => {
    const tracker = window.fbq as ((...args: unknown[]) => void) & { queue?: IArguments[] }
    return tracker?.queue?.filter(args => args[0] === 'trackSingle' && args[2] === 'PageView').length ?? 0
  })
  await expect.poll(visits).toBe(1)
  await page.reload()
  await expect.poll(visits).toBe(1)
  await page.locator('footer a[href="/sobre-mi"]').first().click()
  await expect.poll(visits).toBe(2)
})

test('el blog pagina y conserva categoría sin errores de hidratación', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/blog')
  await expect(page.locator('article')).toHaveCount(12)
  await page.getByRole('button', { name: 'Solo esenciales' }).click()
  await page.getByRole('button', { name: 'Tiroides y entrenamiento', exact: true }).click()
  await expect(page).toHaveURL(/categoria=/)
  const count = await page.locator('article').count()
  expect(count).toBeGreaterThan(0)
  expect(count).toBeLessThanOrEqual(12)
  await page.reload()
  await expect(page.locator('article')).toHaveCount(count)
  expect(errors).toEqual([])
})

test('los relacionados mantienen el tema y el CTA cumple contraste AA', async ({ page }) => {
  await page.goto('/blog/gluten-e-hipotiroidismo')
  await page.getByRole('button', { name: 'Solo esenciales' }).click()
  const related = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Artículos relacionados' }) })
  await expect(related.locator('article')).toHaveCount(3)
  await expect(related.locator('article').first()).toContainText('Tiroides')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})

test('la generación anónima no acepta ningún origen y el cuestionario exige acceso', async ({ request }, testInfo) => {
  for (const origen of ['general', 'metodo-tiroides', 'admin-tiroides']) {
    const response = await request.post('/api/generar-programa', { headers: { 'x-forwarded-for': `audit-${testInfo.project.name}-${origen}` }, data: { origen, nombre: 'Prueba', email: 'audit@example.com', objetivo_principal: 'Organizar entrenamiento', privacy_consent: true } })
    expect([401, 503]).toContain(response.status())
    expect(await response.text()).not.toContain('token')
  }
  const response = await request.get('/cuestionario?origen=metodo-tiroides', { maxRedirects: 0 })
  expect(response.status()).toBe(307)
  expect(response.headers().location).toContain('/comunidad/entrar')
})
