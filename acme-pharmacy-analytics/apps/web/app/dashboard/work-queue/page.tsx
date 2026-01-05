import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { WorkQueueTable } from '@/components/dashboard/WorkQueueTable'
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react'

interface WorkQueueMember {
  id: string
  memberId: string | null
  name: string
  age: number
  priorityScore: number
  chronicDiseaseCount: number
  chronicDiseases: string | null
  drugCostsYTD: number
  riskBand: string
  needsCMR: boolean
  openTips: number
  avgAdherence: number
  lastContact: Date | null
}

async function getWorkQueueData() {
  // Get MTM-eligible members with priority scores
  const members = await prisma.dimMember.findMany({
    where: {
      mtmEligible: true,
      optOut: false
    },
    orderBy: {
      priorityScore: 'desc'
    },
    take: 100
  })

  // Get pending claims for each member
  const pendingClaims = await prisma.claim.groupBy({
    by: ['memberId'],
    where: {
      status: 'Pending'
    },
    _count: true
  })

  const pendingClaimsMap = new Map(
    pendingClaims.map(c => [c.memberId, c._count])
  )

  // Get average adherence for each member
  const adherenceData = await prisma.factAdherence.groupBy({
    by: ['memberId'],
    _avg: {
      pdc90: true
    }
  })

  const adherenceMap = new Map(
    adherenceData.map(a => [a.memberId, a._avg.pdc90 || 0])
  )

  // Get last contact date from claims
  const lastContacts = await prisma.claim.findMany({
    where: {
      memberId: {
        in: members.map(m => m.id)
      },
      resultCode: {
        not: null
      }
    },
    orderBy: {
      serviceDate: 'desc'
    },
    distinct: ['memberId'],
    select: {
      memberId: true,
      serviceDate: true
    }
  })

  const lastContactMap = new Map(
    lastContacts.map(c => [c.memberId, c.serviceDate])
  )

  // Transform data for the work queue
  const workQueue: WorkQueueMember[] = members.map(m => ({
    id: m.id,
    memberId: m.memberId,
    name: m.name,
    age: m.age,
    priorityScore: m.priorityScore,
    chronicDiseaseCount: m.chronicDiseaseCount,
    chronicDiseases: m.chronicDiseases,
    drugCostsYTD: m.drugCostsYTD,
    riskBand: m.riskBand,
    needsCMR: m.priorityScore >= 40, // Members with high priority likely need CMR
    openTips: pendingClaimsMap.get(m.id) || 0,
    avgAdherence: adherenceMap.get(m.id) || 0,
    lastContact: lastContactMap.get(m.id) || null
  }))

  return workQueue
}

async function getQueueStats() {
  const [
    totalEligible,
    pendingCMRs,
    pendingTIPs,
    highPriority
  ] = await Promise.all([
    prisma.dimMember.count({ where: { mtmEligible: true, optOut: false } }),
    prisma.claim.count({ where: { status: 'Pending', opportunityType: 'CMR' } }),
    prisma.claim.count({ where: { status: 'Pending', opportunityType: 'TIP' } }),
    prisma.dimMember.count({ where: { mtmEligible: true, optOut: false, priorityScore: { gte: 70 } } })
  ])

  return { totalEligible, pendingCMRs, pendingTIPs, highPriority }
}

export default async function WorkQueuePage() {
  const workQueue = await getWorkQueueData()
  const stats = await getQueueStats()

  // Segment the queue
  const criticalQueue = workQueue.filter(m => m.priorityScore >= 70)
  const highQueue = workQueue.filter(m => m.priorityScore >= 50 && m.priorityScore < 70)
  const standardQueue = workQueue.filter(m => m.priorityScore < 50)

  return (
    <DashboardLayout
      title="Pharmacist Work Queue"
      subtitle="Priority-ordered member list for MTM interventions"
    >
      {/* Priority Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total in Queue"
          value={stats.totalEligible.toLocaleString()}
          subtitle="MTM-eligible members"
          status="neutral"
          icon={<ClipboardList className="h-10 w-10" />}
        />
        <KPICard
          title="Critical Priority"
          value={stats.highPriority.toLocaleString()}
          subtitle="Score 70+ (immediate action)"
          status="critical"
          icon={<AlertTriangle className="h-10 w-10" />}
        />
        <KPICard
          title="Pending CMRs"
          value={stats.pendingCMRs.toLocaleString()}
          subtitle="Awaiting completion"
          status={stats.pendingCMRs > 50 ? 'warning' : 'healthy'}
          icon={<Clock className="h-10 w-10" />}
        />
        <KPICard
          title="Pending TIPs"
          value={stats.pendingTIPs.toLocaleString()}
          subtitle="Targeted interventions"
          status="neutral"
          icon={<CheckCircle className="h-10 w-10" />}
        />
      </div>

      {/* Priority Score Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Priority Score Guide</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded border bg-red-100 text-red-800 border-red-200 text-xs font-medium">Critical (70+)</span>
            <span className="text-gray-600">Needs CMR + Low Adherence + Open Gaps</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded border bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium">High (50-69)</span>
            <span className="text-gray-600">Needs CMR or Multiple TIPs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded border bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-medium">Medium (30-49)</span>
            <span className="text-gray-600">Open TIPs or At-Risk Adherence</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded border bg-gray-100 text-gray-600 border-gray-200 text-xs font-medium">Low (&lt;30)</span>
            <span className="text-gray-600">Routine Follow-up</span>
          </div>
        </div>
      </div>

      {/* Full Interactive Work Queue */}
      <div className="mb-8">
        <DashboardCard
          title={`Full Work Queue (${workQueue.length} members)`}
          subtitle="Search, filter, and sort to find members - Critical priority members shown first"
        >
          <WorkQueueTable members={workQueue} variant="critical" />
        </DashboardCard>
      </div>

      {/* Queue Summary by Priority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900">Critical Priority</h4>
          <p className="text-3xl font-bold text-red-800 mt-2">{criticalQueue.length}</p>
          <p className="text-sm text-red-700 mt-1">Contact within 24 hours</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900">High Priority</h4>
          <p className="text-3xl font-bold text-orange-800 mt-2">{highQueue.length}</p>
          <p className="text-sm text-orange-700 mt-1">Schedule within 48-72 hours</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900">Standard Queue</h4>
          <p className="text-3xl font-bold text-gray-800 mt-2">{standardQueue.length}</p>
          <p className="text-sm text-gray-600 mt-1">Routine follow-up</p>
        </div>
      </div>

      {/* Workflow Tips */}
      <div className="mt-8">
        <DashboardCard title="Work Queue Best Practices">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Critical Members
              </h4>
              <p className="text-sm text-gray-600">
                Contact within 24 hours. These members have the highest potential for adverse events
                and represent the greatest opportunity for impact.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                High Priority
              </h4>
              <p className="text-sm text-gray-600">
                Schedule contact within 48-72 hours. Prioritize members with pending CMRs
                to meet Star Ratings completion targets.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Batch Processing
              </h4>
              <p className="text-sm text-gray-600">
                Group similar interventions (e.g., all Diabetes TIPs) for efficiency.
                Use standardized scripts for consistent outcomes.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  )
}
