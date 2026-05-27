/**
 * Local PDF Export Service
 *
 * A lightweight Express server that owns a long-lived Chromium browser instance
 * and exposes a POST /api/export endpoint to generate PDFs from the normalized
 * render model via the app's dedicated print route.
 */
import express from 'express'
import cors from 'cors'
import puppeteer, { type Browser } from 'puppeteer'

const PORT = Number(process.env.EXPORT_PORT) || 3001
const APP_URL = process.env.APP_URL || 'http://localhost:5173'

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.connected) {
    console.log('[export] Launching browser...')
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
      ],
    })
    console.log('[export] Browser launched')
  }
  return browser
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

let exportInProgress = false

app.post('/api/export', async (req, res) => {
  if (exportInProgress) {
    console.log('[export] Rejected: export already in progress')
    res.status(429).json({
      error: 'An export task is already running. Please wait and try again.',
    })
    return
  }

  exportInProgress = true
  const startTime = Date.now()
  const { model, filename = 'resume.pdf' } = req.body

  if (!model) {
    exportInProgress = false
    res.status(400).json({ error: "Missing 'model' in request body" })
    return
  }

  console.log(`[export] Starting export: ${filename}`)

  try {
    const b = await getBrowser()
    const page = await b.newPage()

    // Capture console from the browser page for debugging
    page.on('console', (msg) => {
      console.log(`[export:page] ${msg.type()}: ${msg.text()}`)
    })
    page.on('pageerror', (err) => {
      console.error(`[export:page] PAGE ERROR: ${err.message}`)
    })

    // Navigate to the print route
    const printUrl = `${APP_URL}/print`
    console.log(`[export] Navigating to ${printUrl}...`)
    await page.goto(printUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
    console.log(
      `[export] Page loaded (${Date.now() - startTime}ms). Injecting model...`,
    )

    // Inject the render model into the page
    await page.evaluate((modelData) => {
      ;(window as unknown as Record<string, unknown>).__RESUME_MODEL__ =
        modelData
      window.dispatchEvent(new CustomEvent('resume-model-ready'))
    }, model)
    console.log(`[export] Model injected (${Date.now() - startTime}ms)`)

    // Wait for the app to signal export readiness (with extended timeout)
    console.log('[export] Waiting for __RESUME_EXPORT_READY__...')
    await page.waitForFunction(
      () =>
        (window as unknown as Record<string, unknown>)
          .__RESUME_EXPORT_READY__ === true,
      { timeout: 20000, polling: 100 },
    )
    console.log(
      `[export] Export ready signal received (${Date.now() - startTime}ms)`,
    )

    // Wait for fonts to settle
    await page.evaluate(() => document.fonts.ready)

    // Small extra delay for final layout stabilization
    await new Promise((r) => setTimeout(r, 300))

    // Generate PDF
    console.log(`[export] Generating PDF...`)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    await page.close()

    const elapsed = Date.now() - startTime
    console.log(
      `[export] ✓ PDF generated (${pdf.length} bytes, ${elapsed}ms total)`,
    )

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(Buffer.from(pdf))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown export error'
    console.error(
      `[export] ✗ Export failed (${Date.now() - startTime}ms): ${message}`,
    )
    res.status(500).json({ error: message })
  } finally {
    exportInProgress = false
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', browserConnected: browser?.connected ?? false })
})

app.listen(PORT, () => {
  console.log(`📄 PDF export service running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) await browser.close()
  process.exit(0)
})
process.on('SIGTERM', async () => {
  if (browser) await browser.close()
  process.exit(0)
})
