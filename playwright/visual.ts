import { chromium } from '@playwright/test'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotsDir = path.join(__dirname, 'screenshots')

async function takeScreenshots() {
  console.log('Starting screenshot capture...')

  // Build the site
  console.log('Building site...')
  const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' })
  await new Promise((resolve, reject) => {
    build.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Build failed with code ${code}`))))
  })

  // Start static server
  console.log('Starting server...')
  const server = spawn('npx', ['serve@latest', 'out'], { stdio: 'inherit' })

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log('Launching browser...')
    const browser = await chromium.launch()
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()

    // Loading screen
    console.log('Capturing loading screen...')
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(screenshotsDir, '01-loading.png') })

    // Homepage after loading
    console.log('Capturing homepage...')
    await page.waitForTimeout(4000)
    await page.screenshot({ path: path.join(screenshotsDir, '02-home.png'), fullPage: true })

    // MyWorks page
    console.log('Capturing myworks...')
    await page.goto('http://localhost:3000/myworks')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.join(screenshotsDir, '03-myworks.png'), fullPage: true })

    // Play page
    console.log('Capturing play page...')
    await page.goto('http://localhost:3000/play')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.join(screenshotsDir, '04-play.png'), fullPage: true })

    await browser.close()
    console.log('Screenshots saved to', screenshotsDir)
  } finally {
    server.kill()
  }
}

takeScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err)
  process.exit(1)
})
