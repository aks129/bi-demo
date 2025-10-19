import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { BarChart } from '@/components/charts/BarChart'
import { TrendingUp, Users, Bell, Activity } from 'lucide-react'

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
        in: ['Active', 'open', 'triaged']
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

  // Calculate overall adherence
  const overallAdherence = kpis.reduce((sum, stat) => sum + (stat._avg.pdc90 || 0), 0) / kpis.length

  return (
    <DashboardLayout
      title="Client Analytics Dashboard"
      subtitle="ACME Pharmacy medication adherence and Star Ratings performance"
    >
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Overall Adherence"
          value={`${overallAdherence.toFixed(1)}%`}
          subtitle="PDC 90-day average"
          status={overallAdherence >= 80 ? 'healthy' : overallAdherence >= 75 ? 'warning' : 'critical'}
          change={{ value: 2.3, period: 'vs last month' }}
          icon={<TrendingUp className="h-12 w-12" />}
          size="lg"
        />
        <KPICard
          title="Total Members"
          value={memberCount.toLocaleString()}
          subtitle="Active members"
          status="neutral"
          icon={<Users className="h-12 w-12" />}
          size="lg"
        />
        <KPICard
          title="Active Alerts"
          value={notifications.length}
          subtitle="Requires attention"
          status={notifications.length > 5 ? 'warning' : 'healthy'}
          icon={<Bell className="h-12 w-12" />}
          size="lg"
        />
        <KPICard
          title="Drug Classes"
          value={kpis.length}
          subtitle="Monitored classes"
          status="neutral"
          icon={<Activity className="h-12 w-12" />}
          size="lg"
        />
      </div>

      {/* Impact Banner */}
      {overallAdherence < 80 && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <h3 className="text-red-900 font-semibold text-lg mb-2">Strategic Alert: Star Ratings at Risk</h3>
          <div className="text-red-800 space-y-2">
            <p><strong>So what?</strong> Overall adherence at {overallAdherence.toFixed(1)}% is below the 80% threshold required for 4+ Star Ratings. This puts millions in CMS bonus payments at risk.</p>
            <p><strong>Now what?</strong> Execute intervention playbook: Identify at-risk cohorts → Launch targeted outreach → Monitor weekly progress</p>
          </div>
        </div>
      )}

      {/* Drug Class Performance Chart */}
      <div className="mb-8">
        <DashboardCard
          title="Adherence by Drug Class"
          subtitle="PDC 90-day performance comparison"
        >
          <BarChart
            data={kpis.map(stat => ({
              drugClass: stat.drugClass,
              pdc90: stat._avg.pdc90 || 0,
            }))}
            xKey="drugClass"
            bars={[
              { dataKey: 'pdc90', color: '#3b82f6', name: 'PDC 90-day %' }
            ]}
            height={350}
            colorByValue={{
              threshold: 80,
              above: '#10b981',
              below: '#ef4444'
            }}
          />
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">CMS Star Ratings Threshold: 80%</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-700">Meets Target</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Below Target</span>
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* KPI Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpis.map((stat) => {
          const pdc = stat._avg.pdc90 || 0
          const status = pdc >= 80 ? 'healthy' : pdc >= 75 ? 'warning' : 'critical'

          return (
            <DashboardCard
              key={stat.drugClass}
              title={stat.drugClass}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">PDC 90-day</p>
                  <p className={`text-4xl font-bold ${
                    status === 'healthy' ? 'text-green-600' :
                    status === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {pdc.toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">PDC 180-day:</span>
                    <span className="font-semibold">{(stat._avg.pdc180 || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">MPR 90-day:</span>
                    <span className="font-semibold">{(stat._avg.mpr90 || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-semibold text-gray-900">≥80%</span>
                  </div>
                </div>

                {pdc < 80 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <p className="text-xs font-semibold text-red-800">⚠ Below Star Ratings threshold</p>
                    <p className="text-xs text-red-700 mt-1">
                      <strong>So what?</strong> Risk to 4+ star rating
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      <strong>Now what?</strong> Identify at-risk members → send refill reminders
                    </p>
                  </div>
                )}

                {pdc >= 80 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-xs font-semibold text-green-800">✓ Meets Star Ratings threshold</p>
                    <p className="text-xs text-green-700 mt-1">
                      Continue monitoring to maintain compliance
                    </p>
                  </div>
                )}
              </div>
            </DashboardCard>
          )
        })}
      </div>

      {/* Active Notifications */}
      {notifications.length > 0 && (
        <div className="mb-8">
          <DashboardCard
            title="Active Insights & Alerts"
            subtitle={`${notifications.length} alerts requiring attention`}
            action={
              <a href="/dashboard/insights" className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                View All →
              </a>
            }
          >
            <div className="space-y-4">
              {notifications.map((notif) => {
                const severityColors = {
                  Critical: 'bg-red-100 text-red-800 border-red-200',
                  High: 'bg-orange-100 text-orange-800 border-orange-200',
                  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  Low: 'bg-blue-100 text-blue-800 border-blue-200'
                }

                return (
                  <div key={notif.id} className={`border-2 rounded-lg p-4 ${severityColors[notif.severity as keyof typeof severityColors] || 'border-gray-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                            notif.severity === 'Critical' ? 'bg-red-600 text-white' :
                            notif.severity === 'High' ? 'bg-orange-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}>
                            {notif.severity}
                          </span>
                          <span className="text-sm font-semibold">
                            {notif.message}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Owner: <strong>{notif.owner}</strong></span>
                          <span>SLA: <strong>{notif.slaHours}h</strong></span>
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded">
                        View Playbook →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </DashboardCard>
        </div>
      )}

      {/* Impact-First Messaging */}
      <DashboardCard title="Impact-First Approach">
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong className="text-gray-900">So what?</strong> Adherence below 80% puts Medicare Star Ratings at risk, potentially costing millions in CMS bonuses.
          </p>
          <p>
            <strong className="text-gray-900">Now what?</strong> Use these insights to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Identify at-risk cohorts (PDC &lt;75%)</li>
            <li>Pull member lists for outreach campaigns</li>
            <li>Send targeted refill reminders within 48 hours</li>
            <li>Track recovery: Monitor weekly PDC for 4 weeks</li>
          </ul>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
