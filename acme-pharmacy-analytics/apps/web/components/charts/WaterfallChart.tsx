'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts'

interface WaterfallDataPoint {
  name: string
  value: number
  displayValue: number
  fill: string
  isTotal?: boolean
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[]
  height?: number
  showGrid?: boolean
}

/**
 * Waterfall Chart for Financial ROI Visualization
 *
 * Uses a stacked bar approach with transparent "invisible" bars
 * to create the floating waterfall effect.
 */
// Format value as currency
function formatValue(v: number): string {
  if (Math.abs(v) >= 1000000) {
    return `$${(v / 1000000).toFixed(1)}M`
  }
  return `$${(v / 1000).toFixed(0)}K`
}

export function WaterfallChart({
  data,
  height = 350,
  showGrid = true
}: WaterfallChartProps) {
  interface TransformedDataPoint {
    name: string
    invisible: number
    value: number
    displayValue: number
    fill: string
    isPositive: boolean
    isTotal: boolean
  }

  // Transform data for waterfall effect
  // We need to calculate the "invisible" portion that makes bars float
  const transformedData: TransformedDataPoint[] = []
  let runningTotal = 0

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    if (item.isTotal) {
      // Total bar starts from 0
      transformedData.push({
        name: item.name,
        invisible: 0,
        value: item.value,
        displayValue: item.displayValue,
        fill: item.fill,
        isPositive: item.value >= 0,
        isTotal: true
      })
    } else if (item.value >= 0) {
      // Positive value - bar floats on top of running total
      transformedData.push({
        name: item.name,
        invisible: runningTotal,
        value: item.value,
        displayValue: item.displayValue,
        fill: item.fill,
        isPositive: true,
        isTotal: false
      })
      runningTotal += item.value
    } else {
      // Negative value - bar hangs down from running total
      runningTotal += item.value // Add negative value
      transformedData.push({
        name: item.name,
        invisible: runningTotal,
        value: Math.abs(item.value),
        displayValue: item.displayValue,
        fill: item.fill,
        isPositive: false,
        isTotal: false
      })
    }
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof transformedData[0] }> }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      const isNegative = !data.isPositive && !data.isTotal

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
          <p className={`text-lg font-bold ${isNegative ? 'text-red-600' : data.isTotal ? 'text-blue-600' : 'text-green-600'}`}>
            {isNegative ? '-' : ''}{formatValue(data.displayValue)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />}
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#374151' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => formatValue(value)}
          tick={{ fill: '#374151' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#9ca3af" />

        {/* Invisible bar that creates the floating effect */}
        <Bar
          dataKey="invisible"
          stackId="stack"
          fill="transparent"
          radius={0}
        />

        {/* Visible bar with the actual value */}
        <Bar
          dataKey="value"
          stackId="stack"
          radius={[4, 4, 0, 0]}
        >
          {transformedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill}
              stroke={entry.isTotal ? entry.fill : 'transparent'}
              strokeWidth={entry.isTotal ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/**
 * Simple waterfall variant for compact displays
 */
export function SimpleWaterfall({
  grossSavings,
  operationalCosts,
  netBenefit,
  height = 200
}: {
  grossSavings: number
  operationalCosts: number
  netBenefit: number
  height?: number
}) {
  const data: WaterfallDataPoint[] = [
    {
      name: 'Gross Savings',
      value: grossSavings,
      displayValue: grossSavings,
      fill: '#10b981'
    },
    {
      name: 'Op. Costs',
      value: -operationalCosts,
      displayValue: operationalCosts,
      fill: '#ef4444'
    },
    {
      name: 'Net Benefit',
      value: netBenefit,
      displayValue: netBenefit,
      fill: '#3b82f6',
      isTotal: true
    }
  ]

  return <WaterfallChart data={data} height={height} />
}

/**
 * ROI Summary Card with mini waterfall
 */
export function ROISummaryCard({
  grossSavings,
  operationalCosts,
  netBenefit,
  roiMultiple
}: {
  grossSavings: number
  operationalCosts: number
  netBenefit: number
  roiMultiple: number
}) {
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial ROI Summary</h3>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Gross Savings</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(grossSavings)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Op. Costs</p>
          <p className="text-2xl font-bold text-red-600">-{formatCurrency(operationalCosts)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Net Benefit</p>
          <p className={`text-2xl font-bold ${netBenefit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(netBenefit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">ROI Multiple</p>
          <p className="text-2xl font-bold text-gray-900">{roiMultiple.toFixed(1)}x</p>
        </div>
      </div>

      <SimpleWaterfall
        grossSavings={grossSavings}
        operationalCosts={operationalCosts}
        netBenefit={netBenefit}
        height={180}
      />

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-900">
          <strong>So what?</strong> For every $1 invested in MTM services, we generate ${roiMultiple.toFixed(2)} in cost avoidance.
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <strong>Now what?</strong> Focus on high-severity interventions (Level 5-6) to maximize ROI.
        </p>
      </div>
    </div>
  )
}
