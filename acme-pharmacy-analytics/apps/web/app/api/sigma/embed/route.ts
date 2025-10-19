import { NextRequest, NextResponse } from 'next/server'
import { generateSigmaEmbedUrl, validateSigmaCredentials } from '@/lib/sigma'

/**
 * Sigma Embed API Route
 *
 * This server-side API endpoint generates JWT-signed Sigma embed URLs
 * to securely embed Sigma dashboards in your application.
 *
 * POST /api/sigma/embed
 *
 * Request Body:
 * {
 *   "workbookUrl": "https://app.sigmacomputing.com/...",
 *   "userEmail": "user@example.com",
 *   "userAttributes": { "client_id": "123" }
 * }
 *
 * Response:
 * {
 *   "embedUrl": "https://app.sigmacomputing.com/...?:jwt=..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate credentials first
    const credCheck = validateSigmaCredentials()
    if (!credCheck.valid) {
      return NextResponse.json(
        { error: credCheck.error },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { workbookUrl, userEmail, userAttributes, externalUserId, accountType, teamIds } = body

    if (!workbookUrl) {
      return NextResponse.json(
        { error: 'workbookUrl is required' },
        { status: 400 }
      )
    }

    // Generate the JWT-signed embed URL
    const embedUrl = generateSigmaEmbedUrl({
      workbookUrl,
      userEmail,
      userAttributes,
      externalUserId,
      accountType,
      teamIds
    })

    return NextResponse.json({
      embedUrl,
      expiresIn: 3600 // 1 hour
    })
  } catch (error) {
    console.error('Error generating Sigma embed URL:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate embed URL' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check API status
 */
export async function GET() {
  const credCheck = validateSigmaCredentials()

  return NextResponse.json({
    status: credCheck.valid ? 'configured' : 'not_configured',
    error: credCheck.error,
    message: credCheck.valid
      ? 'Sigma API is configured and ready'
      : 'Sigma API credentials not configured. Set SIGMA_CLIENT_ID and SIGMA_CLIENT_SECRET environment variables.'
  })
}
