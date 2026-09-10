import { test, expect } from '@playwright/test'

const BASE = '/personal_portfolio'
const WAIT_AFTER_LOAD = 7000

test.describe('Portfolio Visual Checks', () => {
  test('capture loading screen', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(500)
    await expect(page.locator('.loaderGame')).toBeVisible()
    await page.screenshot({ path: 'playwright/screenshots/01-loading.png' })
  })

  test('capture homepage after loading', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await page.waitForSelector('.header', { timeout: 30000 })
    await page.screenshot({ path: 'playwright/screenshots/02-home.png', fullPage: true })
  })

  test('capture myworks page', async ({ page }) => {
    await page.goto(BASE + '/myworks')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'playwright/screenshots/03-myworks.png', fullPage: true })
  })

  test('capture play page', async ({ page }) => {
    await page.goto(BASE + '/play')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'playwright/screenshots/04-play.png', fullPage: true })
  })

  test('homepage has landing intro', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    const h1 = await page.locator('.landing-intro h1').first().textContent()
    expect(h1).toContain('AHSAN')
  })

  test('homepage has whatIDO section', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    await expect(page.locator('#whatIDO, .whatIDO, [id*="whatIDO"]').first()).toBeVisible()
  })

  test('homepage has career section', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    await expect(page.locator('#career, .career-section, [id*="career"]').first()).toBeVisible()
  })

  test('homepage has work section', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    await expect(page.locator('#work, .work-section, [id*="work"]').first()).toBeVisible()
  })

  test('homepage has techstack section', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    await expect(page.locator('#techstack, .techstack-new, [id*="techstack"]').first()).toBeVisible()
  })

  test('homepage has contact section', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    await expect(page.locator('#contact, .contact-section, [id*="contact"]').first()).toBeVisible()
  })

  test('homepage has social icons', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForTimeout(WAIT_AFTER_LOAD)
    await expect(page.locator('.socialIcons, .social-icons, [id*="social"]').first()).toBeVisible()
  })
})
