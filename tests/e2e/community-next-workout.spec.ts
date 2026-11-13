import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'
import { getWorkoutWeek } from '../../src/lib/community-workout-week'

test.beforeEach(async ({ page, context, request }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo servicios y cuentas ficticios locales')
  await request.post('http://127.0.0.1:54329/__workout-failure', { data: { mode: '' } })
  await context.route('https://**/*', route => route.abort())
  await context.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
  await fixtureSession(context, 'free')
  await page.goto('/comunidad/mi-semana')
})

test('home follows saved plans: empty, today, future and past days', async ({ page }) => {
  test.setTimeout(90_000)
  const week = getWorkoutWeek()
  const today = week.dates.indexOf(week.today)
  async function saveDay(day: number | null) {
    await page.goto('/comunidad/mi-semana')
    const plan = page.locator('#sesiones')
    await plan.locator('summary').click()
    const selects = plan.getByRole('combobox')
    for (let index = 0; index < 7; index++) await selects.nth(index).selectOption(index === day ? 'mancuernas' : '')
    const save = plan.getByRole('button', { name: 'Guardar días y sesiones' })
    if (await save.isEnabled()) {
      await save.click()
      await expect(plan.getByRole('status')).toHaveText('Planificación guardada en tu cuenta.')
    }
    await page.goto('/comunidad')
  }
  await saveDay(null)
  const next = page.getByRole('region', { name: 'Reserva tu próxima sesión', exact: true })
  await expect(next).toBeVisible()
  await next.getByRole('link', { name: 'Organizar mis días en Mi semana', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Tus sesiones de esta semana', exact: true })).toBeInViewport()
  await saveDay(today)
  const card = page.getByRole('region', { name: 'Tu sesión prevista para hoy', exact: true })
  await expect(card).toBeVisible()
  await expect(card.locator('time')).toHaveAttribute('datetime', week.today)
  await expect(card).toContainText('En casa con mancuernas')
  await card.getByRole('link', { name: 'Abrir mi sesión reservada', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'En casa con mancuernas', exact: true })).toBeInViewport()
  if (today < 6) {
    await saveDay(today + 1)
    const future = page.getByRole('region', { name: 'Tu próxima sesión reservada', exact: true })
    await expect(future.locator('time')).toHaveAttribute('datetime', week.dates[today + 1])
  }
  if (today > 0) {
    await saveDay(today - 1)
    const past = page.getByRole('region', { name: 'Revisa tu planificación', exact: true })
    await expect(past).toContainText('no damos por hecho que hayas entrenado')
    await expect(past.getByRole('link', { name: 'Abrir mi sesión reservada' })).toHaveCount(0)
  }
  await saveDay(null)
  await expect(next).toBeVisible()
})

test('calendar read failure leaves the home and planning link available', async ({ page, request }) => {
  await request.post('http://127.0.0.1:54329/__workout-failure', { data: { mode: 'all' } })
  try {
    await page.goto('/comunidad')
    const fallback = page.getByRole('region', { name: 'Tu planificación, a mano', exact: true })
    await expect(fallback).toContainText('No podemos mostrar tus días ahora')
    await expect(fallback.getByRole('link', { name: 'Organizar mis días en Mi semana', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hola, Ana')
  } finally {
    await request.post('http://127.0.0.1:54329/__workout-failure', { data: { mode: '' } })
  }
})
