'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import {
  Wand2,
  Plus,
  X,
  BarChart3,
  LineChart,
  AreaChart,
  Table,
  LayoutDashboard,
  GripVertical,
  Play,
  Save,
  Download,
  Settings,
  ChevronDown,
  ChevronRight,
  Check,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { availableMetrics, availableFilters, chartTypes, mockCustomReports } from '@/lib/platform-mock-data'

interface ReportConfig {
  name: string
  description: string
  metrics: string[]
  filters: Record<string, string>
  groupBy: string
  chartType: string
}

const groupByOptions = [
  { key: 'none', name: 'No Grouping' },
  { key: 'month', name: 'By Month' },
  { key: 'contract', name: 'By Contract' },
  { key: 'drugClass', name: 'By Drug Class' },
  { key: 'region', name: 'By Region' },
]

// Generate sample data based on config
function generateSampleData(config: ReportConfig) {
  const labels = config.groupBy === 'month'
    ? ['Oct', 'Nov', 'Dec', 'Jan']
    : config.groupBy === 'contract'
    ? ['Blue Shield NE', 'HealthFirst MW', 'SunCare West']
    : config.groupBy === 'drugClass'
    ? ['Diabetes', 'Hypertension', 'Cholesterol', 'COPD']
    : config.groupBy === 'region'
    ? ['Northeast', 'Midwest', 'South', 'West']
    : ['Total']

  return labels.map(label => {
    const row: Record<string, unknown> = { name: label }
    config.metrics.forEach(metricKey => {
      const metric = availableMetrics.find(m => m.key === metricKey)
      if (metric) {
        if (metric.type === 'percentage') {
          row[metricKey] = Math.round(60 + Math.random() * 30)
        } else if (metric.type === 'count') {
          row[metricKey] = Math.round(100 + Math.random() * 500)
        } else if (metric.type === 'currency') {
          row[metricKey] = Math.round(10000 + Math.random() * 90000)
        } else if (metric.type === 'ratio') {
          row[metricKey] = (2 + Math.random() * 3).toFixed(1)
        } else {
          row[metricKey] = Math.round(50 + Math.random() * 50)
        }
      }
    })
    return row
  })
}

