import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { BarChart } from '@/components/charts/BarChart'
import { Activity, TrendingDown, TrendingUp, Users } from 'lucide-react'

async function getAdherenceDetails() {
  // Get adherence stats by drug class
  const adherenceByClass = await prisma.factAdherence.groupBy({
    by: ['drugClass'],
    _avg: {
      pdc90: true,
      pdc180: true,
      mpr90: true,
    },
    _count: true,
  })

  // Get member-level adherence distribution (bucketed)
  const allAdherence = await prisma.factAdherence.findMany({
    select: {
      pdc90: true,
      drugClass: true,
      memberId: true,
    }
  })

  // Create distribution buckets
  const buckets = {
    '90-100%': 0,
    '80-89%': 0,
    '70-79%': 0,
    '60-69%': 0,
    '<60%': 0,
  }

  allAdherence.forEach(record => {
    if (record.pdc90 >= 90) buckets['90-100%']++
    else if (record.pdc90 >= 80) buckets['80-89%']++
    else if (record.pdc90 >= 70) buckets['70-79%']++
    else if (record.pdc90 >= 60) buckets['60-69%']++
    else buckets['<60%']++
  })

  const distribution = Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
  }))

  // Count members by adherence status
  const healthyCount = allAdherence.filter(r => r.pdc90 >= 80).length
  const atRiskCount = allAdherence.filter(r => r.pdc90 >= 75 && r.pdc90 < 80).length
  const criticalCount = allAdherence.filter(r => r.pdc90 < 75).length

  return {
    byDrugClass: adherenceByClass.map(item => ({
      drugClass: item.drugClass,
      pdc90: item._avg.pdc90 || 0,
      pdc180: item._avg.pdc180 || 0,
      mpr90: item._avg.mpr90 || 0,
      count: item._count,
    })),
    distribution,
    healthyCount,
    atRiskCount,
    criticalCount,
    totalRecords: allAdherence.length,
  }
}

export default async function AdherenceDeepDivePage() {
  const data = await getAdherenceDetails()

  const overallAdherence = data.byDrugClass.reduce((sum, item) => sum + item.pdc90, 0) / data.byDrugClass.length

  return (
    <DashboardLayout
      title="Adherence Deep Dive"
      subtitle="Detailed medication adherence analysis and cohort insights"
    >
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Healthy Adherence"
          value={data.healthyCount}
          subtitle="≥80% PDC"
          status="healthy"
          icon={<TrendingUp className="h-10 w-10" />}
        />
        <KPICard
          title="At Risk"
          value={data.atRiskCount}
          subtitle="75-79% PDC"
          status="warning"
          icon={<Activity className="h-10 w-10" />}
        />
        <KPICard
          title="Critical"
          value={data.criticalCount}
          subtitle="<75% PDC"
          status="critical"
          icon={<TrendingDown className="h-10 w-10" />}
        />
        <KPICard
          title="Total Records"
          value={data.totalRecords}
          subtitle="Adherence measurements"
          status="neutral"
          icon={<Users className="h-10 w-10" />}
        />
      </div>

      {/* Impact-First Context */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-blue-900 font-semibold text-lg mb-2">Understanding Adherence Metrics</h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p><strong>PDC (Proportion of Days Covered):</strong> Percentage of days patient has medication available. Industry standard for adherence measurement.</p>
            <p><strong>MPR (Medication Possession Ratio):</strong> Ratio of days supply obtained to days in measurement period. Commonly used alternative metric.</p>
            <p><strong>Star Ratings Threshold:</strong> CMS requires ≥80% adherence for 4+ star rating across multiple drug classes.</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <h3 className="text-yellow-900 font-semibold text-lg mb-2">So What? Now What?</h3>
          <div className="text-yellow-800 text-sm space-y-2">
            <p><strong>Business Impact:</strong> {data.criticalCount + data.atRiskCount} members are below optimal adherence, risking Star Ratings and health outcomes.</p>
            <p><strong>Action Plan:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Segment critical cohort for immediate outreach</li>
              <li>Deploy refill reminder campaigns</li>
              <li>Schedule CMRs for at-risk members</li>
              <li>Monitor weekly progress toward 80% threshold</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Adherence by Drug Class"
          subtitle="PDC 90-day comparison"
        >
          <BarChart
            data={data.byDrugClass}
            xKey="drugClass"
            bars={[
              { dataKey: 'pdc90', color: '#3b82f6', name: 'PDC 90-day' }
            ]}
            height={320}
            colorByValue={{
              threshold: 80,
              above: '#10b981',
              below: '#ef4444'
            }}
          />
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">CMS Threshold: 80%</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-700">At Goal</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Below Goal</span>
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Member Distribution by Adherence"
          subtitle="Cohort segmentation by PDC range"
        >
          <BarChart
            data={data.distribution}
            xKey="range"
            bars={[
              { dataKey: 'count', color: '#8b5cf6', name: 'Members' }
            ]}
            height={320}
          />
          <div className="mt-4 p-3 bg-purple-50 rounded">
            <p className="text-sm text-purple-900">
              <strong>Insight:</strong> Focus on <strong>{data.distribution.find(d => d.range === '70-79%')?.count || 0}</strong> members in 70-79% range -
              they're closest to achieving the 80% threshold with targeted intervention.
            </p>
          </div>
        </DashboardCard>
      </div>

      {/* Detailed Metrics Table */}
      <DashboardCard title="Comprehensive Adherence Metrics by Drug Class">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drug Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PDC 90-day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PDC 180-day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MPR 90-day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gap to Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.byDrugClass.map((item) => {
                const gap = 80 - item.pdc90
                const status = item.pdc90 >= 80 ? 'healthy' : item.pdc90 >= 75 ? 'warning' : 'critical'
                const statusColors = {
                  healthy: 'bg-green-100 text-green-800',
                  warning: 'bg-yellow-100 text-yellow-800',
                  critical: 'bg-red-100 text-red-800'
                }

                return (
                  <tr key={item.drugClass} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.drugClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {item.pdc90.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.pdc180.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.mpr90.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {gap > 0 ? (
                        <span className="text-red-600 font-semibold">-{gap.toFixed(1)}%</span>
                      ) : (
                        <span className="text-green-600 font-semibold">+{Math.abs(gap).toFixed(1)}%</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                        {status === 'healthy' ? 'On Track' : status === 'warning' ? 'At Risk' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Overall Average
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {data.totalRecords}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {overallAdherence.toFixed(1)}%
                </td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
