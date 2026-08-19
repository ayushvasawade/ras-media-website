import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const LEADS_SECRET_KEY = process.env.LEADS_SECRET_KEY || 'ras_media_private_leads_key_2026'

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

const CSV_HEADER_ROW = CSV_HEADERS.map((h) => `"${h}"`).join(',') + '\n'

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const queryKey = event.queryStringParameters?.key
  const authHeader = event.headers['authorization'] || event.headers['Authorization']
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  const providedKey = bearerToken || queryKey

  // Strictly verify authorization secret
  if (!providedKey || providedKey !== LEADS_SECRET_KEY) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Unauthorized: Invalid or missing authorization token' }),
    }
  }

  try {
    const store = getStore({ name: 'ras_leads', consistency: 'strong' })
    const cloudCsv = await store.get('campaign_leads.csv', { type: 'text' })

    const csvData = cloudCsv && cloudCsv.trim() ? cloudCsv : CSV_HEADER_ROW

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="campaign_leads.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
      body: csvData,
    }
  } catch (error) {
    console.error('[Export Error]:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to retrieve campaign leads' }),
    }
  }
}
