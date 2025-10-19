'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, ExternalLink } from 'lucide-react'

interface SigmaEmbedProps {
  workbookUrl: string
  userEmail?: string
  userAttributes?: Record<string, any>
  height?: string
  title?: string
  subtitle?: string
  showControls?: boolean
}

/**
 * Sigma Computing Dashboard Embedding Component
 *
 * This component securely embeds Sigma dashboards using JWT-signed URLs.
 *
 * Features:
 * - JWT-based authentication for secure embedding
 * - Row-level security via userAttributes
 * - Automatic token refresh
 * - Loading and error states
 * - Responsive iframe sizing
 *
 * Setup Required:
 * 1. Generate Sigma embed credentials (Client ID + Secret) in Sigma admin
 * 2. Add credentials to environment variables:
 *    - SIGMA_CLIENT_ID
 *    - SIGMA_CLIENT_SECRET
 * 3. Enable embedding for your workbook in Sigma
 * 4. Copy the public embed URL from Sigma
 *
 * Usage:
 * ```tsx
 * <SigmaEmbed
 *   workbookUrl="https://app.sigmacomputing.com/embed/1-xxxxx"
 *   userEmail="user@acme.com"
 *   userAttributes={{ client_id: "ACME" }}
 *   title="Executive Dashboard"
 * />
 * ```
 */
export function SigmaEmbed({
  workbookUrl,
  userEmail = 'demo@acme.com',
  userAttributes = {},
  height = '800px',
  title,
  subtitle,
  showControls = true
}: SigmaEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSigmaDashboard() {
      try {
        setLoading(true)
        setError(null)

        // Call backend API to get JWT-signed URL
        const response = await fetch('/api/sigma/embed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workbookUrl,
            userEmail,
            userAttributes,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to load Sigma dashboard')
        }

        const data = await response.json()
        setEmbedUrl(data.embedUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        console.error('Sigma embed error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSigmaDashboard()

    // Refresh token every 50 minutes (tokens expire after 1 hour)
    const refreshInterval = setInterval(loadSigmaDashboard, 50 * 60 * 1000)
    return () => clearInterval(refreshInterval)
  }, [workbookUrl, userEmail, userAttributes])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading Sigma dashboard...</p>
            <p className="text-sm text-gray-500 mt-2">Generating secure embed URL</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    const isConfigError = error.includes('not configured') || error.includes('credentials')

    return (
      <div className="bg-white rounded-lg border border-red-200 p-8">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium mb-2">
                {isConfigError ? 'Sigma API Not Configured' : 'Error Loading Dashboard'}
              </p>
              <p className="text-red-600 text-sm mb-4">{error}</p>

              {isConfigError && (
                <div className="bg-white bg-opacity-50 rounded p-4 text-sm text-red-900 space-y-2">
                  <p className="font-semibold">Setup Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to Sigma Admin → Account → API & Embed Secrets</li>
                    <li>Generate new embed credentials (Client ID + Secret)</li>
                    <li>Add to your .env file:
                      <pre className="mt-2 bg-gray-900 text-white p-2 rounded text-xs overflow-x-auto">
{`SIGMA_CLIENT_ID="your-client-id"
SIGMA_CLIENT_SECRET="your-client-secret"`}
                      </pre>
                    </li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}

              {!isConfigError && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {showControls && (
            <a
              href={workbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-900 font-medium"
            >
              Open in Sigma
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
      <div className="relative" style={{ height }}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            title={title || 'Sigma Dashboard'}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No dashboard URL available</p>
          </div>
        )}
      </div>
      {showControls && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
          <span>Powered by Sigma Computing</span>
          <span className="text-gray-500">Auto-refreshes every 50 minutes</span>
        </div>
      )}
    </div>
  )
}
