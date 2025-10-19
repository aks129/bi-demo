'use client'

import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    period: string
  }
  status?: 'healthy' | 'warning' | 'critical' | 'neutral'
  subtitle?: string
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function KPICard({
  title,
  value,
  change,
  status = 'neutral',
  subtitle,
  icon,
  size = 'md'
}: KPICardProps) {
  const statusColors = {
    healthy: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50',
    neutral: 'border-gray-200 bg-white'
  }

  const textColors = {
    healthy: 'text-green-700',
    warning: 'text-yellow-700',
    critical: 'text-red-700',
    neutral: 'text-gray-900'
  }

  const sizes = {
    sm: { card: 'p-4', value: 'text-2xl', title: 'text-xs' },
    md: { card: 'p-6', value: 'text-3xl', title: 'text-sm' },
    lg: { card: 'p-8', value: 'text-4xl', title: 'text-base' }
  }

  const getTrendIcon = () => {
    if (!change) return null
    if (change.value > 0) return <ArrowUp className="h-4 w-4" />
    if (change.value < 0) return <ArrowDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (!change) return ''
    if (change.value > 0) return 'text-green-600'
    if (change.value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className={`rounded-lg border-2 ${statusColors[status]} ${sizes[size].card} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`font-medium text-gray-600 uppercase tracking-wide ${sizes[size].title}`}>
            {title}
          </p>
          <p className={`font-bold mt-2 ${textColors[status]} ${sizes[size].value}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(change.value)}%</span>
              <span className="text-gray-500 font-normal">{change.period}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${textColors[status]} opacity-20`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
