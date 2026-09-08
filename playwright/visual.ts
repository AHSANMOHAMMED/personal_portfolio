import { chromium } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotsDir = path.join(__dirname, 'screenshots')

async function takeScreenshots() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  // Start dev server
  const { spawn } = await import('child_process')
  const server = spawn('npm', ['run', 'dev'], { stdio: 'inherit' })

  try {
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Loading screen
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(screenshotsDir, '01-loading.png') })

    // Homepage after loading
    await page.waitForTimeout(4000)
    await page.screenshot({ path: path.join(screenshotsDir, '02-home.png'), fullPage: true })

    // MyWorks page
    await page.goto('http://localhost:3000/myworks')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.join(screenshotsDir, '03-myworks.png'), fullPage: true })

    // Play page
    await page.goto('http://localhost:3000/play')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.join(screenshotsDir, '04-play.png'), fullPage: true })

    console.log('Screenshots saved to', screenshotsDir)
  } finally {
    await browser.close()
    server.kill()
  }
}

takeScreenshots().catch(console.error)
