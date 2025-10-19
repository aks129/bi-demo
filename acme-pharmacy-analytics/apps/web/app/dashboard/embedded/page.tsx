import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { SigmaEmbed } from '@/components/dashboard/SigmaEmbed'
import { ExternalLink, Code, Shield, Zap, CheckCircle } from 'lucide-react'

/**
 * Embedded Analytics Dashboard
 *
 * This page demonstrates Sigma Computing dashboard embedding with
 * JWT-signed secure URLs and row-level security.
 *
 * NOTE: To see live Sigma dashboards, you need to:
 * 1. Create workbooks in your Sigma account
 * 2. Enable embedding for each workbook
 * 3. Copy the public embed URLs
 * 4. Replace the placeholder URLs in the SigmaEmbed components below
 */

export default function EmbeddedDashboardPage() {
  // Example Sigma embed URL - replace with your actual workbook URL
  // You can get this from Sigma: Workbook → Share → Embed → Copy URL
  const exampleWorkbookUrl = 'https://app.sigmacomputing.com/embed/1-example'

  return (
    <DashboardLayout
      title="Embedded Analytics with Sigma Computing"
      subtitle="Live dashboard integration with JWT-signed secure embedding"
    >
      {/* Overview */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="bg-purple-600 rounded-full p-3">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-purple-900 font-semibold text-lg mb-2">Sigma Computing Integration Active</h3>
            <p className="text-purple-800 text-sm mb-4">
              This dashboard uses Sigma's REST API with JWT-signed embed URLs for secure, serverless embedding.
              API credentials are configured and ready to display your Sigma workbooks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <strong className="text-purple-900">JWT Security</strong>
                </div>
                <p className="text-purple-800">Tokens signed with HS256, auto-refresh every 50 minutes</p>
              </div>
              <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <strong className="text-purple-900">Row-Level Security</strong>
                </div>
                <p className="text-purple-800">User attributes passed in JWT for data filtering</p>
              </div>
              <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  <strong className="text-purple-900">Serverless</strong>
                </div>
                <p className="text-purple-800">Backend API route generates URLs on-demand</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sigma Demo (Placeholder - needs your workbook URL) */}
      <div className="mb-8">
        <DashboardCard
          title="How to Add Your Sigma Dashboard"
          subtitle="Follow these steps to embed your Sigma workbooks"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Step 1: Create or Select a Workbook in Sigma</h4>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside ml-2">
                <li>Log in to your Sigma account at <a href="https://app.sigmacomputing.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">app.sigmacomputing.com</a></li>
                <li>Create a new workbook or open an existing one</li>
                <li>Build your analytics dashboard with tables, charts, and visualizations</li>
                <li>Publish your workbook</li>
              </ol>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-green-900 mb-2">Step 2: Enable Embedding</h4>
              <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside ml-2">
                <li>In your workbook, click the Share button (top right)</li>
                <li>Go to the <strong>Embed</strong> tab</li>
                <li>Toggle on <strong>"Enable embedding"</strong></li>
                <li>Copy the <strong>Public Embed URL</strong> (looks like: <code className="bg-green-100 px-1 rounded text-xs">https://app.sigmacomputing.com/embed/1-xxxxx</code>)</li>
              </ol>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Step 3: Add to Your Application</h4>
              <p className="text-sm text-purple-800 mb-3">Replace the placeholder URL in the code below:</p>
              <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-xs">
{`<SigmaEmbed
  workbookUrl="YOUR_SIGMA_EMBED_URL_HERE"
  userEmail="user@acme.com"
  userAttributes={{ client_id: "ACME" }}
  title="My Sigma Dashboard"
  height="600px"
/>`}
              </pre>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Example Sigma Embed (will show error until you add your URL) */}
      <div className="mb-8">
        <SigmaEmbed
          workbookUrl={exampleWorkbookUrl}
          userEmail="demo@acme.com"
          userAttributes={{
            client_id: 'ACME',
            role: 'analyst'
          }}
          title="Example Sigma Dashboard"
          subtitle="Replace the workbookUrl with your actual Sigma embed URL"
          height="600px"
        />
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="How It Works"
          subtitle="Technical architecture"
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Frontend Request</h5>
                <p className="text-sm text-gray-600">
                  React component calls <code className="bg-gray-100 px-1 rounded text-xs">/api/sigma/embed</code> with workbook URL and user context
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                2
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Server-Side JWT Generation</h5>
                <p className="text-sm text-gray-600">
                  Next.js API route signs JWT with Sigma client secret (HS256 algorithm)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                3
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Secure URL Returned</h5>
                <p className="text-sm text-gray-600">
                  Signed URL (<code className="bg-gray-100 px-1 rounded text-xs">?:jwt=...</code>) sent to frontend, valid for 1 hour
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                4
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Dashboard Renders</h5>
                <p className="text-sm text-gray-600">
                  iframe loads Sigma workbook with user's data filtered by JWT claims
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Security Features"
          subtitle="Built-in protection"
        >
          <div className="space-y-3">
            <div className="border-l-2 border-green-500 pl-3">
              <h5 className="font-semibold text-gray-900 text-sm mb-1">JWT Signing</h5>
              <p className="text-sm text-gray-600">
                All embed URLs are cryptographically signed with your Sigma client secret, preventing tampering
              </p>
            </div>

            <div className="border-l-2 border-blue-500 pl-3">
              <h5 className="font-semibold text-gray-900 text-sm mb-1">Token Expiration</h5>
              <p className="text-sm text-gray-600">
                Tokens expire after 1 hour and auto-refresh every 50 minutes for seamless UX
              </p>
            </div>

            <div className="border-l-2 border-purple-500 pl-3">
              <h5 className="font-semibold text-gray-900 text-sm mb-1">Row-Level Security</h5>
              <p className="text-sm text-gray-600">
                User attributes in JWT enable data filtering at the Sigma level (e.g., <code className="bg-gray-100 px-1 rounded text-xs">client_id: "ACME"</code>)
              </p>
            </div>

            <div className="border-l-2 border-orange-500 pl-3">
              <h5 className="font-semibold text-gray-900 text-sm mb-1">Server-Side Only</h5>
              <p className="text-sm text-gray-600">
                Client secret never exposed to browser - all signing happens server-side in Next.js API routes
              </p>
            </div>

            <div className="border-l-2 border-red-500 pl-3">
              <h5 className="font-semibold text-gray-900 text-sm mb-1">No Direct Database Access</h5>
              <p className="text-sm text-gray-600">
                Sigma handles all data queries - your app never touches the underlying database
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Code Example */}
      <DashboardCard
        title="Implementation Example"
        subtitle="Complete working code"
      >
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-gray-900 mb-2 text-sm">1. Environment Variables (.env.local)</h5>
            <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-xs">
{`SIGMA_CLIENT_ID="your-client-id-from-sigma"
SIGMA_CLIENT_SECRET="your-client-secret-from-sigma"`}
            </pre>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2 text-sm">2. React Component Usage</h5>
            <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-xs">
{`import { SigmaEmbed } from '@/components/dashboard/SigmaEmbed'

export default function MyDashboard() {
  return (
    <SigmaEmbed
      workbookUrl="https://app.sigmacomputing.com/embed/1-xxxxx"
      userEmail="user@acme.com"
      userAttributes={{
        client_id: "ACME",
        role: "analyst",
        region: "Northeast"
      }}
      title="Executive Dashboard"
      height="800px"
    />
  )
}`}
            </pre>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2 text-sm">3. That's it! The component handles:</h5>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Calling the backend API to get JWT-signed URL</li>
              <li>Loading and error states</li>
              <li>Automatic token refresh</li>
              <li>Responsive iframe sizing</li>
              <li>Security best practices</li>
            </ul>
          </div>
        </div>
      </DashboardCard>

      {/* Resources */}
      <DashboardCard title="Sigma Resources">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://help.sigmacomputing.com/docs/create-a-secure-embed"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Secure Embed Documentation</h5>
              <p className="text-sm text-gray-600">Official guide to JWT-signed embedding</p>
            </div>
          </a>

          <a
            href="https://help.sigmacomputing.com/reference/get-started-sigma-api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Sigma REST API</h5>
              <p className="text-sm text-gray-600">API reference and code samples</p>
            </div>
          </a>

          <a
            href="https://help.sigmacomputing.com/docs/embed-sdk-for-react"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Embed SDK for React</h5>
              <p className="text-sm text-gray-600">Advanced embedding with React SDK</p>
            </div>
          </a>

          <a
            href="https://quickstarts.sigmacomputing.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Sigma Quickstarts</h5>
              <p className="text-sm text-gray-600">Tutorials and integration examples</p>
            </div>
          </a>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
