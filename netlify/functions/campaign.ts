import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const CSV_HEADERS = [
  'Timestamp',
  'Full Name',
  'Company Name',
  'Work Email',
  'Phone',
  'Campaign / Project Name',
  'Service',
  'Budget',
  'Timeline',
  'Website / Social Link',
  'Project Brief',
  'Additional Message',
]

function escapeCsvField(field: any): string {
  if (field === undefined || field === null) return '""'
  const str = String(field).trim()
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

const CSV_HEADER_ROW = CSV_HEADERS.map(escapeCsvField).join(',') + '\n'

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Missing request body' }),
      }
    }

    const body = JSON.parse(event.body)
    const errors: Record<string, string> = {}

    if (!body.fullName || !body.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!body.companyName || !body.companyName.trim()) {
      errors.companyName = 'Company name is required'
    }

    if (!body.workEmail || !body.workEmail.trim()) {
      errors.workEmail = 'Work email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.workEmail.trim())) {
      errors.workEmail = 'Please provide a valid email address'
    }

    if (!body.need || !body.need.trim()) {
      errors.need = 'Please select what you need'
    }

    if (!body.brief || !body.brief.trim()) {
      errors.brief = 'Project / campaign brief is required'
    }

    if (Object.keys(errors).length > 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, errors }),
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    const rowFields = [
      timestamp,
      body.fullName,
      body.companyName,
      body.workEmail,
      body.phone || '',
      body.campaignName || '',
      body.need || '',
      body.budget || '',
      body.timeline || '',
      body.website || '',
      body.brief,
      body.message || '',
    ]

    const csvRow = rowFields.map(escapeCsvField).join(',')

    // Append to Netlify Blobs persistent store
    try {
      const store = getStore({ name: 'ras_leads', consistency: 'strong' })
      const existing = await store.get('campaign_leads.csv', { type: 'text' })

      let updated = ''
      if (!existing || existing.trim() === '') {
        updated = CSV_HEADER_ROW + csvRow + '\n'
      } else {
        const trimmed = existing.endsWith('\n') ? existing : existing + '\n'
        updated = trimmed + csvRow + '\n'
      }

      await store.set('campaign_leads.csv', updated)
    } catch (blobErr) {
      console.warn('[Netlify Blobs Error]:', blobErr)
    }

    console.log('[Lead Received & Persisted]:', {
      timestamp,
      fullName: body.fullName,
      company: body.companyName,
      email: body.workEmail,
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Thanks — your campaign brief has been received. We’ll be in touch shortly.',
      }),
    }
  } catch (err) {
    console.error('[Campaign Handler Error]:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    }
  }
}
