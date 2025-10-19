import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            ACME Pharmacy Analytics
          </h1>
          <p className="text-xl text-gray-600">
            Sigma-class analytics demo
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-lg text-gray-700 max-w-2xl">
            <strong>Impact-first analytics</strong> for pharmacy products
          </p>
          <p className="text-sm text-gray-600 max-w-2xl">
            Monitor adherence, identify gaps, and drive outcomes with data-driven insights
          </p>
        </div>

        <div className="pt-6 flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            View Dashboard
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>Demo credentials: analyst@acme.com / demo123</p>
        </div>

        <div className="pt-6 border-t border-gray-300 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7 Pillars</h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-left">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <strong>Client Analytics</strong>
              <p className="text-gray-600 text-xs">Adherence, gaps, CMR/TMR</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <strong>Exec Overview</strong>
              <p className="text-gray-600 text-xs">Star Ratings, trends</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <strong>Internal Ops</strong>
              <p className="text-gray-600 text-xs">Feed latency, SLA tracking</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <strong>Product Metrics</strong>
              <p className="text-gray-600 text-xs">Usage, adoption, retention</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <strong>Insights & Alerts</strong>
              <p className="text-gray-600 text-xs">Proactive notifications</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <strong>Governance</strong>
              <p className="text-gray-600 text-xs">Metrics catalog, lineage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
