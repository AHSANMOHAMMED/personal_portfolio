import { test, expect } from '@playwright/test'

test.describe('Portfolio Visual Checks', () => {
  test('loading screen appears', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    await expect(page.locator('.loaderGame')).toBeVisible()
  })

  test('loading completes and main content shows', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('navbar is visible', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await expect(page.locator('.header')).toBeVisible()
  })

  test('landing section has name', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await expect(page.locator('.landing-intro h1')).toContainText('AHSAN')
  })

  test('whatIDO section exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    const html = await page.content()
    expect(html).toContain('whatIDO')
  })

  test('career section exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    const html = await page.content()
    expect(html).toContain('career')
  })

  test('work section exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    const html = await page.content()
    expect(html).toContain('work')
  })

  test('techstack section exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    const html = await page.content()
    expect(html).toContain('techstack')
  })

  test('contact section exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    const html = await page.content()
    expect(html).toContain('contact')
  })

  test('icons section exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)
    const html = await page.content()
    expect(html).toContain('social')
  })

  test('myworks page loads', async ({ page }) => {
    await page.goto('/myworks')
    await page.waitForTimeout(1000)
    await expect(page.locator('body')).toBeVisible()
  })

  test('play page loads', async ({ page }) => {
    await page.goto('/play')
    await page.waitForTimeout(1000)
    await expect(page.locator('body')).toBeVisible()
  })
})
