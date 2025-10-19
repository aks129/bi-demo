import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { KPICard } from '@/components/dashboard/KPICard'
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

async function getInsightsAndAlerts() {
  const notifications = await prisma.factNotification.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  const activeCount = notifications.filter(n => n.status === 'Active').length
  const resolvedCount = notifications.filter(n => n.status === 'Resolved').length
  const highSeverityCount = notifications.filter(n => n.severity === 'High' && n.status === 'Active').length

  return {
    notifications,
    activeCount,
    resolvedCount,
    highSeverityCount,
  }
}

export default async function InsightsAlertsPage() {
  const data = await getInsightsAndAlerts()

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="h-5 w-5" />
      case 'Medium':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  return (
    <DashboardLayout
      title="Insights & Alerts"
      subtitle="Real-time notifications and actionable intelligence from the rules engine"
    >
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Alerts"
          value={data.activeCount}
          subtitle="Requires attention"
          status={data.activeCount > 5 ? 'warning' : 'healthy'}
          icon={<Bell className="h-10 w-10" />}
        />
        <KPICard
          title="High Priority"
          value={data.highSeverityCount}
          subtitle="Immediate action needed"
          status={data.highSeverityCount > 0 ? 'critical' : 'healthy'}
          icon={<AlertTriangle className="h-10 w-10" />}
        />
        <KPICard
          title="Resolved Today"
          value={data.resolvedCount}
          subtitle="Completed this period"
          status="healthy"
          icon={<CheckCircle className="h-10 w-10" />}
        />
        <KPICard
          title="Avg Response Time"
          value="2.4h"
          subtitle="Time to resolution"
          status="healthy"
          icon={<Clock className="h-10 w-10" />}
        />
      </div>

      {/* Impact-First Context */}
      <div className="mb-8 bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
        <h3 className="text-purple-900 font-semibold text-lg mb-2">Rules Engine Insights</h3>
        <div className="text-purple-800 text-sm space-y-2">
          <p><strong>How it works:</strong> Our rules engine continuously monitors adherence data, identifying patterns and anomalies that require intervention.</p>
          <p><strong>So what?</strong> Automated alerts ensure no at-risk member falls through the cracks, maintaining Star Ratings compliance and improving health outcomes.</p>
          <p><strong>Now what?</strong> Each alert includes a playbook with step-by-step actions. Review active alerts below and assign owners for resolution.</p>
        </div>
      </div>

      {/* Active Alerts */}
      <DashboardCard
        title="Active Alerts"
        subtitle={`${data.activeCount} alerts requiring attention`}
      >
        <div className="space-y-4">
          {data.notifications
            .filter(n => n.status === 'Active')
            .map((notification) => {
              const severityColor = getSeverityColor(notification.severity)
              const icon = getSeverityIcon(notification.severity)

              return (
                <div
                  key={notification.id}
                  className={`border-2 rounded-lg p-6 ${severityColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-0.5">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{notification.message}</h4>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                            notification.severity === 'High' ? 'bg-red-600 text-white' :
                            notification.severity === 'Medium' ? 'bg-yellow-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {notification.severity}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600 block">Created</span>
                            <span className="font-medium">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Owner</span>
                            <span className="font-medium">{notification.owner || 'Unassigned'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">SLA</span>
                            <span className="font-medium">24 hours</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Status</span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {notification.status}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white bg-opacity-60 rounded p-4 mb-4">
                          <h5 className="font-semibold text-sm mb-2">Recommended Action:</h5>
                          <p className="text-sm">{notification.recommendedAction}</p>
                        </div>

                        <div className="flex gap-3">
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                            View Playbook
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded hover:bg-white">
                            Assign Owner
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded hover:bg-white">
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

          {data.activeCount === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">No active alerts</p>
              <p className="text-sm">All notifications have been resolved</p>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Resolved Alerts */}
      {data.resolvedCount > 0 && (
        <div className="mt-8">
          <DashboardCard
            title="Recently Resolved"
            subtitle={`${data.resolvedCount} alerts completed`}
          >
            <div className="space-y-3">
              {data.notifications
                .filter(n => n.status === 'Resolved')
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{notification.message}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Resolved {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })} by {notification.owner || 'System'}
                          </p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </DashboardCard>
        </div>
      )}
    </DashboardLayout>
  )
}
