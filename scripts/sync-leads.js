/**
 * RAS Media — Lead Synchronization Script
 * 
 * Synchronizes persistent campaign leads from the deployed Netlify environment
 * directly into your local PC destination: C:\RAS_MEDIA\data\campaign_leads.csv
 * 
 * Usage:
 *   node scripts/sync-leads.js
 *   (or: npm run sync-leads)
 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const LOCAL_DESTINATION_DIR = 'C:\\RAS_MEDIA\\data'
const LOCAL_DESTINATION_FILE = path.join(LOCAL_DESTINATION_DIR, 'campaign_leads.csv')

// Site URL: Can be configured via SITE_URL env or fallback to localhost
const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const LEADS_SECRET_KEY = process.env.LEADS_SECRET_KEY || 'ras_media_private_leads_key_2026'

function fetchWithRedirects(targetUrl, headers, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects'))
    }

    const client = targetUrl.startsWith('https') ? https : http
    const urlObj = new URL(targetUrl)

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        ...headers,
        'User-Agent': 'RAS-Media-Sync-Tool/1.0',
      },
    }

    const req = client.request(options, (res) => {
      // Handle redirects (301, 302, 307, 308)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `${urlObj.origin}${redirectUrl}`
        }
        res.resume() // Discard data
        return resolve(fetchWithRedirects(redirectUrl, headers, maxRedirects - 1))
      }

      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body })
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function syncLeads() {
  console.log('──────────────────────────────────────────────────')
  console.log('🔄 RAS MEDIA — LEADS SYNCHRONIZATION')
  console.log('──────────────────────────────────────────────────')
  console.log(`📡 Remote Source: ${SITE_URL}/api/campaign/export/`)
  console.log(`📁 Local Destination: ${LOCAL_DESTINATION_FILE}`)

  // Ensure local directory exists
  if (!fs.existsSync(LOCAL_DESTINATION_DIR)) {
    fs.mkdirSync(LOCAL_DESTINATION_DIR, { recursive: true })
    console.log(`✓ Created local directory: ${LOCAL_DESTINATION_DIR}`)
  }

  const exportUrl = `${SITE_URL}/api/campaign/export/`
  const headers = {
    'Authorization': `Bearer ${LEADS_SECRET_KEY}`,
  }

  console.log('📥 Fetching latest persistent CSV data...')

  try {
    const res = await fetchWithRedirects(exportUrl, headers)

    if (res.statusCode !== 200) {
      console.error(`❌ Sync Failed: Remote returned status ${res.statusCode}`)
      console.error('Response:', res.body)
      return
    }

    fs.writeFileSync(LOCAL_DESTINATION_FILE, res.body, { encoding: 'utf8' })
    const lines = res.body.trim().split('\n')
    const leadCount = Math.max(0, lines.length - 1)

    console.log('──────────────────────────────────────────────────')
    console.log(`✅ SYNC SUCCESSFUL!`)
    console.log(`📊 Total Leads in CSV: ${leadCount}`)
    console.log(`💾 Saved to: ${LOCAL_DESTINATION_FILE}`)
    console.log('──────────────────────────────────────────────────')
  } catch (err) {
    console.error('❌ Network error during sync:', err.message)
  }
}

syncLeads()
