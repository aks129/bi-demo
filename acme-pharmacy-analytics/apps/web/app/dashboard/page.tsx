import { prisma } from '@/lib/prisma'
import { formatPercent, getAdherenceStatus } from '@/lib/utils'
import Link from 'next/link'

async function getAdherenceKPIs() {
  const stats = await prisma.factAdherence.groupBy({
    by: ['drugClass'],
    _avg: {
      pdc90: true,
      pdc180: true,
      mpr90: true,
    },
    _count: true,
  })

  return stats
}

async function getNotifications() {
  const notifications = await prisma.factNotification.findMany({
    where: {
      status: {
        in: ['open', 'triaged']
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })

  return notifications
}

async function getMemberCount() {
  return await prisma.dimMember.count()
}

export default async function DashboardPage() {
  const [kpis, notifications, memberCount] = await Promise.all([
    getAdherenceKPIs(),
    getNotifications(),
    getMemberCount()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ACME Pharmacy Analytics</h1>
              <p className="text-sm text-gray-600">Client Analytics Dashboard</p>
            </div>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Impact Banner */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm font-medium">
            💡 <strong>Impact-first:</strong> Every metric answers "So what?" and "Now what?"
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Summary Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">{memberCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-orange-600">{notifications.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Drug Classes Monitored</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.length}</p>
              </div>
            </div>
          </div>

          {/* KPI Ribbon */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Adherence KPIs by Drug Class</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpis.map((stat) => {
                const pdc = stat._avg.pdc90
                const status = getAdherenceStatus(pdc)

                return (
                  <div key={stat.drugClass} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">{stat.drugClass}</h3>
                        <p className="text-xs text-gray-500 mt-1">PDC_90 (Proportion of Days Covered)</p>
                      </div>

                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPercent(pdc)}
                        </span>
                        <span className={`text-sm font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Target:</span>
                          <span className="font-semibold text-gray-900">≥80%</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">MPR_90:</span>
                          <span className="font-semibold text-gray-900">{formatPercent(stat._avg.mpr90)}</span>
                        </div>
                      </div>

                      {pdc !== null && pdc < 80 && (
                        <div className="mt-3 p-3 bg-red-50 rounded-md">
                          <p className="text-xs font-semibold text-red-800">⚠ Below Star Ratings threshold</p>
                          <p className="text-xs text-red-700 mt-1">
                            <strong>So what?</strong> Risk to 4+ star rating
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            <strong>Now what?</strong> Identify at-risk members → send refill reminders
                          </p>
                        </div>
                      )}

                      {pdc !== null && pdc >= 80 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                          <p className="text-xs font-semibold text-green-800">✓ Meets Star Ratings threshold</p>
                          <p className="text-xs text-green-700 mt-1">
                            Continue monitoring to maintain compliance
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Notifications */}
          {notifications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Insights & Alerts</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notif.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                              notif.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {notif.severity}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notif.status === 'open' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {notif.status}
                            </span>
                          </div>
                          <h3 className="mt-2 text-sm font-semibold text-gray-900">
                            {notif.ruleKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{notif.entityRef}</p>
                          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                            <span>Owner: <strong className="text-gray-700">{notif.owner}</strong></span>
                            <span>SLA: <strong className="text-gray-700">{notif.slaHours}h</strong></span>
                            <span>Created: <strong className="text-gray-700">{notif.createdAt.toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                        <button className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                          View Playbook →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Impact Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Impact-First Approach
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong className="font-semibold">So what?</strong> Adherence below 80% puts Medicare Star Ratings at risk, potentially costing millions in CMS bonuses.
              </p>
              <p>
                <strong className="font-semibold">Now what?</strong> Use these insights to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Identify at-risk cohorts (PDC &lt;75%)</li>
                <li>Pull member lists for outreach campaigns</li>
                <li>Send targeted refill reminders within 48 hours</li>
                <li>Track recovery: Monitor weekly PDC for 4 weeks</li>
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expand This Demo</h3>
            <p className="text-sm text-gray-600 mb-4">
              This is a minimal viable product (MVP) demonstrating the core architecture. The full implementation includes:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border-l-2 border-blue-500 pl-3">
                <strong className="text-gray-900">6 Additional Dashboards</strong>
                <p className="text-gray-600 text-xs mt-1">Exec Overview, Internal Ops, Product Metrics, Insights, Admin, AI Chat</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <strong className="text-gray-900">Interactive Charts</strong>
                <p className="text-gray-600 text-xs mt-1">Recharts visualizations with drill-downs and filters</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-3">
                <strong className="text-gray-900">Authentication & RBAC</strong>
                <p className="text-gray-600 text-xs mt-1">NextAuth with 6 roles and row-level security</p>
              </div>
              <div className="border-l-2 border-orange-500 pl-3">
                <strong className="text-gray-900">Rules Engine</strong>
                <p className="text-gray-600 text-xs mt-1">5-7 notification rules with playbooks and SLAs</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                See <code className="bg-gray-100 px-2 py-1 rounded">IMPLEMENTATION_BLUEPRINT.md</code> for the complete 42-58 hour build guide.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            ACME Pharmacy Analytics • Built with Next.js 15, Prisma, SQLite • 100% Synthetic Data (Demo Safe)
          </p>
        </div>
      </footer>
    </div>
  )
}
