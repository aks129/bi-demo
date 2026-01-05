// Data service with mock data fallback for Vercel deployment
// Falls back to mock data when database is unavailable

import { prisma } from './prisma'
import {
  mockContracts,
  mockClaims,
  mockMembers,
  mockAdherence,
  mockNotifications,
  getMockMTMMetrics,
  getMockROIMetrics,
  getMockEligibilityMetrics,
  getMockWorkQueue
} from './mock-data'

// Check if we can connect to the database
async function canConnectToDb(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    console.warn('Database not available, using mock data')
    return false
  }
}

// Contracts
export async function getContracts() {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const contracts = await prisma.dimClient.findMany({
      select: { id: true, name: true, cmsContractNumber: true },
      orderBy: { name: 'asc' }
    })
    return contracts.map(c => ({
      id: c.id,
      name: c.name,
      contractNumber: c.cmsContractNumber || 'N/A'
    }))
  } catch {
    return mockContracts.map(c => ({
      id: c.id,
      name: c.name,
      contractNumber: c.cmsContractNumber
    }))
  }
}

// Claims / MTM Data
export async function getMTMData(contractId?: string) {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const whereClause = contractId ? { clientId: contractId } : {}
    const claims = await prisma.claim.findMany({
      where: whereClause,
      orderBy: { serviceDate: 'desc' }
    })
    const eligibleMembers = await prisma.dimMember.count({
      where: { mtmEligible: true, ...(contractId ? { clientId: contractId } : {}) }
    })

    return {
      claims: claims.map(c => ({
        id: c.id,
        claimId: c.claimId,
        memberId: c.memberId,
        serviceDate: c.serviceDate,
        opportunityType: c.opportunityType,
        resultCode: c.resultCode,
        status: c.status,
        severityLevel: c.severityLevel,
        aimDollarValue: c.aimDollarValue
      })),
      eligibleMembers
    }
  } catch {
    const filteredClaims = contractId
      ? mockClaims.filter(c => c.clientId === contractId)
      : mockClaims
    const eligibleMembers = contractId
      ? mockMembers.filter(m => m.clientId === contractId && m.mtmEligible).length
      : mockMembers.filter(m => m.mtmEligible).length

    return {
      claims: filteredClaims.map(c => ({
        id: c.id,
        claimId: c.claimId,
        memberId: c.memberId,
        serviceDate: c.serviceDate,
        opportunityType: c.opportunityType,
        resultCode: c.resultCode,
        status: c.status,
        severityLevel: c.severityLevel,
        aimDollarValue: c.aimDollarValue
      })),
      eligibleMembers
    }
  }
}

// ROI Data
export async function getROIData(contractId?: string) {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const whereClause = contractId ? { clientId: contractId } : {}
    const claims = await prisma.claim.findMany({
      where: whereClause,
      orderBy: { serviceDate: 'desc' }
    })

    return claims.map(c => ({
      id: c.id,
      memberId: c.memberId,
      serviceDate: c.serviceDate,
      severityLevel: c.severityLevel,
      aimDollarValue: c.aimDollarValue,
      status: c.status,
      opportunityType: c.opportunityType
    }))
  } catch {
    const filteredClaims = contractId
      ? mockClaims.filter(c => c.clientId === contractId)
      : mockClaims

    return filteredClaims.map(c => ({
      id: c.id,
      memberId: c.memberId,
      serviceDate: c.serviceDate,
      severityLevel: c.severityLevel,
      aimDollarValue: c.aimDollarValue,
      status: c.status,
      opportunityType: c.opportunityType
    }))
  }
}

