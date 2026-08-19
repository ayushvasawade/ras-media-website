import fs from 'fs'
import path from 'path'
import { getStore } from '@netlify/blobs'

export interface LeadRecord {
  fullName: string
  companyName: string
  workEmail: string
  phone?: string
  campaignName?: string
  need?: string
  budget?: string
  timeline?: string
  website?: string
  brief: string
  message?: string
}

export const CSV_HEADERS = [
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

/**
 * Escapes a field according to RFC 4180 CSV specifications.
 */
function escapeCsvField(field: string | undefined | null): string {
  if (field === undefined || field === null) return '""'
  const str = String(field).trim()
  // If field contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

/**
 * Formats a LeadRecord into a CSV line.
 */
function formatLeadToCsvRow(lead: LeadRecord, timestamp: string = new Date().toISOString()): string {
  const fields = [
    timestamp,
    lead.fullName,
    lead.companyName,
    lead.workEmail,
    lead.phone || '',
    lead.campaignName || '',
    lead.need || '',
    lead.budget || '',
    lead.timeline || '',
    lead.website || '',
    lead.brief,
    lead.message || '',
  ]

  return fields.map(escapeCsvField).join(',')
}

const CSV_HEADER_ROW = CSV_HEADERS.map(escapeCsvField).join(',') + '\n'

/**
 * Appends a lead to local filesystems (C:\RAS_MEDIA\data\campaign_leads.csv and ./data/campaign_leads.csv).
 */
function appendToLocalCsv(row: string): { pcPathSuccess: boolean; projectPathSuccess: boolean } {
  let pcPathSuccess = false
  let projectPathSuccess = false

  // 1. Primary User PC path: C:\RAS_MEDIA\data\campaign_leads.csv
  try {
    const pcDir = 'C:\\RAS_MEDIA\\data'
    const pcFilePath = path.join(pcDir, 'campaign_leads.csv')

    if (!fs.existsSync(pcDir)) {
      fs.mkdirSync(pcDir, { recursive: true })
    }

    if (!fs.existsSync(pcFilePath)) {
      fs.writeFileSync(pcFilePath, CSV_HEADER_ROW, { encoding: 'utf8' })
    }

    fs.appendFileSync(pcFilePath, row + '\n', { encoding: 'utf8' })
    pcPathSuccess = true
  } catch (err) {
    // Expected to fail if running in cloud Linux/Netlify environment where C:\ does not exist
  }

  // 2. Project data path: <project_root>/data/campaign_leads.csv (outside /public)
  try {
    const projectDir = path.join(process.cwd(), 'data')
    const projectFilePath = path.join(projectDir, 'campaign_leads.csv')

    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true })
    }

    if (!fs.existsSync(projectFilePath)) {
      fs.writeFileSync(projectFilePath, CSV_HEADER_ROW, { encoding: 'utf8' })
    }

    fs.appendFileSync(projectFilePath, row + '\n', { encoding: 'utf8' })
    projectPathSuccess = true
  } catch (err) {
    console.error('[LeadsStorage] Failed writing to project data directory:', err)
  }

  return { pcPathSuccess, projectPathSuccess }
}

/**
 * Appends a lead to Netlify Blobs persistent cloud store.
 */
async function appendToNetlifyBlobs(row: string): Promise<boolean> {
  try {
    const store = getStore({
      name: 'ras_leads',
      consistency: 'strong',
    })

    const existingData = await store.get('campaign_leads.csv', { type: 'text' })

    let updatedCsv = ''
    if (!existingData || existingData.trim() === '') {
      updatedCsv = CSV_HEADER_ROW + row + '\n'
    } else {
      // Ensure existing data ends with newline before appending
      const trimmed = existingData.endsWith('\n') ? existingData : existingData + '\n'
      updatedCsv = trimmed + row + '\n'
    }

    await store.set('campaign_leads.csv', updatedCsv)
    return true
  } catch (err) {
    console.warn('[LeadsStorage] Netlify Blobs not accessible or running in standalone mode:', err)
    return false
  }
}

/**
 * Master Lead Persistence Function.
 * Guarantees data is saved to all available persistent layers (PC path, Local project data, Netlify Blobs).
 */
export async function persistLead(lead: LeadRecord): Promise<{
  success: boolean
  storedLocally: boolean
  storedInNetlifyBlob: boolean
  timestamp: string
}> {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  const csvRow = formatLeadToCsvRow(lead, timestamp)

  // 1. Save to local storage targets
  const localResult = appendToLocalCsv(csvRow)
  const storedLocally = localResult.pcPathSuccess || localResult.projectPathSuccess

  // 2. Save to persistent cloud store (Netlify Blobs)
  const storedInNetlifyBlob = await appendToNetlifyBlobs(csvRow)

  return {
    success: storedLocally || storedInNetlifyBlob,
    storedLocally,
    storedInNetlifyBlob,
    timestamp,
  }
}

/**
 * Reads the latest persistent CSV data (from local or Netlify Blobs).
 */
export async function getLatestLeadsCsv(): Promise<string> {
  // Try Netlify Blobs first in production
  try {
    const store = getStore({ name: 'ras_leads', consistency: 'strong' })
    const cloudCsv = await store.get('campaign_leads.csv', { type: 'text' })
    if (cloudCsv && cloudCsv.trim()) {
      return cloudCsv
    }
  } catch (err) {
    // Fall back to local file
  }

  // Check C:\RAS_MEDIA\data\campaign_leads.csv
  try {
    const pcFilePath = 'C:\\RAS_MEDIA\\data\\campaign_leads.csv'
    if (fs.existsSync(pcFilePath)) {
      return fs.readFileSync(pcFilePath, 'utf8')
    }
  } catch (err) {}

  // Check ./data/campaign_leads.csv
  try {
    const projectFilePath = path.join(process.cwd(), 'data', 'campaign_leads.csv')
    if (fs.existsSync(projectFilePath)) {
      return fs.readFileSync(projectFilePath, 'utf8')
    }
  } catch (err) {}

  return CSV_HEADER_ROW
}
