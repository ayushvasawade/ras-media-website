import { NextResponse } from 'next/server'
import { getLatestLeadsCsv } from '@/lib/leads-storage'

// Secret key for authenticating lead sync/export (defaults to project fallback if not set)
const LEADS_SECRET_KEY = process.env.LEADS_SECRET_KEY || 'ras_media_private_leads_key_2026'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const queryKey = searchParams.get('key')
    const authHeader = request.headers.get('Authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    const providedKey = bearerToken || queryKey

    // Strictly verify authorization secret
    if (!providedKey || providedKey !== LEADS_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing authorization token' },
        { status: 401 }
      )
    }

    const csvData = await getLatestLeadsCsv()

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="campaign_leads.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[RAS Media Export Error]:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve campaign leads' },
      { status: 500 }
    )
  }
}