// Adherence Data
export async function getAdherenceData() {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const adherenceByClass = await prisma.factAdherence.groupBy({
      by: ['drugClass'],
      _avg: { pdc90: true, pdc180: true, mpr90: true },
      _count: true
    })

    const allAdherence = await prisma.factAdherence.findMany({
      select: { pdc90: true, drugClass: true, memberId: true }
    })

    return { adherenceByClass, allAdherence }
  } catch {
    // Create mock adherence summary
    const drugClasses = ['Diabetes', 'Hypertension', 'Cholesterol', 'COPD', 'Heart Failure']
    const adherenceByClass = drugClasses.map(drugClass => {
      const classData = mockAdherence.filter(a => a.drugClass === drugClass)
      return {
        drugClass,
        _avg: {
          pdc90: classData.reduce((sum, a) => sum + a.pdc90, 0) / classData.length,
          pdc180: classData.reduce((sum, a) => sum + a.pdc180, 0) / classData.length,
          mpr90: classData.reduce((sum, a) => sum + a.mpr90, 0) / classData.length
        },
        _count: classData.length
      }
    })

    return {
      adherenceByClass,
      allAdherence: mockAdherence.map(a => ({
        pdc90: a.pdc90,
        drugClass: a.drugClass,
        memberId: a.memberId
      }))
    }
  }
}

// Members
export async function getMembers(limit = 50) {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const members = await prisma.dimMember.findMany({
      take: limit,
      orderBy: { name: 'asc' }
    })

    // Get adherence separately
    const memberIds = members.map(m => m.id)
    const adherenceData = await prisma.factAdherence.findMany({
      where: { memberId: { in: memberIds } }
    })

    return members.map(m => ({
      ...m,
      adherence: adherenceData.filter(a => a.memberId === m.id).slice(0, 1)
    }))
  } catch {
    return mockMembers.slice(0, limit).map(m => ({
      ...m,
      adherence: mockAdherence.filter(a => a.memberId === m.id).slice(0, 1)
    }))
  }
}

// Eligibility Data
export async function getEligibilityData(contractId?: string) {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const whereClause = contractId ? { clientId: contractId } : {}

    const [totalMembers, eligibleMembers, optOutMembers] = await Promise.all([
      prisma.dimMember.count({ where: whereClause }),
      prisma.dimMember.count({ where: { ...whereClause, mtmEligible: true } }),
      prisma.dimMember.count({ where: { ...whereClause, mtmEligible: true, optOut: true } })
    ])

    // Get disease distribution
    const membersWithDiseases = await prisma.dimMember.findMany({
      where: { ...whereClause, mtmEligible: true },
      select: { chronicDiseases: true }
    })

    return {
      totalMembers,
      eligibleMembers,
      optOutMembers,
      activeEligible: eligibleMembers - optOutMembers,
      eligibilityRate: (eligibleMembers / totalMembers) * 100,
      membersWithDiseases
    }
  } catch {
    const filteredMembers = contractId
      ? mockMembers.filter(m => m.clientId === contractId)
      : mockMembers
    const eligible = filteredMembers.filter(m => m.mtmEligible)
    const optOut = eligible.filter(m => m.optOut)

    return {
      totalMembers: filteredMembers.length,
      eligibleMembers: eligible.length,
      optOutMembers: optOut.length,
      activeEligible: eligible.length - optOut.length,
      eligibilityRate: (eligible.length / filteredMembers.length) * 100,
      membersWithDiseases: eligible.map(m => ({ chronicDiseases: m.chronicDiseases }))
    }
  }
}

// Work Queue
export async function getWorkQueueData() {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const members = await prisma.dimMember.findMany({
      where: { mtmEligible: true, optOut: false },
      orderBy: { priorityScore: 'desc' },
      take: 100
    })

    // Get related data separately
    const memberIds = members.map(m => m.id)
    const [adherenceData, claimsData] = await Promise.all([
      prisma.factAdherence.findMany({ where: { memberId: { in: memberIds } } }),
      prisma.claim.findMany({
        where: { memberId: { in: memberIds } },
        orderBy: { serviceDate: 'desc' }
      })
    ])

    return members.map(m => {
      const memberClaims = claimsData.filter(c => c.memberId === m.id).slice(0, 5)
      const memberAdherence = adherenceData.filter(a => a.memberId === m.id).slice(0, 1)

      return {
        id: m.id,
        memberId: m.memberId,
        name: m.name || 'Unknown',
        age: m.age || 0,
        priorityScore: m.priorityScore || 0,
        chronicDiseases: m.chronicDiseases || [],
        needsCMR: !memberClaims.some(c => c.opportunityType === 'CMR' && c.status === 'Approved'),
        openTIPs: memberClaims.filter(c => c.opportunityType === 'TIP' && c.status === 'Pending').length,
        adherencePDC: memberAdherence[0]?.pdc90 || 0,
        urgentGaps: memberClaims.filter(c => c.status === 'Pending' && c.severityLevel >= 5).length,
        lastContactDate: memberClaims[0]?.serviceDate || null
      }
    })
  } catch {
    return getMockWorkQueue()
  }
}

