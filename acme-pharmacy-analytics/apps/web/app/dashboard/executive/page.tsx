import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { TrendingUp, Users, Activity, AlertCircle } from 'lucide-react'
import { subMonths, format } from 'date-fns'

// Generate monthly trend data (mock data for demo)
function generateMonthlyTrends() {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    months.push({
      month: format(date, 'MMM yyyy'),
      adherence: 77 + Math.random() * 6,
      members: 950 + Math.floor(Math.random() * 100),
      alerts: 15 + Math.floor(Math.random() * 10)
    })
  }
  return months
}

async function getExecutiveMetrics() {
  // Get overall adherence stats
  const adherenceStats = await prisma.factAdherence.aggregate({
    _avg: {
      pdc90: true,
      pdc180: true,
    },
    _count: true,
  })

  // Get member count
  const memberCount = await prisma.dimMember.count()

  // Get notification count
  const activeAlerts = await prisma.factNotification.count({
    where: {
      status: 'Active'
    }
  })

  // Get adherence by drug class
  const adherenceByClass = await prisma.factAdherence.groupBy({
    by: ['drugClass'],
    _avg: {
      pdc90: true,
    },
    _count: true,
  })

  return {
    overallAdherence: adherenceStats._avg.pdc90 || 0,
    overallAdherence180: adherenceStats._avg.pdc180 || 0,
    totalMembers: memberCount,
    activeAlerts,
    adherenceByClass: adherenceByClass.map(item => ({
      drugClass: item.drugClass,
      adherence: item._avg.pdc90 || 0,
      count: item._count
    }))
  }
}

export default async function ExecutiveDashboard() {
  const metrics = await getExecutiveMetrics()
  const monthlyTrends = generateMonthlyTrends()

  // Calculate status
  const overallStatus = metrics.overallAdherence >= 80 ? 'healthy' :
                       metrics.overallAdherence >= 75 ? 'warning' : 'critical'

  return (
    <DashboardLayout
      title="Executive Overview"
      subtitle="High-level performance metrics and strategic insights"
    >
      {/* Top KPI Cards - Tableau Z-Layout: Most important at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Overall Adherence"
          value={`${metrics.overallAdherence.toFixed(1)}%`}
          subtitle="PDC 90-day average"
          status={overallStatus}
          change={{ value: 2.3, period: 'vs last month' }}
          icon={<TrendingUp className="h-12 w-12" />}
          size="lg"
        />
        <KPICard
          title="Total Members"
          value={metrics.totalMembers.toLocaleString()}
          subtitle="Active members"
          status="neutral"
          change={{ value: 5.2, period: 'vs last month' }}
          icon={<Users className="h-12 w-12" />}
          size="lg"
        />
        <KPICard
          title="Active Alerts"
          value={metrics.activeAlerts}
          subtitle="Requires attention"
          status={metrics.activeAlerts > 5 ? 'warning' : 'healthy'}
          icon={<AlertCircle className="h-12 w-12" />}
          size="lg"
        />
        <KPICard
          title="Star Rating Risk"
          value={overallStatus === 'critical' ? 'High' : overallStatus === 'warning' ? 'Medium' : 'Low'}
          subtitle="CMS compliance status"
          status={overallStatus}
          icon={<Activity className="h-12 w-12" />}
          size="lg"
        />
      </div>

      {/* Impact-First Messaging */}
      {metrics.overallAdherence < 80 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-900 font-semibold text-lg mb-2">Strategic Alert: Star Ratings at Risk</h3>
              <div className="text-red-800 space-y-2">
                <p><strong>So what?</strong> Overall adherence at {metrics.overallAdherence.toFixed(1)}% is below the 80% threshold required for 4+ Star Ratings. This puts millions in CMS bonus payments at risk.</p>
                <p><strong>Now what?</strong> Execute intervention playbook:
                  <span className="ml-2 inline-flex gap-3 mt-1">
                    <span>1. Identify at-risk cohorts</span>
                    <span>2. Launch targeted outreach</span>
                    <span>3. Monitor weekly progress</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trend Charts - Middle section for detailed analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Adherence Trend"
          subtitle="90-day PDC over time"
        >
          <LineChart
            data={monthlyTrends}
            xKey="month"
            lines={[
              { dataKey: 'adherence', color: '#3b82f6', name: 'Adherence %' }
            ]}
            height={300}
          />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Insight:</strong> Adherence trending {monthlyTrends[5].adherence > monthlyTrends[0].adherence ? 'up' : 'down'} over 6 months.
              {monthlyTrends[5].adherence > 80 ? ' Continue monitoring.' : ' Intervention required.'}
            </p>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Member Growth"
          subtitle="Active member enrollment"
        >
          <AreaChart
            data={monthlyTrends}
            xKey="month"
            areas={[
              { dataKey: 'members', color: '#10b981', name: 'Members' }
            ]}
            height={300}
          />
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-900">
              <strong>Insight:</strong> Steady member growth indicates strong market position and retention.
            </p>
          </div>
        </DashboardCard>
      </div>

      {/* Drug Class Performance - Bar chart for easy length comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Adherence by Drug Class"
          subtitle="PDC 90-day performance comparison"
        >
          <BarChart
            data={metrics.adherenceByClass.map(item => ({
              drugClass: item.drugClass,
              adherence: item.adherence,
            }))}
            xKey="drugClass"
            bars={[
              { dataKey: 'adherence', color: '#3b82f6', name: 'Adherence %' }
            ]}
            height={300}
            colorByValue={{
              threshold: 80,
              above: '#10b981',
              below: '#ef4444'
            }}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Target: 80%</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>At/Above Target</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Below Target</span>
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Monthly Alert Trends"
          subtitle="Active notifications requiring action"
        >
          <LineChart
            data={monthlyTrends}
            xKey="month"
            lines={[
              { dataKey: 'alerts', color: '#f59e0b', name: 'Active Alerts' }
            ]}
            height={300}
          />
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>Action Required:</strong> {metrics.activeAlerts} alerts need attention.
              Review <a href="/dashboard/insights" className="underline font-semibold">Insights & Alerts dashboard</a> for details.
            </p>
          </div>
        </DashboardCard>
      </div>

      {/* Summary Stats Table */}
      <div className="mt-8">
        <DashboardCard title="Drug Class Performance Summary">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drug Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adherence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.adherenceByClass.map((item) => {
                  const status = item.adherence >= 80 ? 'healthy' : item.adherence >= 75 ? 'warning' : 'critical'
                  const statusColors = {
                    healthy: 'bg-green-100 text-green-800',
                    warning: 'bg-yellow-100 text-yellow-800',
                    critical: 'bg-red-100 text-red-800'
                  }
                  return (
                    <tr key={item.drugClass}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.drugClass}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.adherence.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                          {status === 'healthy' ? 'On Track' : status === 'warning' ? 'At Risk' : 'Critical'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                        <a href={`/dashboard/adherence?class=${item.drugClass}`}>View Details →</a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  )
}
