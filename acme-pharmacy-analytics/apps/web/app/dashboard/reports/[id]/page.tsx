'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import {
  ArrowLeft,
  Download,
  Share2,
  Edit,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Globe,
  Lock,
  BarChart3,
  LineChart,
  AreaChart,
  Table,
  LayoutDashboard,
  Printer
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
import { formatDistanceToNow, format } from 'date-fns'
import { mockCustomReports, availableMetrics } from '@/lib/platform-mock-data'

const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function generateReportData(config: { metrics: string[], groupBy: string[] }) {
  const groupBy = config.groupBy[0] || 'month'
  const labels = groupBy === 'month'
    ? ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026']
    : groupBy === 'contract'
    ? ['Blue Shield NE', 'HealthFirst MW', 'SunCare West']
    : groupBy === 'drugClass'
    ? ['Diabetes', 'Hypertension', 'Cholesterol', 'COPD']
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
          row[metricKey] = Number((2 + Math.random() * 3).toFixed(1))
        } else {
          row[metricKey] = Math.round(50 + Math.random() * 50)
        }
      }
    })
    return row
  })
}

export default function ReportViewPage() {
  const params = useParams()
  const reportId = params.id as string
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState<Record<string, unknown>[]>([])

  const report = mockCustomReports.find(r => r.id === reportId)

  useEffect(() => {
    if (report) {
      setData(generateReportData(report.config))
    }
  }, [report])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      if (report) {
        setData(generateReportData(report.config))
      }
      setIsRefreshing(false)
    }, 1000)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!report) {
    return (
      <DashboardLayout
        title="Report Not Found"
        subtitle="The requested report could not be found"
        showChat={false}
      >
        <DashboardCard title="Error">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Report not found</p>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Link>
          </div>
        </DashboardCard>
      </DashboardLayout>
    )
  }

  const chartIcons: Record<string, typeof BarChart3> = {
    bar: BarChart3,
    line: LineChart,
    area: AreaChart,
    table: Table,
    kpi: LayoutDashboard,
  }

  const ChartIcon = chartIcons[report.config.chartType] || BarChart3

  const renderChart = () => {
    if (data.length === 0) return null

    switch (report.config.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {report.config.metrics.map((metricKey, index) => {
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
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {report.config.metrics.map((metricKey, index) => {
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
          <ResponsiveContainer width="100%" height={400}>
            <RechartsAreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {report.config.metrics.map((metricKey, index) => {
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {report.config.groupBy[0]?.replace(/([A-Z])/g, ' $1') || 'Group'}
                  </th>
                  {report.config.metrics.map(metricKey => {
                    const metric = availableMetrics.find(m => m.key === metricKey)
                    return (
                      <th key={metricKey} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {metric?.name || metricKey}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name as string}</td>
                    {report.config.metrics.map(metricKey => {
                      const metric = availableMetrics.find(m => m.key === metricKey)
                      const value = row[metricKey]
                      let formatted = String(value)
                      if (metric?.type === 'percentage') formatted = `${value}%`
                      else if (metric?.type === 'currency') formatted = `$${Number(value).toLocaleString()}`
                      else if (metric?.type === 'ratio') formatted = `${value}x`
                      return (
                        <td key={metricKey} className="px-6 py-4 text-sm text-gray-600">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {report.config.metrics.map((metricKey, index) => {
              const metric = availableMetrics.find(m => m.key === metricKey)
              // Calculate total/average
              let value: string | number = 0
              if (metric?.type === 'percentage' || metric?.type === 'ratio') {
                const sum = data.reduce((acc, row) => acc + Number(row[metricKey] || 0), 0)
                value = (sum / data.length).toFixed(1)
              } else {
                value = data.reduce((acc, row) => acc + Number(row[metricKey] || 0), 0)
              }
              let formatted = String(value)
              if (metric?.type === 'percentage') formatted = `${value}%`
              else if (metric?.type === 'currency') formatted = `$${Number(value).toLocaleString()}`
              else if (metric?.type === 'ratio') formatted = `${value}x`
              else if (metric?.type === 'count') formatted = Number(value).toLocaleString()

              return (
                <div
                  key={metricKey}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <p className="text-sm text-gray-500 mb-1">{metric?.name || metricKey}</p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: chartColors[index % chartColors.length] }}
                  >
                    {formatted}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {metric?.type === 'percentage' || metric?.type === 'ratio' ? 'Average' : 'Total'}
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
      title={report.name}
      subtitle={report.description || 'Custom report'}
      showChat={false}
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Link
          href="/dashboard/reports"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link
            href={`/dashboard/report-builder?edit=${report.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Report
          </Link>
        </div>
      </div>

      {/* Report Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <ChartIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{report.name}</h2>
              {report.description && (
                <p className="text-gray-500 text-sm">{report.description}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {report.authorName}
            </span>
            <span className="flex items-center gap-1">
              {report.isPublic ? (
                <>
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">Shared</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Private
                </>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {format(report.createdAt, 'MMM d, yyyy')}
            </span>
            {report.lastRunAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last run {formatDistanceToNow(report.lastRunAt, { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Report Filters Summary */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(report.config.filters).map(([key, value]) => (
          <span
            key={key}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
          >
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
            <span>{value === 'all' ? 'All' : value.replace(/last(\d+)days/, 'Last $1 Days')}</span>
          </span>
        ))}
        {report.config.groupBy.length > 0 && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
            <span className="font-medium">Group By:</span>
            <span className="capitalize">{report.config.groupBy[0].replace(/([A-Z])/g, ' $1')}</span>
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="flex flex-wrap gap-2 mb-6">
        {report.config.metrics.map((metricKey, index) => {
          const metric = availableMetrics.find(m => m.key === metricKey)
          return (
            <span
              key={metricKey}
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${chartColors[index % chartColors.length]}20`,
                color: chartColors[index % chartColors.length],
              }}
            >
              {metric?.name || metricKey}
            </span>
          )
        })}
      </div>

      {/* Chart */}
      <DashboardCard title="Report Visualization">
        {renderChart()}
      </DashboardCard>

      {/* Raw Data Table (always show for non-table charts) */}
      {report.config.chartType !== 'table' && (
        <div className="mt-6">
          <DashboardCard title="Raw Data">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {report.config.groupBy[0]?.replace(/([A-Z])/g, ' $1') || 'Group'}
                    </th>
                    {report.config.metrics.map(metricKey => {
                      const metric = availableMetrics.find(m => m.key === metricKey)
                      return (
                        <th key={metricKey} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {metric?.name || metricKey}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name as string}</td>
                      {report.config.metrics.map(metricKey => {
                        const metric = availableMetrics.find(m => m.key === metricKey)
                        const value = row[metricKey]
                        let formatted = String(value)
                        if (metric?.type === 'percentage') formatted = `${value}%`
                        else if (metric?.type === 'currency') formatted = `$${Number(value).toLocaleString()}`
                        else if (metric?.type === 'ratio') formatted = `${value}x`
                        return (
                          <td key={metricKey} className="px-6 py-4 text-sm text-gray-600">
                            {formatted}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      )}
    </DashboardLayout>
  )
}
