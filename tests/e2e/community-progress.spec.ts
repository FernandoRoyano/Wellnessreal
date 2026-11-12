import { expect, test } from '@playwright/test'
import { fixtureSession } from '../fixtures/community-session'

const fixture = 'http://127.0.0.1:54329'
const freeId = '30000000-0000-4000-8000-000000000000'
const paidId = '40000000-0000-4000-8000-000000000000'
const welcome = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const privateLesson = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const lessonRoute = '/comunidad/empieza-aqui/lee-esto-primero'

test.beforeEach(async ({ page, context, request }) => {
  test.skip(process.env.COMMUNITY_LOCAL_FIXTURE !== '1', 'Solo servicios locales ficticios')
  await request.post(`${fixture}/__progress-failure`, { data: { fail: false } })
  await request.delete(`${fixture}/rest/v1/lesson_progress`)
  await context.route('https://**/*', route => route.abort())
  await context.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
  await fixtureSession(context, 'free')
  await page.goto(lessonRoute)
})

test('completion follows the account into a new browser, never a different account', async ({ page, browser, request }) => {
  await page.locator('form.lesson-completion').evaluate((form, memberId) => {
    const input = document.createElement('input'); input.name = 'member_id'; input.value = memberId; form.append(input)
  }, paidId)
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.getByRole('button', { name: /Lección completada/ })).toBeVisible()
  const otherDevice = await browser.newContext()
  try {
    await otherDevice.route('https://**/*', route => route.abort())
    await otherDevice.addInitScript(() => { localStorage.setItem('wr_cookie_consent_v2', 'rejected'); localStorage.setItem('wr_lead_submitted', '1') })
    await fixtureSession(otherDevice, 'free')
    const secondPage = await otherDevice.newPage()
    await secondPage.goto(lessonRoute)
    await expect(secondPage.getByRole('button', { name: /Lección completada/ })).toBeVisible()
    await fixtureSession(otherDevice, 'paid')
    await secondPage.reload()
    await expect(secondPage.getByRole('button', { name: /Marcar como completada/ })).toBeVisible()
    await fixtureSession(otherDevice, 'free')
    await secondPage.reload()
    await secondPage.getByRole('button', { name: /Lección completada/ }).click()
    await expect(secondPage.getByRole('button', { name: /Marcar como completada/ })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: /Marcar como completada/ })).toBeVisible()
    expect(await (await request.get(`${fixture}/rest/v1/lesson_progress?member_id=eq.${paidId}`)).json()).toEqual([])
  } finally { await otherDevice.close() }
})

test('old marks need confirmation and cannot import a locked lesson or create retrospective events', async ({ page, context, request }) => {
  await context.addCookies([{ name: 'wr_lesson_progress', value: JSON.stringify([welcome, privateLesson, 'invalid']), domain: '127.0.0.1', path: '/comunidad' }])
  await page.goto('/comunidad')
  await expect(page.getByText('0 de 2 lecciones disponibles', { exact: true })).toBeVisible()
  const prompt = page.getByRole('complementary', { name: 'Marcas antiguas de este navegador' })
  await expect(prompt).toBeVisible()
  await prompt.locator('summary').click()
  await expect(prompt).toContainText('Lee esto antes que nada')
  await expect(prompt).not.toContainText('Lección privada de prueba')
  await request.post(`${fixture}/__progress-failure`, { data: { fail: true } })
  await prompt.getByRole('button', { name: 'Son mías: añadir a mi cuenta' }).click()
  await expect(prompt.getByRole('alert')).toContainText('Se conservan en este navegador')
  expect(await (await request.get(`${fixture}/rest/v1/lesson_progress`)).json()).toEqual([])
  await request.post(`${fixture}/__progress-failure`, { data: { fail: false } })
  await prompt.getByRole('button', { name: 'Son mías: añadir a mi cuenta' }).click()
  await expect(prompt).toHaveCount(0)
  await expect(page.getByText('1 de 2 lecciones disponibles', { exact: true })).toBeVisible()
  const rows = await (await request.get(`${fixture}/rest/v1/lesson_progress?member_id=eq.${freeId}`)).json() as { lesson_id: string }[]
  expect(rows.map(row => row.lesson_id)).toEqual([welcome])
  expect(await (await request.get(`${fixture}/rest/v1/thyroid_funnel_events?event_name=eq.community_first_lesson_completed`)).json()).toEqual([])
  const cookie = (await context.cookies()).find(item => item.name === 'wr_lesson_progress')
  expect(JSON.parse(decodeURIComponent(cookie!.value))).toEqual([privateLesson])
})

test('failed writes are visible, roll back the optimistic mark and can be retried', async ({ page, request }) => {
  await request.post(`${fixture}/__progress-failure`, { data: { fail: true } })
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.locator('form.lesson-completion').getByRole('alert')).toContainText('No se ha podido guardar tu avance')
  await expect(page.getByRole('button', { name: /Marcar como completada/ })).toBeVisible()
  expect(await (await request.get(`${fixture}/rest/v1/lesson_progress`)).json()).toEqual([])
  await request.post(`${fixture}/__progress-failure`, { data: { fail: false } })
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.getByRole('button', { name: /Lección completada/ })).toBeVisible()
})

test('a forged lesson target cannot bypass access checks', async ({ page, request }) => {
  await page.locator('input[name="completed"]').evaluate(input => { (input as HTMLInputElement).value = 'invalid' })
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.locator('form.lesson-completion').getByRole('alert')).toContainText('No se ha podido identificar')
  await page.reload()
  await page.locator('form.lesson-completion input[name="lesson_id"]').evaluate((input, id) => { (input as HTMLInputElement).value = id }, privateLesson)
  await page.getByRole('button', { name: /Marcar como completada/ }).click()
  await expect(page.locator('form.lesson-completion').getByRole('alert')).toContainText('No tienes acceso a esta lección')
  expect(await (await request.get(`${fixture}/rest/v1/lesson_progress`)).json()).toEqual([])
})
