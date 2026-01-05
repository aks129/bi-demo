// Mock data for demo when database is not available (Vercel serverless)
// This provides realistic-looking data for the demo

export const mockContracts = [
  { id: 'c1', name: 'Blue Shield Northeast', cmsContractNumber: 'H1234' },
  { id: 'c2', name: 'HealthFirst Midwest', cmsContractNumber: 'H5678' },
  { id: 'c3', name: 'SunCare West', cmsContractNumber: 'H9012' }
]

export const mockMembers = Array.from({ length: 500 }, (_, i) => ({
  id: `m${i + 1}`,
  memberId: `MBR${String(i + 1).padStart(6, '0')}`,
  name: `Member ${i + 1}`,
  age: Math.floor(Math.random() * 40) + 45,
  zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
  clientId: mockContracts[i % 3].id,
  mtmEligible: Math.random() > 0.55,
  optOut: Math.random() > 0.95,
  priorityScore: Math.floor(Math.random() * 100),
  chronicDiseases: ['Diabetes', 'Hypertension', 'CHF', 'COPD', 'Asthma'].slice(0, Math.floor(Math.random() * 4) + 1),
  drugCostsYTD: Math.floor(Math.random() * 10000) + 500,
  partDMeds: Math.floor(Math.random() * 12) + 3
}))

export const mockClaims = Array.from({ length: 800 }, (_, i) => {
  const resultCodes = [300, 300, 300, 301, 301, 379, 380] // weighted toward success
  const resultCode = resultCodes[Math.floor(Math.random() * resultCodes.length)]
  const severityLevel = Math.floor(Math.random() * 7) + 1
  const aimValues: Record<number, number> = { 1: 50, 2: 150, 3: 500, 4: 1500, 5: 5000, 6: 15000, 7: 30000 }

  return {
    id: `cl${i + 1}`,
    claimId: `CLM${String(i + 1).padStart(8, '0')}`,
    memberId: mockMembers[i % mockMembers.length].id,
    clientId: mockContracts[i % 3].id,
    serviceDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    opportunityType: Math.random() > 0.3 ? 'CMR' : 'TIP',
    resultCode,
    status: resultCode === 300 || resultCode === 301 ? 'Approved' : 'Pending',
    severityLevel,
    aimDollarValue: resultCode === 300 ? aimValues[severityLevel] : 0
  }
})

export const mockAdherence = Array.from({ length: 300 }, (_, i) => {
  const drugClasses = ['Diabetes', 'Hypertension', 'Cholesterol', 'COPD', 'Heart Failure']
  const pdc90 = Math.random() * 30 + 65 // 65-95%

  return {
    id: `adh${i + 1}`,
    memberId: mockMembers[i % mockMembers.length].id,
    drugClass: drugClasses[i % drugClasses.length],
    pdc90,
    pdc180: pdc90 - (Math.random() * 5),
    mpr90: pdc90 + (Math.random() * 5 - 2.5),
    measureDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
  }
})

export const mockNotifications = [
  {
    id: 'n1',
    clientId: mockContracts[0].id,
    ruleKey: 'star-ratings-alert',
    entityRef: 'MTM',
    severity: 'Critical',
    owner: 'MTM Team',
    slaHours: 24,
    status: 'Active',
    message: 'CMR completion rate dropped below 80% threshold',
    recommendedAction: 'Prioritize high-risk member outreach in work queue',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    acknowledgedAt: null,
    resolvedAt: null
  },
  {
    id: 'n2',
    clientId: mockContracts[0].id,
    ruleKey: 'adherence-gap',
    entityRef: 'Adherence',
    severity: 'High',
    owner: 'Adherence Team',
    slaHours: 48,
    status: 'Active',
    message: '47 members have PDC below 75% in diabetes medications',
    recommendedAction: 'Deploy refill reminder campaign for at-risk cohort',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    acknowledgedAt: null,
    resolvedAt: null
  },
  {
    id: 'n3',
    clientId: mockContracts[1].id,
    ruleKey: 'eligibility-2025',
    entityRef: 'Eligibility',
    severity: 'Medium',
    owner: 'Operations',
    slaHours: 168,
    status: 'Resolved',
    message: 'New CMS rules will add 312 members to MTM eligibility',
    recommendedAction: 'Review staffing capacity for Q1 2025',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    acknowledgedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]

// Computed metrics from mock data
export function getMockMTMMetrics() {
  const totalClaims = mockClaims.length
  const completedClaims = mockClaims.filter(c => c.resultCode === 300 || c.resultCode === 301).length
  const refusedClaims = mockClaims.filter(c => c.resultCode === 380).length
  const unreachableClaims = mockClaims.filter(c => c.resultCode === 379).length

  return {
    totalOpportunities: totalClaims,
    completionRate: (completedClaims / totalClaims) * 100,
    attemptRate: ((totalClaims - unreachableClaims) / totalClaims) * 100,
    refusalRate: (refusedClaims / totalClaims) * 100,
    unreachableRate: (unreachableClaims / totalClaims) * 100,
    pendingCount: mockClaims.filter(c => c.status === 'Pending').length
  }
}

export function getMockROIMetrics() {
  const approvedClaims = mockClaims.filter(c => c.status === 'Approved')
  const totalAIM = approvedClaims.reduce((sum, c) => sum + c.aimDollarValue, 0)
  const programCost = approvedClaims.length * 75 // $75 per intervention

  return {
    grossSavings: totalAIM,
    programCost,
    netROI: totalAIM - programCost,
    roiMultiple: totalAIM / programCost,
    interventionCount: approvedClaims.length,
    avgAIMValue: totalAIM / approvedClaims.length
  }
}

export function getMockEligibilityMetrics() {
  const eligible2024 = mockMembers.filter(m => m.mtmEligible).length
  const eligible2025 = mockMembers.filter(m =>
    m.drugCostsYTD >= 1623 &&
    m.chronicDiseases.length >= 3 &&
    m.partDMeds >= 8
  ).length

  return {
    currentEligible: eligible2024,
    projected2025: Math.round(eligible2024 * 1.4),
    totalMembers: mockMembers.length,
    eligibilityRate: (eligible2024 / mockMembers.length) * 100,
    newlyEligible2025: Math.round(eligible2024 * 0.4)
  }
}

export function getMockWorkQueue() {
  return mockMembers
    .filter(m => m.mtmEligible && !m.optOut)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 100)
    .map(m => ({
      ...m,
      needsCMR: Math.random() > 0.5,
      openTIPs: Math.floor(Math.random() * 3),
      lastContactDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      adherencePDC: Math.random() * 30 + 65,
      urgentGaps: Math.floor(Math.random() * 2)
    }))
}
