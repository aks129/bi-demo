'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import {
  Rss,
  CheckCircle,
  FileText,
  MessageSquare,
  BookOpen,
  Bell,
  TrendingUp,
  RefreshCw,
  Filter,
  Clock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { mockActivityItems, type MockActivityItem } from '@/lib/platform-mock-data'

const activityTypes = [
  { key: 'all', name: 'All Activity', icon: Rss },
  { key: 'completed', name: 'Completions', icon: CheckCircle },
  { key: 'created', name: 'Created', icon: FileText },
  { key: 'posted', name: 'Community', icon: MessageSquare },
  { key: 'updated', name: 'Updates', icon: BookOpen },
  { key: 'alert', name: 'Alerts', icon: Bell },
]

const actionIcons: Record<string, typeof CheckCircle> = {
  completed: CheckCircle,
  created: FileText,
  posted: MessageSquare,
  updated: BookOpen,
  commented: MessageSquare,
  published: TrendingUp,
  alert: Bell,
}

const actionColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-600',
  created: 'bg-blue-100 text-blue-600',
  posted: 'bg-purple-100 text-purple-600',
  updated: 'bg-amber-100 text-amber-600',
  commented: 'bg-purple-100 text-purple-600',
  published: 'bg-green-100 text-green-600',
  alert: 'bg-red-100 text-red-600',
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<MockActivityItem[]>([])
  const [selectedType, setSelectedType] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    // Initial load
    loadActivities()

    // Poll every 30 seconds
    const interval = setInterval(() => {
      loadActivities()
    }, 30000)

    return () => clearInterval(interval)
  }, [selectedType])

  const loadActivities = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      let filtered = [...mockActivityItems]
      if (selectedType !== 'all') {
        filtered = filtered.filter(a => a.action === selectedType)
      }
      setActivities(filtered)
      setLastRefresh(new Date())
      setIsRefreshing(false)
    }, 500)
  }

  const groupActivitiesByTime = (items: MockActivityItem[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups: { label: string; items: MockActivityItem[] }[] = [
      { label: 'Today', items: [] },
      { label: 'Yesterday', items: [] },
      { label: 'This Week', items: [] },
      { label: 'Earlier', items: [] },
    ]

    items.forEach(item => {
      const date = new Date(item.createdAt)
      if (date >= today) {
        groups[0].items.push(item)
      } else if (date >= yesterday) {
        groups[1].items.push(item)
      } else if (date >= thisWeek) {
        groups[2].items.push(item)
      } else {
        groups[3].items.push(item)
      }
    })

    return groups.filter(g => g.items.length > 0)
  }

  const groupedActivities = groupActivitiesByTime(activities)

  return (
    <DashboardLayout
      title="Activity Feed"
      subtitle="Real-time updates from across the platform"
      showChat={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Rss className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Activity Feed</h2>
              <p className="text-indigo-100 text-sm">
                Stay updated with the latest actions across your organization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadActivities}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardCard title="Filter by Type">
            <div className="space-y-1">
              {activityTypes.map((type) => {
                const count = type.key === 'all'
                  ? mockActivityItems.length
                  : mockActivityItems.filter(a => a.action === type.key).length
                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setSelectedType(type.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === type.key
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedType === type.key
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </DashboardCard>

          {/* Last Updated */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated {formatDistanceToNow(lastRefresh, { addSuffix: true })}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Auto-refreshes every 30 seconds</p>
          </div>

          {/* Quick Stats */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-900 mb-3">Today&apos;s Activity</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-indigo-700">CMRs Completed</span>
                <span className="font-medium text-indigo-900">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700">Reports Generated</span>
                <span className="font-medium text-indigo-900">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700">Community Posts</span>
                <span className="font-medium text-indigo-900">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Activity Timeline */}
        <div className="lg:col-span-3">
          {groupedActivities.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activities match your filter</p>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedActivities.map((group) => (
                <div key={group.label}>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    {group.label}
                  </h3>
                  <div className="space-y-4">
                    {group.items.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function ActivityItem({ activity }: { activity: MockActivityItem }) {
  const Icon = actionIcons[activity.action] || Rss
  const colorClass = actionColors[activity.action] || 'bg-gray-100 text-gray-600'

  const getEntityLink = () => {
    switch (activity.entityType) {
      case 'Community':
        return `/dashboard/community/${activity.entityId}`
      case 'Wiki':
        return `/dashboard/wiki/${activity.entityId}`
      case 'Report':
        return `/dashboard/reports/${activity.entityId}`
      case 'CaseStudy':
        return `/dashboard/case-studies/${activity.entityId}`
      default:
        return '#'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{activity.userName}</span>
            <span className="text-gray-500">{activity.action}</span>
            <span className="text-gray-500">{activity.entityType.toLowerCase()}</span>
          </div>

          {activity.entityTitle && (
            <Link
              href={getEntityLink()}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {activity.entityTitle}
            </Link>
          )}

          {/* Metadata */}
          {activity.metadata && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(activity.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}

          {/* Time */}
          <p className="text-xs text-gray-400 mt-2">
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  )
}
