'use client'

interface DashboardCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
  noPadding?: boolean
}

export function DashboardCard({
  title,
  subtitle,
  children,
  action,
  noPadding = false
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action && (
            <div>{action}</div>
          )}
        </div>
      </div>
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  )
}
