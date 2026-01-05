'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import {
  FileText,
  Plus,
  Search,
  BarChart3,
  LineChart,
  AreaChart,
  Table,
  LayoutDashboard,
  Clock,
  User,
  Share2,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Globe,
  Lock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { mockCustomReports, type MockCustomReport } from '@/lib/platform-mock-data'

const chartIcons: Record<string, typeof BarChart3> = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  table: Table,
  kpi: LayoutDashboard,
}

const chartLabels: Record<string, string> = {
  bar: 'Bar Chart',
  line: 'Line Chart',
  area: 'Area Chart',
  table: 'Data Table',
  kpi: 'KPI Cards',
}

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const filteredReports = mockCustomReports.filter(report => {
    const matchesSearch = search === '' ||
      report.name.toLowerCase().includes(search.toLowerCase()) ||
      report.description?.toLowerCase().includes(search.toLowerCase())

    const matchesFilter = filter === 'all' ||
      (filter === 'mine' && !report.isPublic) ||
      (filter === 'shared' && report.isPublic)

    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout
      title="Saved Reports"
      subtitle="Access and manage your custom reports"
      showChat={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Saved Reports</h2>
              <p className="text-emerald-100 text-sm">
                {mockCustomReports.length} reports available
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/report-builder"
            className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Report
          </Link>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'mine', 'shared'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All Reports' : f === 'mine' ? 'My Reports' : 'Shared'}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <DashboardCard title="No Reports">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No reports found</p>
            <Link
              href="/dashboard/report-builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Report
            </Link>
          </div>
        </DashboardCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              isMenuOpen={activeMenu === report.id}
              onMenuToggle={() => setActiveMenu(activeMenu === report.id ? null : report.id)}
              onMenuClose={() => setActiveMenu(null)}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{mockCustomReports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Shared Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCustomReports.filter(r => r.isPublic).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Run</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCustomReports[0]?.lastRunAt
                  ? formatDistanceToNow(mockCustomReports[0].lastRunAt, { addSuffix: true })
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ReportCard({
  report,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: {
  report: MockCustomReport
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}) {
  const ChartIcon = chartIcons[report.config.chartType] || BarChart3

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <ChartIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{report.name}</h3>
              <p className="text-xs text-gray-500">{chartLabels[report.config.chartType]}</p>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={onMenuToggle}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={onMenuClose} />
                <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      onMenuClose()
                      // Run report
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Run Report
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      onMenuClose()
                      // Edit report
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      onMenuClose()
                      // Duplicate report
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                  <hr className="my-1" />
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      onMenuClose()
                      // Delete report
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {report.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{report.description}</p>
        )}

        {/* Metrics */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {report.config.metrics.slice(0, 3).map(metric => (
            <span
              key={metric}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {metric}
            </span>
          ))}
          {report.config.metrics.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              +{report.config.metrics.length - 3} more
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {report.authorName}
            </span>
            {report.isPublic ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Globe className="h-3 w-3" />
                Shared
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {report.lastRunAt
            ? `Last run ${formatDistanceToNow(report.lastRunAt, { addSuffix: true })}`
            : 'Never run'}
        </div>
        <Link
          href={`/dashboard/reports/${report.id}`}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          View Report →
        </Link>
      </div>
    </div>
  )
}
