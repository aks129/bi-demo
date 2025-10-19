import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { User, Activity, Calendar, MapPin } from 'lucide-react'

async function getMemberDetails() {
  const members = await prisma.dimMember.findMany({
    take: 50,
    orderBy: {
      name: 'asc'
    }
  })

  // Get adherence records for these members
  const memberIds = members.map(m => m.id)
  const adherenceRecords = await prisma.factAdherence.findMany({
    where: {
      memberId: { in: memberIds }
    }
  })

  // Create member-adherence map
  const memberAdherence = new Map()
  adherenceRecords.forEach(record => {
    if (!memberAdherence.has(record.memberId)) {
      memberAdherence.set(record.memberId, [])
    }
    memberAdherence.get(record.memberId).push(record)
  })

  // Combine data
  const memberData = members.map(member => {
    const records = memberAdherence.get(member.id) || []
    const avgPDC = records.length > 0
      ? records.reduce((sum: number, r: any) => sum + r.pdc90, 0) / records.length
      : 0

    const status = avgPDC >= 80 ? 'healthy' : avgPDC >= 75 ? 'warning' : 'critical'

    return {
      ...member,
      avgPDC,
      recordCount: records.length,
      status,
      drugClasses: records.map((r: any) => r.drugClass).join(', '),
    }
  })

  return memberData
}

export default async function MemberAnalyticsPage() {
  const members = await getMemberDetails()

  const statusCounts = {
    healthy: members.filter(m => m.status === 'healthy').length,
    warning: members.filter(m => m.status === 'warning').length,
    critical: members.filter(m => m.status === 'critical').length,
  }

  return (
    <DashboardLayout
      title="Member-Level Analytics"
      subtitle="Individual member profiles and adherence tracking"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium uppercase">Healthy (≥80%)</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{statusCounts.healthy}</p>
            </div>
            <Activity className="h-10 w-10 text-green-300" />
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium uppercase">At Risk (75-79%)</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{statusCounts.warning}</p>
            </div>
            <Activity className="h-10 w-10 text-yellow-300" />
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium uppercase">Critical (&lt;75%)</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{statusCounts.critical}</p>
            </div>
            <Activity className="h-10 w-10 text-red-300" />
          </div>
        </div>
      </div>

      {/* Impact-First Messaging */}
      <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-blue-900 font-semibold text-lg mb-2">Member-Level Intervention Strategy</h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p><strong>So what?</strong> {statusCounts.warning + statusCounts.critical} members need targeted interventions to improve adherence and health outcomes.</p>
          <p><strong>Now what?</strong> Use this table to identify and prioritize outreach:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Critical Priority:</strong> Members &lt;75% PDC - immediate phone outreach + CMR scheduling</li>
            <li><strong>Medium Priority:</strong> Members 75-79% PDC - automated refill reminders + engagement campaigns</li>
            <li><strong>Monitor:</strong> Members ≥80% PDC - maintain with regular check-ins</li>
          </ul>
        </div>
      </div>

      {/* Member Table */}
      <DashboardCard
        title="Member Adherence Directory"
        subtitle={`Showing ${members.length} members`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ZIP Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drug Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Adherence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => {
                const statusColors = {
                  healthy: 'bg-green-100 text-green-800',
                  warning: 'bg-yellow-100 text-yellow-800',
                  critical: 'bg-red-100 text-red-800'
                }

                const statusLabels = {
                  healthy: 'Healthy',
                  warning: 'At Risk',
                  critical: 'Critical'
                }

                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">ID: {member.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {member.zipCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {member.drugClasses || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {member.avgPDC > 0 ? `${member.avgPDC.toFixed(1)}%` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.recordCount} record{member.recordCount !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.avgPDC > 0 && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[member.status as keyof typeof statusColors]}`}>
                          {statusLabels[member.status as keyof typeof statusLabels]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">
                        View Profile
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{members.length}</span> of{' '}
            <span className="font-medium">{members.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