// Notifications
export async function getNotifications() {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    return await prisma.factNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })
  } catch {
    return mockNotifications
  }
}

// Dashboard KPIs
export async function getDashboardKPIs() {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const [totalMembers, activeInsights, avgAdherence] = await Promise.all([
      prisma.dimMember.count(),
      prisma.factNotification.count({ where: { status: 'Active' } }),
      prisma.factAdherence.aggregate({ _avg: { pdc90: true } })
    ])

    const adherenceStats = await prisma.factAdherence.groupBy({
      by: ['drugClass'],
      _avg: { pdc90: true },
      _count: true
    })

    return {
      totalMembers,
      activeInsights,
      overallAdherence: avgAdherence._avg.pdc90 || 0,
      adherenceByClass: adherenceStats
    }
  } catch {
    const avgPdc = mockAdherence.reduce((sum, a) => sum + a.pdc90, 0) / mockAdherence.length

    return {
      totalMembers: mockMembers.length,
      activeInsights: mockNotifications.filter(n => n.status === 'Active').length,
      overallAdherence: avgPdc,
      adherenceByClass: ['Diabetes', 'Hypertension', 'Cholesterol', 'COPD', 'Heart Failure'].map(drugClass => ({
        drugClass,
        _avg: { pdc90: avgPdc + (Math.random() * 10 - 5) },
        _count: Math.floor(mockAdherence.length / 5)
      }))
    }
  }
}

// Monthly trend data
export async function getMonthlyTrend(contractId?: string) {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const whereClause = contractId ? { clientId: contractId } : {}
    const claims = await prisma.claim.findMany({
      where: {
        ...whereClause,
        serviceDate: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
      },
      orderBy: { serviceDate: 'asc' }
    })

    const monthlyData = new Map<string, { total: number; completed: number; attempted: number }>()

    claims.forEach(claim => {
      const month = claim.serviceDate.toLocaleDateString('en-US', { month: 'short' })
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { total: 0, completed: 0, attempted: 0 })
      }
      const data = monthlyData.get(month)!
      data.total++

      if (claim.resultCode === 300 || claim.resultCode === 301) {
        data.completed++
        data.attempted++
      } else if (claim.resultCode === 379 || claim.resultCode === 380) {
        data.attempted++
      }
    })

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      attemptRate: data.total > 0 ? (data.attempted / data.total) * 100 : 0
    }))
  } catch {
    // Generate mock monthly trend
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      completionRate: 70 + Math.random() * 15,
      attemptRate: 80 + Math.random() * 15
    }))
  }
}

// Monthly ROI trend
export async function getMonthlyROI(contractId?: string) {
  try {
    if (!(await canConnectToDb())) throw new Error('No DB')

    const whereClause = contractId ? { clientId: contractId } : {}
    const claims = await prisma.claim.findMany({
      where: {
        ...whereClause,
        status: 'Approved',
        serviceDate: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
      },
      orderBy: { serviceDate: 'asc' }
    })

    const monthlyData = new Map<string, number>()
    let cumulative = 0

    claims.forEach(claim => {
      const month = claim.serviceDate.toLocaleDateString('en-US', { month: 'short' })
      if (!monthlyData.has(month)) {
        monthlyData.set(month, 0)
      }
      monthlyData.set(month, monthlyData.get(month)! + claim.aimDollarValue)
    })

    const result: { month: string; savings: number; cumulative: number }[] = []
    monthlyData.forEach((savings, month) => {
      cumulative += savings
      result.push({ month, savings, cumulative })
    })

    return result
  } catch {
    // Generate mock monthly ROI
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let cumulative = 0
    return months.map(month => {
      const savings = 150000 + Math.random() * 100000
      cumulative += savings
      return { month, savings, cumulative }
    })
  }
}
