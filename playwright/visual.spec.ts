import { test, expect } from '@playwright/test'

test.describe('Portfolio Visual Regression', () => {
  test('homepage loading screen', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    const screenshot = await page.screenshot({ path: 'playwright/screenshots/loading.png' })
    expect(screenshot).toBeTruthy()
  })

  test('homepage after loading', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)
    const screenshot = await page.screenshot({ path: 'playwright/screenshots/home.png', fullPage: true })
    expect(screenshot).toBeTruthy()
  })

  test('myworks page', async ({ page }) => {
    await page.goto('/myworks')
    await page.waitForTimeout(1000)
    const screenshot = await page.screenshot({ path: 'playwright/screenshots/myworks.png', fullPage: true })
    expect(screenshot).toBeTruthy()
  })

  test('play page', async ({ page }) => {
    await page.goto('/play')
    await page.waitForTimeout(1000)
    const screenshot = await page.screenshot({ path: 'playwright/screenshots/play.png', fullPage: true })
    expect(screenshot).toBeTruthy()
  })
})
