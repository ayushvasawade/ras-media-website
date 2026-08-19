import { NextResponse } from 'next/server'
import { persistLead, LeadRecord } from '@/lib/leads-storage'

export interface CampaignInquiryPayload extends LeadRecord {}

export async function POST(request: Request) {
  try {
    const body: CampaignInquiryPayload = await request.json()

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
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    // Persist lead to C:\RAS_MEDIA\data\campaign_leads.csv, project data store, and Netlify Blobs
    const persistenceResult = await persistLead(body)

    console.log('[RAS Media Lead Saved]:', {
      timestamp: persistenceResult.timestamp,
      fullName: body.fullName,
      company: body.companyName,
      email: body.workEmail,
      storedLocally: persistenceResult.storedLocally,
      storedInNetlifyBlob: persistenceResult.storedInNetlifyBlob,
    })

    return NextResponse.json({
      success: true,
      message: 'Thanks — your campaign brief has been received. We’ll be in touch shortly.',
    })
  } catch (error) {
    console.error('[RAS Media Campaign Inquiry Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing inquiry' },
      { status: 500 }
    )
  }
}
