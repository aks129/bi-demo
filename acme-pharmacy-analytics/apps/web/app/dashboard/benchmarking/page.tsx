export const dynamic = 'force-dynamic'

import { getBenchmarkMetrics } from '@/lib/platform-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { KPICard } from '@/components/dashboard/KPICard'
import { BarChart } from '@/components/charts/BarChart'
import { BarChart3, TrendingUp, TrendingDown, Minus, Award, Target, Users } from 'lucide-react'

// Percentile gauge component
function PercentileGauge({ percentile, label }: { percentile: number; label: string }) {
  const getColor = (p: number) => {
    if (p >= 75) return 'text-green-600'
    if (p >= 50) return 'text-blue-600'
    if (p >= 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBgColor = (p: number) => {
    if (p >= 75) return 'bg-green-500'
    if (p >= 50) return 'bg-blue-500'
    if (p >= 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto">
        {/* Background circle */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(percentile / 100) * 251.2} 251.2`}
            className={getBgColor(percentile)}
            strokeLinecap="round"
          />
        </svg>
        {/* Percentile text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getColor(percentile)}`}>
            {percentile}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-500">Percentile</p>
    </div>
  )
}

export default async function BenchmarkingPage() {
  const metrics = await getBenchmarkMetrics()

  // Format metrics for chart
  const chartData = metrics.map(m => ({
    name: m.metricName.replace(' Rate', '').replace(' Multiple', ''),
    'Your Value': m.clientValue,
    'National Avg': m.nationalAvg,
    'Top 10%': m.topDecile,
  }))

  // Calculate overall score
  const overallPercentile = Math.round(
    metrics.reduce((sum, m) => sum + m.percentile, 0) / metrics.length
  )

  const aboveAvgCount = metrics.filter(m => m.clientValue > m.nationalAvg).length

  return (
    <DashboardLayout
      title="Benchmarking & National Comparison"
      subtitle="Compare your performance against anonymized national averages from our client base"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Overall Ranking"
          value={`${overallPercentile}th`}
          subtitle="National percentile"
          status={overallPercentile >= 75 ? 'healthy' : overallPercentile >= 50 ? 'neutral' : 'warning'}
          icon={<Award className="h-10 w-10" />}
        />
        <KPICard
          title="Above Average"
          value={`${aboveAvgCount}/${metrics.length}`}
          subtitle="Metrics exceeding national avg"
          status={aboveAvgCount >= metrics.length / 2 ? 'healthy' : 'warning'}
          icon={<TrendingUp className="h-10 w-10" />}
        />
        <KPICard
          title="Benchmarked Metrics"
          value={metrics.length}
          subtitle="Key performance indicators"
          status="neutral"
          icon={<BarChart3 className="h-10 w-10" />}
        />
        <KPICard
          title="Data Source"
          value="200+"
          subtitle="Anonymous client programs"
          status="neutral"
          icon={<Users className="h-10 w-10" />}
        />
      </div>

      {/* Percentile Gauges */}
      <DashboardCard
        title="Performance by Percentile"
        subtitle="Your ranking compared to all programs nationally"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 py-4">
          {metrics.map((metric) => (
            <PercentileGauge
              key={metric.metricKey}
              percentile={metric.percentile}
              label={metric.metricName.replace(' Rate', '').replace(' Multiple', '')}
            />
          ))}
        </div>
      </DashboardCard>

      {/* Comparison Chart */}
      <div className="mt-8">
        <DashboardCard
          title="Metric Comparison"
          subtitle="Your values vs national averages and top performers"
        >
          <BarChart
            data={chartData}
            xKey="name"
            bars={[
              { dataKey: 'Your Value', color: '#3b82f6', name: 'Your Value' },
              { dataKey: 'National Avg', color: '#9ca3af', name: 'National Avg' },
              { dataKey: 'Top 10%', color: '#10b981', name: 'Top 10%' },
            ]}
            height={400}
          />
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              Your Performance
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              National Average
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              Top 10% (Goal)
            </span>
          </div>
        </DashboardCard>
      </div>

      {/* Detailed Metrics Table */}
      <div className="mt-8">
        <DashboardCard
          title="Detailed Benchmark Analysis"
          subtitle="Complete comparison data with trends"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    National Avg
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top 10%
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bottom 10%
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gap to Top
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map((metric) => {
                  const isAboveAvg = metric.clientValue > metric.nationalAvg
                  const gapToTop = metric.topDecile - metric.clientValue
                  const isPercentageMetric = metric.metricKey.includes('rate') || metric.metricKey === 'adherence-pdc'

                  // For refusal rate, lower is better
                  const isLowerBetter = metric.metricKey === 'refusal-rate'
                  const displayIsGood = isLowerBetter ? !isAboveAvg : isAboveAvg

                  return (
                    <tr key={metric.metricKey} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{metric.metricName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${displayIsGood ? 'text-green-600' : 'text-red-600'}`}>
                          {isPercentageMetric ? `${metric.clientValue.toFixed(1)}%` :
                           metric.metricKey === 'cost-avoidance' ? `$${metric.clientValue}` :
                           metric.clientValue.toFixed(1)}
                          {metric.metricKey === 'roi-multiple' && 'x'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {isPercentageMetric ? `${metric.nationalAvg.toFixed(1)}%` :
                         metric.metricKey === 'cost-avoidance' ? `$${metric.nationalAvg}` :
                         metric.nationalAvg.toFixed(1)}
                        {metric.metricKey === 'roi-multiple' && 'x'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                        {isPercentageMetric ? `${metric.topDecile.toFixed(1)}%` :
                         metric.metricKey === 'cost-avoidance' ? `$${metric.topDecile}` :
                         metric.topDecile.toFixed(1)}
                        {metric.metricKey === 'roi-multiple' && 'x'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600">
                        {isPercentageMetric ? `${metric.bottomDecile.toFixed(1)}%` :
                         metric.metricKey === 'cost-avoidance' ? `$${metric.bottomDecile}` :
                         metric.bottomDecile.toFixed(1)}
                        {metric.metricKey === 'roi-multiple' && 'x'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                metric.percentile >= 75 ? 'bg-green-500' :
                                metric.percentile >= 50 ? 'bg-blue-500' :
                                metric.percentile >= 25 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${metric.percentile}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {metric.percentile}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`flex items-center gap-1 ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {metric.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                          {metric.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                          {metric.trend === 'stable' && <Minus className="h-4 w-4" />}
                          {metric.trend === 'up' ? 'Improving' :
                           metric.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {gapToTop > 0 ? (
                          <span className="text-amber-600">
                            +{isPercentageMetric ? `${gapToTop.toFixed(1)}%` :
                              metric.metricKey === 'cost-avoidance' ? `$${gapToTop.toFixed(0)}` :
                              gapToTop.toFixed(1)} needed
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Top performer
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      {/* Impact-First Insights */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-blue-900 font-semibold text-lg mb-2">Benchmark Insights</h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p><strong>So what?</strong> You&apos;re performing above national average in {aboveAvgCount} of {metrics.length} key metrics, placing you in the {overallPercentile}th percentile overall.</p>
          <p><strong>Now what?</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            {metrics.filter(m => m.percentile < 50).slice(0, 3).map(m => (
              <li key={m.metricKey}>
                <strong>{m.metricName}:</strong> Currently at {m.percentile}th percentile.
                Focus on improving from {m.clientValue.toFixed(1)}{m.metricKey.includes('rate') ? '%' : ''} to reach top quartile ({m.topDecile.toFixed(1)}{m.metricKey.includes('rate') ? '%' : ''}).
              </li>
            ))}
            {metrics.filter(m => m.percentile >= 75).slice(0, 2).map(m => (
              <li key={m.metricKey} className="text-green-800">
                <strong>{m.metricName}:</strong> Top performer at {m.percentile}th percentile. Maintain current strategies.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
