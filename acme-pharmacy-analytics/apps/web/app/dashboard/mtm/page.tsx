export const dynamic = 'force-dynamic'

import { getContracts, getMTMData, getMonthlyTrend } from '@/lib/data-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { AIInsightsPanel, generateMTMInsights } from '@/components/dashboard/AIInsightsPanel'
import {
  CheckCircle,
  PhoneCall,
  XCircle,
  PhoneOff,
  Target,
  AlertTriangle
} from 'lucide-react'
import {
  calculateContractMetrics,
  calculateOpportunityMetrics,
  calculateStarRatingsStatus,
  RESULT_CODES
} from '@/lib/engines/metricsEngine'

interface PageProps {
  searchParams: Promise<{ contract?: string }>
}

export default async function MTMPerformancePage({ searchParams }: PageProps) {
  const params = await searchParams
  const contractId = params.contract

  let contracts: Awaited<ReturnType<typeof getContracts>> = []
  let claims: Awaited<ReturnType<typeof getMTMData>>['claims'] = []
  let eligibleMembers = 0
  let monthlyTrend: Awaited<ReturnType<typeof getMonthlyTrend>> = []

  try {
    const [contractsData, mtmData, trendData] = await Promise.all([
      getContracts(),
      getMTMData(contractId),
      getMonthlyTrend(contractId)
    ])
    contracts = contractsData
    claims = mtmData.claims
    eligibleMembers = mtmData.eligibleMembers
    monthlyTrend = trendData
  } catch (error) {
    console.error('Error fetching MTM data:', error)
  }

  // Calculate metrics using the engine
  const metrics = calculateContractMetrics(claims)
  const opportunityMetrics = calculateOpportunityMetrics(claims)
  const starStatus = calculateStarRatingsStatus(metrics.completionRate)

  // Calculate result code breakdown for chart
  const resultBreakdown = [
    {
      result: 'Success (DTP)',
      count: claims.filter(c => c.resultCode === RESULT_CODES.SUCCESS_DTP).length,
      color: '#10b981'
    },
    {
      result: 'Success (No DTP)',
      count: claims.filter(c => c.resultCode === RESULT_CODES.SUCCESS_NO_DTP).length,
      color: '#34d399'
    },
    {
      result: 'Unable to Reach',
      count: claims.filter(c => c.resultCode === RESULT_CODES.UNABLE_TO_REACH).length,
      color: '#fbbf24'
    },
    {
      result: 'Refused',
      count: claims.filter(c => c.resultCode === RESULT_CODES.REFUSED).length,
      color: '#ef4444'
    },
    {
      result: 'Pending',
      count: claims.filter(c => c.resultCode === null).length,
      color: '#9ca3af'
    }
  ]

  return (
    <DashboardLayout
      title="MTM Program Performance"
      subtitle="Comprehensive Medication Review (CMR) and Targeted Intervention Program (TIP) metrics"
      contracts={contracts}
      currentContractId={contractId}
      showContractSelector={true}
    >
      {/* Star Ratings Alert Banner */}
      {starStatus.status !== 'excellent' && (
        <div className={`mb-8 p-6 rounded-lg border-l-4 ${
          starStatus.status === 'critical' ? 'bg-red-50 border-red-500' :
          'bg-yellow-50 border-yellow-500'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`h-6 w-6 ${
              starStatus.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div>
              <h3 className={`font-semibold text-lg ${
                starStatus.status === 'critical' ? 'text-red-900' : 'text-yellow-900'
              }`}>
                Star Ratings Alert: {starStatus.stars}-Star Trajectory
              </h3>
              <p className={`mt-1 ${
                starStatus.status === 'critical' ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {starStatus.message}
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <span className={starStatus.status === 'critical' ? 'text-red-700' : 'text-yellow-700'}>
                  <strong>Current:</strong> {metrics.completionRate.toFixed(1)}%
                </span>
                <span className={starStatus.status === 'critical' ? 'text-red-700' : 'text-yellow-700'}>
                  <strong>Target:</strong> 80%
                </span>
                <span className={starStatus.status === 'critical' ? 'text-red-700' : 'text-yellow-700'}>
                  <strong>Gap:</strong> {starStatus.gap.toFixed(1)} points
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Completion Rate"
          value={`${metrics.completionRate.toFixed(1)}%`}
          subtitle="Success rate (300/301)"
          status={metrics.completionRate >= 80 ? 'healthy' : metrics.completionRate >= 70 ? 'warning' : 'critical'}
          icon={<CheckCircle className="h-10 w-10" />}
          benchmark={{
            value: '80%',
            label: 'CMS 4-Star threshold',
            comparison: metrics.completionRate >= 80 ? 'above' : 'below'
          }}
        />
        <KPICard
          title="Attempt Rate"
          value={`${metrics.attemptRate.toFixed(1)}%`}
          subtitle="Contact rate"
          status={metrics.attemptRate >= 85 ? 'healthy' : metrics.attemptRate >= 75 ? 'warning' : 'critical'}
          icon={<PhoneCall className="h-10 w-10" />}
          benchmark={{
            value: '85%',
            label: 'Industry avg',
            comparison: metrics.attemptRate >= 85 ? 'above' : 'below'
          }}
        />
        <KPICard
          title="Refusal Rate"
          value={`${metrics.refusalRate.toFixed(1)}%`}
          subtitle="Patient declined"
          status={metrics.refusalRate <= 10 ? 'healthy' : metrics.refusalRate <= 15 ? 'warning' : 'critical'}
          icon={<XCircle className="h-10 w-10" />}
          benchmark={{
            value: '10%',
            label: 'Target max',
            comparison: metrics.refusalRate <= 10 ? 'above' : 'below'
          }}
        />
        <KPICard
          title="Unreachable"
          value={`${metrics.unreachableRate.toFixed(1)}%`}
          subtitle="Unable to contact"
          status={metrics.unreachableRate <= 15 ? 'healthy' : metrics.unreachableRate <= 20 ? 'warning' : 'critical'}
          icon={<PhoneOff className="h-10 w-10" />}
          benchmark={{
            value: '15%',
            label: 'Peer benchmark',
            comparison: metrics.unreachableRate <= 15 ? 'above' : 'below'
          }}
        />
        <KPICard
          title="Total Opportunities"
          value={metrics.totalOpportunities.toLocaleString()}
          subtitle={`${eligibleMembers} eligible members`}
          status="neutral"
          icon={<Target className="h-10 w-10" />}
        />
      </div>

      {/* CMR vs TIP Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="CMR Performance"
          subtitle="Comprehensive Medication Reviews"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-900">
                  {opportunityMetrics.cmr.completionRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total CMRs</p>
                <p className="text-3xl font-bold text-blue-900">
                  {opportunityMetrics.cmr.totalOpportunities}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Completed: {opportunityMetrics.cmr.completionCount}</p>
              <p>Refused: {opportunityMetrics.cmr.refusalCount}</p>
              <p>Pending: {opportunityMetrics.cmr.pendingCount}</p>
            </div>
            {opportunityMetrics.cmr.completionRate < 80 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>Impact:</strong> CMR completion directly affects CMS Star Ratings measure D10 (MTM Program Completion Rate for CMR)
                </p>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="TIP Performance"
          subtitle="Targeted Intervention Programs"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-900">
                  {opportunityMetrics.tip.completionRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Total TIPs</p>
                <p className="text-3xl font-bold text-purple-900">
                  {opportunityMetrics.tip.totalOpportunities}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Completed: {opportunityMetrics.tip.completionCount}</p>
              <p>Refused: {opportunityMetrics.tip.refusalCount}</p>
              <p>Pending: {opportunityMetrics.tip.pendingCount}</p>
            </div>
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-xs text-purple-800">
                <strong>Tip:</strong> TIPs are disease-specific interventions. Higher completion rates correlate with better adherence outcomes.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Result Code Distribution"
          subtitle="Breakdown by outcome"
        >
          <BarChart
            data={resultBreakdown}
            xKey="result"
            bars={[{ dataKey: 'count', color: '#3b82f6', name: 'Claims' }]}
            height={300}
            colorByValue={{
              threshold: 0,
              above: '#3b82f6',
              below: '#3b82f6'
            }}
          />
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>300/301: Success (DTP/No DTP)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>379: Unable to Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>380: Patient Refused</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-400"></div>
              <span>Pending: Awaiting outcome</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Performance Trend"
          subtitle="6-month completion and attempt rates"
        >
          <LineChart
            data={monthlyTrend}
            xKey="month"
            lines={[
              { dataKey: 'completionRate', color: '#10b981', name: 'Completion %' },
              { dataKey: 'attemptRate', color: '#3b82f6', name: 'Attempt %' }
            ]}
            height={300}
          />
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500"></div>
              <span>Completion Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span>Attempt Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-red-400 border-dashed border-t-2 border-red-400"></div>
              <span>80% Target</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* AI-Powered Insights */}
      <div className="mb-8">
        <AIInsightsPanel
          insights={generateMTMInsights({
            completionRate: metrics.completionRate,
            refusalRate: metrics.refusalRate,
            eligibleMembers: eligibleMembers,
            pendingCMRs: metrics.pendingCount,
            roiMultiple: 4.2,
            grossSavings: 1180000
          })}
          title="AI-Powered MTM Insights"
        />
      </div>

      {/* Impact-First Summary */}
      <DashboardCard title="MTM Performance Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">What This Means</h4>
            <p className="text-sm text-gray-600">
              With a {metrics.completionRate.toFixed(1)}% completion rate, you are
              {metrics.completionRate >= 80 ? ' meeting' : ' below'} the CMS Star Ratings threshold.
              {metrics.refusalRate > 10 && ` The ${metrics.refusalRate.toFixed(1)}% refusal rate indicates engagement challenges.`}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Key Actions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Process {metrics.pendingCount} pending claims</li>
              <li>• Re-attempt {metrics.unreachableCount} unreachable members</li>
              <li>• Analyze {metrics.refusalCount} refusals for patterns</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Star Ratings Impact</h4>
            <div className={`p-3 rounded-lg ${
              starStatus.status === 'excellent' ? 'bg-green-50' :
              starStatus.status === 'at_risk' ? 'bg-yellow-50' :
              'bg-red-50'
            }`}>
              <p className={`text-sm font-medium ${
                starStatus.status === 'excellent' ? 'text-green-800' :
                starStatus.status === 'at_risk' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                Current trajectory: {starStatus.stars} Stars
              </p>
              <p className={`text-xs mt-1 ${
                starStatus.status === 'excellent' ? 'text-green-700' :
                starStatus.status === 'at_risk' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {starStatus.gap > 0 ? `${starStatus.gap.toFixed(1)} points to 4+ stars` : 'On track for 4+ stars'}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
