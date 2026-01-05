'use client'

import { useState } from 'react'
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowRight
} from 'lucide-react'
import type { AIInsight } from '@/lib/insights-generator'

interface AIInsightsPanelProps {
  insights: AIInsight[]
  title?: string
}

const typeIcons = {
  alert: AlertTriangle,
  opportunity: Target,
  prediction: TrendingUp,
  recommendation: Lightbulb
}

const typeColors = {
  alert: 'bg-red-100 text-red-600',
  opportunity: 'bg-green-100 text-green-600',
  prediction: 'bg-blue-100 text-blue-600',
  recommendation: 'bg-purple-100 text-purple-600'
}

const severityColors = {
  critical: 'border-red-500 bg-red-50',
  high: 'border-orange-500 bg-orange-50',
  medium: 'border-yellow-500 bg-yellow-50',
  low: 'border-blue-500 bg-blue-50'
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = typeIcons[insight.type]

  return (
    <div className={`border-l-4 rounded-lg p-4 ${severityColors[insight.severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${typeColors[insight.type]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
              <span className={`px-2 py-0.5 text-xs font-medium rounded uppercase ${
                insight.severity === 'critical' ? 'bg-red-200 text-red-800' :
                insight.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                insight.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                {insight.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{insight.summary}</p>

            {insight.metric && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">{insight.metric.label}:</span>
                <span className="text-sm font-bold text-gray-900">{insight.metric.value}</span>
                {insight.metric.trend && (
                  insight.metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : insight.metric.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : null
                )}
              </div>
            )}

            {expanded && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-700">{insight.details}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mt-3">
              {insight.action && (
                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                  {insight.action.label}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {expanded ? (
                  <>Less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>More <ChevronDown className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AIInsightsPanel({ insights, title = 'AI-Powered Insights' }: AIInsightsPanelProps) {
  const [filter, setFilter] = useState<'all' | AIInsight['type']>('all')

  const filteredInsights = filter === 'all'
    ? insights
    : insights.filter(i => i.type === filter)

  const counts = {
    all: insights.length,
    alert: insights.filter(i => i.type === 'alert').length,
    opportunity: insights.filter(i => i.type === 'opportunity').length,
    prediction: insights.filter(i => i.type === 'prediction').length,
    recommendation: insights.filter(i => i.type === 'recommendation').length
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Powered by Rules Engine
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-4">
          {(['all', 'alert', 'opportunity', 'prediction', 'recommendation'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filter === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {counts[type] > 0 && (
                <span className={`ml-1 ${filter === type ? 'text-purple-200' : 'text-gray-400'}`}>
                  ({counts[type]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No insights of this type</p>
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}
      </div>
    </div>
  )
}
