'use client'

import { useState, useEffect } from 'react'

interface HexEmbedProps {
  projectId: string
  userAttributes?: Record<string, any>
  height?: string
  title?: string
  subtitle?: string
}

/**
 * Hex Dashboard Embedding Component
 *
 * This component demonstrates how to embed Hex dashboards using their Embed API.
 *
 * Implementation Notes:
 * 1. Requires server-side API route to call Hex's createPresignedUrl endpoint
 * 2. Uses single-use presigned URLs for security
 * 3. Supports row-level security via userAttributes
 *
 * Setup Required:
 * 1. Enable "Allow signed embedding" in Hex project settings
 * 2. Create Workspace token with "Create embedded links" scope
 * 3. Implement /api/hex/embed endpoint (server-side)
 *
 * Example API endpoint implementation:
 *
 * ```typescript
 * // app/api/hex/embed/route.ts
 * import { NextRequest, NextResponse } from 'next/server'
 *
 * export async function POST(request: NextRequest) {
 *   const { projectId, userAttributes } = await request.json()
 *
 *   const response = await fetch(
 *     `https://app.hex.tech/api/v1/embedding/createPresignedUrl/${projectId}`,
 *     {
 *       method: 'POST',
 *       headers: {
 *         'Authorization': `Bearer ${process.env.HEX_WORKSPACE_TOKEN}`,
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({
 *         hexUserAttributes: userAttributes,
 *         displayOptions: {
 *           noEmbedFooter: true,
 *           noEmbedOutline: true
 *         },
 *         expiresIn: 3600 // 1 hour
 *       })
 *     }
 *   )
 *
 *   const data = await response.json()
 *   return NextResponse.json({ url: data.url })
 * }
 * ```
 */
export function HexEmbed({
  projectId,
  userAttributes = {},
  height = '800px',
  title,
  subtitle
}: HexEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadHexDashboard() {
      try {
        setLoading(true)
        setError(null)

        // Call your backend endpoint that communicates with Hex API
        const response = await fetch('/api/hex/embed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId,
            userAttributes,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to load Hex dashboard')
        }

        const data = await response.json()
        setEmbedUrl(data.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadHexDashboard()
  }, [projectId, userAttributes])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading Hex dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-8">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <p className="text-red-800 font-medium">Error loading Hex dashboard</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="relative">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            style={{ width: '100%', height, border: 'none' }}
            allowFullScreen
            title={title || 'Hex Dashboard'}
          />
        ) : (
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-gray-500">No dashboard URL available</p>
          </div>
        )}
      </div>
    </div>
  )
}
