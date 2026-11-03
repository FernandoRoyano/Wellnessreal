import { test, expect } from '@playwright/test'

for (const path of ['/comunidad/aprende-tiroides', '/comunidad/aprende-tiroides/como-funciona-la-tiroides']) {
  test(`un enlace compartido conserva su destino al pedir acceso: ${path}`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveURL(/\/comunidad\/entrar\?next=/)
    expect(new URL(page.url()).searchParams.get('next')).toBe(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}
