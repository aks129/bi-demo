'use client'

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DataPoint {
  [key: string]: string | number
}

interface AreaChartProps {
  data: DataPoint[]
  xKey: string
  areas: Array<{
    dataKey: string
    color: string
    name: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export function AreaChart({
  data,
  xKey,
  areas,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey={xKey}
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        {showLegend && <Legend />}
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stroke={area.color}
            fill={area.color}
            fillOpacity={0.6}
            name={area.name}
            stackId={stacked ? "1" : undefined}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
