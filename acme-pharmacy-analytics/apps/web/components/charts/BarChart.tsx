'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface DataPoint {
  [key: string]: string | number
}

interface BarChartProps {
  data: DataPoint[]
  xKey: string
  bars: Array<{
    dataKey: string
    color: string
    name: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  layout?: 'horizontal' | 'vertical'
  colorByValue?: {
    threshold: number
    above: string
    below: string
  }
}

export function BarChart({
  data,
  xKey,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  layout = 'horizontal',
  colorByValue
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {layout === 'horizontal' ? (
          <>
            <XAxis
              dataKey={xKey}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              dataKey={xKey}
              type="category"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        {showLegend && <Legend />}
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
          >
            {colorByValue && data.map((entry, index) => {
              const value = entry[bar.dataKey] as number
              const color = value >= colorByValue.threshold ? colorByValue.above : colorByValue.below
              return <Cell key={`cell-${index}`} fill={color} />
            })}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
