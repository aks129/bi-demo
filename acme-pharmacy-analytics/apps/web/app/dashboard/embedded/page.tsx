import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { ExternalLink, Code, Shield, Zap } from 'lucide-react'

/**
 * Embedded Analytics Dashboard
 *
 * This page demonstrates how to integrate third-party analytics platforms
 * like Hex, Tableau, Sigma, or Power BI using iframe embedding.
 *
 * For a working example with Hex, see components/dashboard/HexEmbed.tsx
 */

export default function EmbeddedDashboardPage() {
  return (
    <DashboardLayout
      title="Embedded Analytics"
      subtitle="Third-party dashboard integration examples"
    >
      {/* Overview */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <ExternalLink className="h-8 w-8 text-purple-600 flex-shrink-0" />
          <div>
            <h3 className="text-purple-900 font-semibold text-lg mb-2">Embedding Third-Party Dashboards</h3>
            <p className="text-purple-800 text-sm mb-4">
              This dashboard demonstrates how to embed external analytics platforms like Hex, Tableau, Sigma Computing, or Power BI
              directly into your application using iframe embedding with secure authentication.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white bg-opacity-50 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <strong className="text-purple-900">Security</strong>
                </div>
                <p className="text-purple-800">Single-use presigned URLs prevent link sharing and replay attacks</p>
              </div>
              <div className="bg-white bg-opacity-50 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <strong className="text-purple-900">Performance</strong>
                </div>
                <p className="text-purple-800">Native platform performance with seamless integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Hex Embedded Analytics"
          subtitle="Data science notebooks and dashboards"
        >
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Implementation Status</h4>
              <p className="text-sm text-blue-800 mb-3">
                Ready to integrate. See <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">components/dashboard/HexEmbed.tsx</code> for the React component.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-blue-800">Component: ✓ Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-blue-800">API Route: Needs setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-blue-800">Hex Project: Needs configuration</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Quick Setup
              </h5>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>Enable "Allow signed embedding" in your Hex project</li>
                <li>Create Workspace token with "Create embedded links" scope</li>
                <li>Add <code className="bg-gray-200 px-1 rounded text-xs">HEX_WORKSPACE_TOKEN</code> to your .env file</li>
                <li>Implement <code className="bg-gray-200 px-1 rounded text-xs">/api/hex/embed</code> route (see component docs)</li>
                <li>Use <code className="bg-gray-200 px-1 rounded text-xs">&lt;HexEmbed projectId="..." /&gt;</code> in your pages</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <a
                href="https://learn.hex.tech/docs/share-insights/embedding"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                View Hex Embedding Docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Other Platform Support"
          subtitle="Tableau, Sigma, Power BI integration"
        >
          <div className="space-y-4">
            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Tableau Embedding</h4>
              <p className="text-sm text-gray-600 mb-3">
                Use Tableau's Embedding API v3 with <code className="bg-gray-100 px-1 rounded text-xs">@tableau/embedding-api-react</code>
              </p>
              <a
                href="https://www.npmjs.com/package/@tableau/embedding-api-react"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                NPM Package
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Sigma Computing</h4>
              <p className="text-sm text-gray-600 mb-3">
                Sigma supports iframe embedding with signed URLs and row-level security
              </p>
              <a
                href="https://www.sigmacomputing.com/product/dashboards"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                Learn More
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Power BI</h4>
              <p className="text-sm text-gray-600 mb-3">
                Microsoft provides <code className="bg-gray-100 px-1 rounded text-xs">powerbi-client-react</code> for embedding
              </p>
              <a
                href="https://learn.microsoft.com/en-us/javascript/api/overview/powerbi/powerbi-client-react"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                Microsoft Docs
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Example Placeholder */}
      <DashboardCard
        title="Embedded Dashboard Preview"
        subtitle="Example of how an embedded dashboard would appear"
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ExternalLink className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Embedded Dashboard Placeholder</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This area would display your Hex, Tableau, Sigma, or Power BI dashboard once configured.
            The iframe would render the full interactive dashboard with all its features.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Configure Hex Integration
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors">
              View Documentation
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-900">
            <strong>Pro Tip:</strong> When implementing, set <code className="bg-blue-100 px-1 rounded text-xs">displayOptions.noEmbedFooter = true</code>
            to hide the Hex footer and create a seamless white-labeled experience.
          </p>
        </div>
      </DashboardCard>

      {/* Technical Architecture */}
      <div className="mt-8">
        <DashboardCard
          title="Technical Architecture"
          subtitle="How embedded analytics work"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Client Request</h4>
              <p className="text-sm text-gray-600">
                React component requests presigned URL from your backend API route
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Server Exchange</h4>
              <p className="text-sm text-gray-600">
                Your backend calls Hex API with workspace token to generate secure URL
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Iframe Render</h4>
              <p className="text-sm text-gray-600">
                Single-use URL loads in iframe with user-specific data filtering
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  )
}
