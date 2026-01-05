/**
 * MTM Metrics Engine
 *
 * Implements the Outcomes MTM Performance Data Class logic for calculating
 * standard MTM performance rates based on result codes.
 *
 * Result Code Reference (OutcomesMTM spec):
 * - 300: DTP Identified (Success)
 * - 301: No DTP Identified (Success)
 * - 379: Unable to Reach
 * - 380: Patient Refused
 */

// Result codes per OutcomesMTM specification
export const RESULT_CODES = {
  SUCCESS_DTP: 300,       // Drug Therapy Problem Identified
  SUCCESS_NO_DTP: 301,    // No DTP Identified (still a successful contact)
  UNABLE_TO_REACH: 379,   // Unable to reach patient
  REFUSED: 380,           // Patient refused service
} as const

export type ResultCode = typeof RESULT_CODES[keyof typeof RESULT_CODES]

export interface Claim {
  id: string
  claimId: string
  memberId: string
  serviceDate: Date
  opportunityType: string  // 'CMR' | 'TIP'
  resultCode: number | null
  status: string           // 'Pending' | 'Approved' | 'Review'
  severityLevel: number
  aimDollarValue: number
}

export interface ContractMetrics {
  attemptRate: number         // (300+301+380+379) / Total
  completionRate: number      // (300+301) / Total
  refusalRate: number         // 380 / Total
  unreachableRate: number     // 379 / Total
  pendingRate: number         // null result codes / Total
  totalOpportunities: number
  attemptCount: number
  completionCount: number
  refusalCount: number
  unreachableCount: number
  pendingCount: number
}

export interface MetricsTrend {
  period: string
  attemptRate: number
  completionRate: number
  refusalRate: number
}

export interface OpportunityMetrics {
  cmr: ContractMetrics
  tip: ContractMetrics
  combined: ContractMetrics
}

/**
 * Calculate MTM metrics for a set of claims
 */
export function calculateContractMetrics(claims: Claim[]): ContractMetrics {
  const total = claims.length

  if (total === 0) {
    return {
      attemptRate: 0,
      completionRate: 0,
      refusalRate: 0,
      unreachableRate: 0,
      pendingRate: 0,
      totalOpportunities: 0,
      attemptCount: 0,
      completionCount: 0,
      refusalCount: 0,
      unreachableCount: 0,
      pendingCount: 0
    }
  }

  // Count by result code
  const successDTP = claims.filter(c => c.resultCode === RESULT_CODES.SUCCESS_DTP).length
  const successNoDTP = claims.filter(c => c.resultCode === RESULT_CODES.SUCCESS_NO_DTP).length
  const refused = claims.filter(c => c.resultCode === RESULT_CODES.REFUSED).length
  const unreachable = claims.filter(c => c.resultCode === RESULT_CODES.UNABLE_TO_REACH).length
  const pending = claims.filter(c => c.resultCode === null).length

  // Calculate rates per OutcomesMTM Performance Data Class
  const attemptCount = successDTP + successNoDTP + refused + unreachable
  const completionCount = successDTP + successNoDTP

  return {
    attemptRate: parseFloat(((attemptCount / total) * 100).toFixed(2)),
    completionRate: parseFloat(((completionCount / total) * 100).toFixed(2)),
    refusalRate: parseFloat(((refused / total) * 100).toFixed(2)),
    unreachableRate: parseFloat(((unreachable / total) * 100).toFixed(2)),
    pendingRate: parseFloat(((pending / total) * 100).toFixed(2)),
    totalOpportunities: total,
    attemptCount,
    completionCount,
    refusalCount: refused,
    unreachableCount: unreachable,
    pendingCount: pending
  }
}

/**
 * Calculate metrics by opportunity type (CMR vs TIP)
 */
export function calculateOpportunityMetrics(claims: Claim[]): OpportunityMetrics {
  const cmrClaims = claims.filter(c => c.opportunityType === 'CMR')
  const tipClaims = claims.filter(c => c.opportunityType === 'TIP')

  return {
    cmr: calculateContractMetrics(cmrClaims),
    tip: calculateContractMetrics(tipClaims),
    combined: calculateContractMetrics(claims)
  }
}

/**
 * Calculate metrics trend over time periods
 */
export function calculateMetricsTrend(
  claims: Claim[],
  periodType: 'month' | 'week' = 'month'
): MetricsTrend[] {
  // Group claims by period
  const periods = new Map<string, Claim[]>()

  claims.forEach(claim => {
    const date = new Date(claim.serviceDate)
    let periodKey: string

    if (periodType === 'month') {
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    } else {
      // Get ISO week
      const startOfYear = new Date(date.getFullYear(), 0, 1)
      const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
      periodKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
    }

    if (!periods.has(periodKey)) {
      periods.set(periodKey, [])
    }
    periods.get(periodKey)!.push(claim)
  })

  // Calculate metrics for each period
  const trends: MetricsTrend[] = []
  const sortedPeriods = Array.from(periods.keys()).sort()

  for (const period of sortedPeriods) {
    const periodClaims = periods.get(period)!
    const metrics = calculateContractMetrics(periodClaims)

    trends.push({
      period,
      attemptRate: metrics.attemptRate,
      completionRate: metrics.completionRate,
      refusalRate: metrics.refusalRate
    })
  }

  return trends
}

/**
 * Calculate Star Ratings readiness based on completion rate
 */
export function calculateStarRatingsStatus(completionRate: number): {
  stars: number
  status: 'excellent' | 'good' | 'at_risk' | 'critical'
  gap: number
  message: string
} {
  const FOUR_STAR_THRESHOLD = 80
  const THREE_STAR_THRESHOLD = 70
  const TWO_STAR_THRESHOLD = 60

  const gap = Math.max(0, FOUR_STAR_THRESHOLD - completionRate)

  if (completionRate >= FOUR_STAR_THRESHOLD) {
    return {
      stars: 4,
      status: 'excellent',
      gap: 0,
      message: 'Meeting 4+ Star Ratings threshold. Continue monitoring to maintain performance.'
    }
  } else if (completionRate >= THREE_STAR_THRESHOLD) {
    return {
      stars: 3,
      status: 'at_risk',
      gap,
      message: `${gap.toFixed(1)} points below 4-Star threshold. Accelerate intervention efforts.`
    }
  } else if (completionRate >= TWO_STAR_THRESHOLD) {
    return {
      stars: 2,
      status: 'critical',
      gap,
      message: `${gap.toFixed(1)} points below target. Immediate action required to protect Star Ratings.`
    }
  } else {
    return {
      stars: 1,
      status: 'critical',
      gap,
      message: `Critical: ${gap.toFixed(1)} points below threshold. Deploy emergency intervention protocol.`
    }
  }
}

/**
 * Format metrics for display
 */
export function formatMetricsForDisplay(metrics: ContractMetrics): {
  attemptRate: string
  completionRate: string
  refusalRate: string
  unreachableRate: string
  pendingRate: string
  totalOpportunities: string
} {
  return {
    attemptRate: `${metrics.attemptRate.toFixed(1)}%`,
    completionRate: `${metrics.completionRate.toFixed(1)}%`,
    refusalRate: `${metrics.refusalRate.toFixed(1)}%`,
    unreachableRate: `${metrics.unreachableRate.toFixed(1)}%`,
    pendingRate: `${metrics.pendingRate.toFixed(1)}%`,
    totalOpportunities: metrics.totalOpportunities.toLocaleString()
  }
}
