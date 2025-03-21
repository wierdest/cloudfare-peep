import puppeteer from 'puppeteer'
import fs from 'fs'

function log(data) {
    fs.appendFileSync('peeps.txt', data + '\n', 'utf-8')
}

async function peep() {
    console.log('Starting our engines!!!')
    
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.setRequestInterception(true)
    
    page.on('request', (request) => {
        if (request.url().includes("cloudflare")) {
            const logData = `Cloudflare Request URL: ${request.url()}\nRequest Headers: ${JSON.stringify(request.headers(), null, 2)}\n`
            log(logData)
        }
        request.continue()
    });

    page.on('response', async (response) => {
        if (response.url().includes("cloudflare")) {
            const contentType = response.headers()['content-type']
            let logData = `Cloudflare Response URL: ${response.url()}\n`

            if (contentType.includes('application/json')) {
                const jsonResponse = await response.json()
                logData += `Response JSON Payload: ${JSON.stringify(jsonResponse, null, 2)}\n`
            } else if (contentType.includes('text/html')) {
                const textResponse = await response.text()
                logData += `Response HTML Payload: ${textResponse}\n`
            }

            log(logData) 
        }
    });

    await page.goto("https://community.cloudflare.com/t/how-to-know-my-website-is-protecting-with-cloudflare/439565")

    await new Promise(resolve => setTimeout(resolve, 10000))

    console.log('We got PEEEPS!! Bye!')
    await browser.close();
}

peep();
