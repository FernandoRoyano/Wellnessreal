import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const publicPages = ['/tiroides', '/metodo-tiroides'] as const

test.beforeEach(async ({ page }) => {
  await page.route('**/api/funnel/tiroides/event', (route) => route.fulfill({ status: 204 }))
  await page.addInitScript(() => {
    localStorage.setItem('wr_cookie_consent', 'rejected')
    localStorage.setItem('wr_lead_submitted', '1')
  })
})

for (const path of publicPages) {
  test(`${path} cumple WCAG 2.1 AA sin infracciones automáticas`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('main')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
}
