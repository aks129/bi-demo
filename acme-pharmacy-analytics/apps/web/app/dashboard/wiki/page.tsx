export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getWikiPages } from '@/lib/platform-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { BookOpen, FileText, Activity, Settings, Clock, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const categories = [
  { key: 'all', name: 'All Pages', icon: BookOpen },
  { key: 'metric', name: 'Metrics', icon: Activity },
  { key: 'process', name: 'Processes', icon: Settings },
  { key: 'clinical', name: 'Clinical', icon: FileText },
]

export default async function WikiPage() {
  const pages = await getWikiPages()

  const pagesByCategory = {
    metric: pages.filter(p => p.category === 'metric'),
    process: pages.filter(p => p.category === 'process'),
    clinical: pages.filter(p => p.category === 'clinical'),
    technical: pages.filter(p => p.category === 'technical'),
  }

  return (
    <DashboardLayout
      title="Knowledge Wiki"
      subtitle="Documentation, guides, and best practices for MTM analytics"
      showChat={false}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">MTM Knowledge Base</h2>
            <p className="text-blue-100">Learn how metrics are calculated, workflows operate, and best practices for success</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Link
            href="/dashboard/data-dictionary"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            View Data Dictionary
          </Link>
          <Link
            href="/dashboard/case-studies"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            Explore Case Studies
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => {
          const count = cat.key === 'all' ? pages.length : pagesByCategory[cat.key as keyof typeof pagesByCategory]?.length || 0
          return (
            <div
              key={cat.key}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="bg-blue-50 p-2 rounded-lg">
                <cat.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500">{cat.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pages by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics */}
        <DashboardCard
          title="Metrics & Calculations"
          subtitle="How key performance indicators are measured"
        >
          <div className="space-y-3">
            {pagesByCategory.metric.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No metric documentation yet</p>
            ) : (
              pagesByCategory.metric.map((page) => (
                <Link
                  key={page.id}
                  href={`/dashboard/wiki/${page.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{page.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {page.content.split('\n')[0].replace(/^#+ /, '')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Metric
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {page.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Processes */}
        <DashboardCard
          title="Processes & Workflows"
          subtitle="Step-by-step operational guides"
        >
          <div className="space-y-3">
            {pagesByCategory.process.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No process documentation yet</p>
            ) : (
              pagesByCategory.process.map((page) => (
                <Link
                  key={page.id}
                  href={`/dashboard/wiki/${page.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{page.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {page.content.split('\n')[0].replace(/^#+ /, '')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      Process
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {page.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Clinical */}
        <DashboardCard
          title="Clinical Protocols"
          subtitle="Clinical guidelines and interventions"
        >
          <div className="space-y-3">
            {pagesByCategory.clinical.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No clinical documentation yet</p>
            ) : (
              pagesByCategory.clinical.map((page) => (
                <Link
                  key={page.id}
                  href={`/dashboard/wiki/${page.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{page.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {page.content.split('\n')[0].replace(/^#+ /, '')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Clinical
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {page.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </DashboardCard>

        {/* All Pages */}
        <DashboardCard
          title="All Documentation"
          subtitle={`${pages.length} pages available`}
        >
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/dashboard/wiki/${page.slug}`}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{page.title}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  page.category === 'metric' ? 'bg-blue-100 text-blue-700' :
                  page.category === 'process' ? 'bg-green-100 text-green-700' :
                  page.category === 'clinical' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {page.category}
                </span>
              </Link>
            ))}
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  )
}
