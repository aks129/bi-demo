'use client'

interface MetricCardProps {
  label: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  sparkline?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  color = 'gray',
  sparkline
}: MetricCardProps) {
  const colorStyles = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    gray: 'border-gray-200 bg-white text-gray-900'
  }

  return (
    <div className={`rounded-lg border p-4 ${colorStyles[color]}`}>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {sparkline && (
        <div className="mt-2">
          {sparkline}
        </div>
      )}
    </div>
  )
}
