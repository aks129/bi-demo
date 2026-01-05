export const dynamic = 'force-dynamic'

import { getContracts, getROIData, getMonthlyROI } from '@/lib/data-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { WaterfallChart } from '@/components/charts/WaterfallChart'
import {
  DollarSign,
  TrendingUp,
  Calculator,
  PiggyBank,
  Activity,
  Award
} from 'lucide-react'
import {
  calculateAIMROI,
  generateWaterfallData,
  formatCurrency,
  calculateSeverityDistribution
} from '@/lib/engines/aimEngine'

interface PageProps {
  searchParams: Promise<{ contract?: string }>
}

export default async function ROIDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const contractId = params.contract

  const [contracts, claims, monthlyROI] = await Promise.all([
    getContracts(),
    getROIData(contractId),
    getMonthlyROI(contractId)
  ])

  // Calculate AIM metrics
  const aimSummary = calculateAIMROI(claims)
  const waterfallData = generateWaterfallData(aimSummary)
  const severityDistribution = calculateSeverityDistribution(aimSummary)

  // Prepare severity breakdown chart data
  const severityChartData = severityDistribution.map(s => ({
    level: `L${s.level}`,
    description: s.description,
    value: s.value / 1000, // Convert to thousands for readability
    count: s.count
  }))

  return (
    <DashboardLayout
      title="Financial ROI Dashboard"
      subtitle="AIM Model cost avoidance analysis and return on investment metrics"
      contracts={contracts}
      currentContractId={contractId}
      showContractSelector={true}
    >
      {/* ROI Highlight Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">MTM Program ROI</h2>
            <p className="text-blue-100 mt-1">Based on Outcomes AIM (Actuarial Investment Model)</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{aimSummary.roiMultiple.toFixed(1)}x</p>
            <p className="text-blue-100">Return on Investment</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-blue-500">
          <div>
            <p className="text-blue-200 text-sm">Gross Cost Avoidance</p>
            <p className="text-2xl font-bold">{formatCurrency(aimSummary.grossCostAvoidance)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Operational Costs</p>
            <p className="text-2xl font-bold">-{formatCurrency(aimSummary.operationalCosts)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Net Benefit</p>
            <p className="text-2xl font-bold">{formatCurrency(aimSummary.netBenefit)}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Gross Savings"
          value={formatCurrency(aimSummary.grossCostAvoidance)}
          subtitle="Projected cost avoidance"
          status="healthy"
          icon={<DollarSign className="h-10 w-10" />}
        />
        <KPICard
          title="Net Benefit"
          value={formatCurrency(aimSummary.netBenefit)}
          subtitle="After operational costs"
          status={aimSummary.netBenefit > 0 ? 'healthy' : 'critical'}
          icon={<PiggyBank className="h-10 w-10" />}
        />
        <KPICard
          title="Approved Interventions"
          value={aimSummary.approvedInterventions.toLocaleString()}
          subtitle={`of ${aimSummary.totalInterventions} total`}
          status="neutral"
          icon={<Activity className="h-10 w-10" />}
        />
        <KPICard
          title="Avg. per Intervention"
          value={formatCurrency(aimSummary.approvedInterventions > 0 ? aimSummary.grossCostAvoidance / aimSummary.approvedInterventions : 0)}
          subtitle="Cost avoidance"
          status="neutral"
          icon={<Calculator className="h-10 w-10" />}
        />
      </div>

      {/* Waterfall Chart */}
      <div className="mb-8">
        <DashboardCard
          title="Financial Waterfall"
          subtitle="Gross savings to net benefit breakdown"
        >
          <WaterfallChart
            data={waterfallData}
            height={350}
          />
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600">Gross Savings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-gray-600">Operating Costs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-gray-600">Net Benefit</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Severity Breakdown and Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Savings by Severity Level"
          subtitle="AIM model intervention classification"
        >
          <BarChart
            data={severityChartData}
            xKey="level"
            bars={[{ dataKey: 'value', color: '#10b981', name: 'Savings ($K)' }]}
            height={300}
          />
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500 uppercase font-medium">Severity Legend</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              {severityDistribution.slice(0, 6).map(s => (
                <div key={s.level} className="flex justify-between">
                  <span>L{s.level}: {s.description}</span>
                  <span className="font-medium">{s.count} ({s.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Monthly Cost Avoidance Trend"
          subtitle="6-month savings trajectory"
        >
          <LineChart
            data={monthlyROI}
            xKey="month"
            lines={[
              { dataKey: 'cumulative', color: '#3b82f6', name: 'Cumulative ($)' }
            ]}
            height={300}
          />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500">Avg. Monthly Savings</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(monthlyROI.length > 0 ? monthlyROI.reduce((s, m) => s + m.savings, 0) / monthlyROI.length : 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500">YTD Total</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(monthlyROI.length > 0 ? monthlyROI[monthlyROI.length - 1].cumulative : 0)}
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* CMR vs TIP ROI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="CMR Program ROI"
          subtitle="Comprehensive Medication Reviews"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Interventions</p>
                <p className="text-2xl font-bold text-blue-900">{aimSummary.byOpportunityType.cmr.count}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Savings</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(aimSummary.byOpportunityType.cmr.value)}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Avg/CMR</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(aimSummary.byOpportunityType.cmr.count > 0 ? aimSummary.byOpportunityType.cmr.value / aimSummary.byOpportunityType.cmr.count : 0)}
                </p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                CMRs provide comprehensive medication therapy reviews and typically identify higher-value interventions.
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="TIP Program ROI"
          subtitle="Targeted Intervention Programs"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Interventions</p>
                <p className="text-2xl font-bold text-purple-900">{aimSummary.byOpportunityType.tip.count}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Savings</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(aimSummary.byOpportunityType.tip.value)}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">Avg/TIP</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(aimSummary.byOpportunityType.tip.count > 0 ? aimSummary.byOpportunityType.tip.value / aimSummary.byOpportunityType.tip.count : 0)}
                </p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-xs text-purple-800">
                TIPs are focused, disease-specific interventions with high volume and consistent ROI per intervention.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Impact Summary */}
      <DashboardCard title="Financial Impact Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              So What?
            </h4>
            <p className="text-sm text-gray-600">
              The MTM program generated <strong>{formatCurrency(aimSummary.grossCostAvoidance)}</strong> in projected
              cost avoidance through {aimSummary.approvedInterventions} approved interventions.
              After accounting for ${formatCurrency(aimSummary.operationalCosts)} in operational costs,
              the net benefit is <strong>{formatCurrency(aimSummary.netBenefit)}</strong>.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Now What?
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Focus on Level 5-6 interventions (ER/hospital prevention)</li>
              <li>• Increase CMR completion rate for higher-value outcomes</li>
              <li>• Document case studies for high-severity interventions</li>
              <li>• Share ROI data with plan sponsors</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" />
              Key Insight
            </h4>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <p className="text-3xl font-bold text-purple-900">{aimSummary.roiMultiple.toFixed(1)}x ROI</p>
              <p className="text-sm text-purple-700 mt-1">
                For every $1 invested in MTM services, the program generates ${aimSummary.roiMultiple.toFixed(2)} in projected cost savings.
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
