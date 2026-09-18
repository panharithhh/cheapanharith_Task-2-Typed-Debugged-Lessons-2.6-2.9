import puppeteer from 'puppeteer-core'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function generate() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  const htmlPath = `file://${path.join(__dirname, 'submission.html')}`
  await page.goto(htmlPath, { waitUntil: 'networkidle0' })

  await page.pdf({
    path: path.join(__dirname, 'submission.pdf'),
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '12mm',
      right: '12mm',
    },
  })

  await browser.close()
  console.log('Successfully generated submission.pdf!')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