const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ReportBuilderPage() {
  const [config, setConfig] = useState<ReportConfig>({
    name: 'New Report',
    description: '',
    metrics: [],
    filters: { dateRange: 'last30days', contract: 'all' },
    groupBy: 'month',
    chartType: 'bar',
  })
  const [searchMetric, setSearchMetric] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['MTM', 'Adherence'])
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  // Regenerate preview data when config changes
  useEffect(() => {
    if (config.metrics.length > 0) {
      setPreviewData(generateSampleData(config))
    } else {
      setPreviewData([])
    }
  }, [config])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const addMetric = (metricKey: string) => {
    if (!config.metrics.includes(metricKey)) {
      setConfig(prev => ({ ...prev, metrics: [...prev.metrics, metricKey] }))
    }
  }

  const removeMetric = (metricKey: string) => {
    setConfig(prev => ({ ...prev, metrics: prev.metrics.filter(m => m !== metricKey) }))
  }

  const updateFilter = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, filters: { ...prev.filters, [key]: value } }))
  }

  const getMetricsByCategory = () => {
    const categories: Record<string, typeof availableMetrics> = {}
    availableMetrics.forEach(metric => {
      if (!categories[metric.category]) {
        categories[metric.category] = []
      }
      if (searchMetric === '' || metric.name.toLowerCase().includes(searchMetric.toLowerCase())) {
        categories[metric.category].push(metric)
      }
    })
    return categories
  }

  const metricsByCategory = getMetricsByCategory()

  const renderChart = () => {
    if (config.metrics.length === 0 || previewData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Select metrics to see preview</p>
        </div>
      )
    }

    switch (config.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((metricKey, index) => {
                const metric = availableMetrics.find(m => m.key === metricKey)
                return (
                  <Bar
                    key={metricKey}
                    dataKey={metricKey}
                    name={metric?.name || metricKey}
                    fill={chartColors[index % chartColors.length]}
                  />
                )
              })}
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((metricKey, index) => {
                const metric = availableMetrics.find(m => m.key === metricKey)
                return (
                  <Line
                    key={metricKey}
                    type="monotone"
                    dataKey={metricKey}
                    name={metric?.name || metricKey}
                    stroke={chartColors[index % chartColors.length]}
                    strokeWidth={2}
                  />
                )
              })}
            </RechartsLineChart>
          </ResponsiveContainer>
        )
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsAreaChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((metricKey, index) => {
                const metric = availableMetrics.find(m => m.key === metricKey)
                return (
                  <Area
                    key={metricKey}
                    type="monotone"
                    dataKey={metricKey}
                    name={metric?.name || metricKey}
                    fill={chartColors[index % chartColors.length]}
                    stroke={chartColors[index % chartColors.length]}
                    fillOpacity={0.3}
                  />
                )
              })}
            </RechartsAreaChart>
          </ResponsiveContainer>
        )
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {groupByOptions.find(g => g.key === config.groupBy)?.name || 'Group'}
                  </th>
                  {config.metrics.map(metricKey => {
                    const metric = availableMetrics.find(m => m.key === metricKey)
                    return (
                      <th key={metricKey} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {metric?.name || metricKey}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name as string}</td>
                    {config.metrics.map(metricKey => {
                      const metric = availableMetrics.find(m => m.key === metricKey)
                      const value = row[metricKey]
                      let formatted = String(value)
                      if (metric?.type === 'percentage') formatted = `${value}%`
                      else if (metric?.type === 'currency') formatted = `$${Number(value).toLocaleString()}`
                      else if (metric?.type === 'ratio') formatted = `${value}x`
                      return (
                        <td key={metricKey} className="px-4 py-3 text-sm text-gray-600">
                          {formatted}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'kpi':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {config.metrics.map((metricKey, index) => {
              const metric = availableMetrics.find(m => m.key === metricKey)
              const value = previewData[0]?.[metricKey]
              let formatted = String(value)
              if (metric?.type === 'percentage') formatted = `${value}%`
              else if (metric?.type === 'currency') formatted = `$${Number(value).toLocaleString()}`
              else if (metric?.type === 'ratio') formatted = `${value}x`
              return (
                <div
                  key={metricKey}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <p className="text-sm text-gray-500">{metric?.name || metricKey}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: chartColors[index % chartColors.length] }}>
                    {formatted}
                  </p>
                </div>
              )
            })}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout
      title="Report Builder"
      subtitle="Create custom reports with your own metrics and visualizations"
      showChat={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Report Builder</h2>
              <p className="text-blue-100 text-sm">
                Drag metrics, configure filters, and visualize your data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              disabled={config.metrics.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              Save Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Metrics */}
        <div className="lg:col-span-3 space-y-6">
          <DashboardCard title="Available Metrics" subtitle="Click to add to report">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search metrics..."
                  value={searchMetric}
                  onChange={(e) => setSearchMetric(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Metric Categories */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {Object.entries(metricsByCategory).map(([category, metrics]) => (
                <div key={category}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <span>{category}</span>
                    {expandedCategories.includes(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategories.includes(category) && (
                    <div className="ml-2 space-y-1">
                      {metrics.map(metric => {
                        const isSelected = config.metrics.includes(metric.key)
                        return (
                          <button
                            key={metric.key}
                            type="button"
                            onClick={() => isSelected ? removeMetric(metric.key) : addMetric(metric.key)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <GripVertical className="h-3 w-3 text-gray-400" />
                              {metric.name}
                            </span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Saved Reports */}
          <DashboardCard title="My Reports" subtitle="Previously saved reports">
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {mockCustomReports.map(report => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => {
                    setConfig({
                      name: report.name,
                      description: report.description || '',
                      metrics: report.config.metrics,
                      filters: report.config.filters,
                      groupBy: report.config.groupBy[0] || 'none',
                      chartType: report.config.chartType,
                    })
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500 truncate">{report.description}</p>
                </button>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Center Panel - Configuration */}
        <div className="lg:col-span-5 space-y-6">
          {/* Report Name */}
          <DashboardCard title="Report Configuration">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </DashboardCard>

          {/* Selected Metrics */}
          <DashboardCard
            title="Selected Metrics"
            subtitle={`${config.metrics.length} selected`}
          >
            {config.metrics.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Click metrics from the left panel to add them</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {config.metrics.map((metricKey, index) => {
                  const metric = availableMetrics.find(m => m.key === metricKey)
                  return (
                    <span
                      key={metricKey}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${chartColors[index % chartColors.length]}20`,
                        color: chartColors[index % chartColors.length],
                      }}
                    >
                      {metric?.name || metricKey}
                      <button
                        type="button"
                        onClick={() => removeMetric(metricKey)}
                        className="hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </DashboardCard>

          {/* Filters */}
          <DashboardCard title="Filters">
            <div className="grid grid-cols-2 gap-4">
              {availableFilters.map(filter => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.name}
                  </label>
                  <select
                    value={config.filters[filter.key] || filter.options[0]}
                    onChange={(e) => updateFilter(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {filter.options.map(option => (
                      <option key={option} value={option}>
                        {option === 'all' ? 'All' : option.replace(/([A-Z])/g, ' $1').replace(/last(\d+)days/, 'Last $1 Days')}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Group By */}
          <DashboardCard title="Group By">
            <div className="flex flex-wrap gap-2">
              {groupByOptions.map(option => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, groupBy: option.key }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    config.groupBy === option.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right Panel - Visualization */}
        <div className="lg:col-span-4 space-y-6">
          {/* Chart Type */}
          <DashboardCard title="Visualization Type">
            <div className="grid grid-cols-5 gap-2">
              {chartTypes.map(type => {
                const icons: Record<string, typeof BarChart3> = {
                  bar: BarChart3,
                  line: LineChart,
                  area: AreaChart,
                  table: Table,
                  kpi: LayoutDashboard,
                }
                const Icon = icons[type.key] || BarChart3
                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, chartType: type.key }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                      config.chartType === type.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{type.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </DashboardCard>

          {/* Live Preview */}
          {showPreview && (
            <DashboardCard
              title="Live Preview"
              subtitle={config.name}
              action={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewData(generateSampleData(config))}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Refresh preview"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              }
            >
              {renderChart()}
            </DashboardCard>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click metrics to add/remove them</li>
              <li>• Choose grouping to segment data</li>
              <li>• Preview updates in real-time</li>
              <li>• Save to access reports later</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Save Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="public"
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="public" className="text-sm text-gray-700">
                  Share with team (public)
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // In a real app, this would save to the database
                  alert(`Report "${config.name}" saved successfully!`)
                  setShowSaveModal(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
