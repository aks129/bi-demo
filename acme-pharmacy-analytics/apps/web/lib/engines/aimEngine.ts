/**
 * AIM (Actuarial Investment Model) ROI Engine
 *
 * Calculates projected cost avoidance based on MTM intervention severity levels.
 * The AIM model provides a standardized way to quantify the financial value
 * of MTM services for payers.
 *
 * Severity Levels (OutcomesMTM standard):
 * - Level 1: Adherence support ($50)
 * - Level 2: Minor intervention ($150)
 * - Level 3: Prevented physician visit ($500)
 * - Level 4: Moderate intervention ($1,500)
 * - Level 5: Prevented ER visit ($5,000)
 * - Level 6: Prevented hospitalization ($15,000)
 * - Level 7: Life-threatening prevention ($30,000)
 */

// AIM severity level to dollar value mapping
export const AIM_VALUES: Record<number, number> = {
  1: 50,      // Adherence support
  2: 150,     // Minor intervention
  3: 500,     // Prevented physician visit
  4: 1500,    // Moderate intervention
  5: 5000,    // Prevented ER visit
  6: 15000,   // Prevented hospitalization
  7: 30000,   // Life-threatening prevention
}

export const AIM_DESCRIPTIONS: Record<number, string> = {
  1: 'Adherence Support',
  2: 'Minor Intervention',
  3: 'Prevented Physician Visit',
  4: 'Moderate Intervention',
  5: 'Prevented ER Visit',
  6: 'Prevented Hospitalization',
  7: 'Life-Threatening Prevention',
}

export interface AIMClaim {
  id: string
  memberId: string
  serviceDate: Date
  severityLevel: number
  aimDollarValue: number
  status: string  // 'Pending' | 'Approved' | 'Review'
  opportunityType: string  // 'CMR' | 'TIP'
}

export interface AIMSummary {
  grossCostAvoidance: number
  operationalCosts: number
  netBenefit: number
  roiMultiple: number
  totalInterventions: number
  approvedInterventions: number
  bySeverity: Array<{
    level: number
    description: string
    count: number
    value: number
  }>
  byOpportunityType: {
    cmr: { count: number; value: number }
    tip: { count: number; value: number }
  }
}

export interface WaterfallDataPoint {
  name: string
  value: number
  displayValue: number
  fill: string
  isTotal?: boolean
}

// Average operational cost per intervention (configurable)
const AVG_INTERVENTION_COST = 75 // $75 per MTM service

/**
 * Calculate AIM ROI summary from claims
 */
export function calculateAIMROI(
  claims: AIMClaim[],
  operationalCostPerIntervention: number = AVG_INTERVENTION_COST
): AIMSummary {
  // Filter to approved claims only for cost avoidance
  const approvedClaims = claims.filter(c => c.status === 'Approved')

  // Sum gross cost avoidance
  const grossCostAvoidance = approvedClaims.reduce(
    (sum, claim) => sum + claim.aimDollarValue,
    0
  )

  // Calculate operational costs
  const operationalCosts = approvedClaims.length * operationalCostPerIntervention

  // Calculate net benefit and ROI
  const netBenefit = grossCostAvoidance - operationalCosts
  const roiMultiple = operationalCosts > 0
    ? parseFloat((grossCostAvoidance / operationalCosts).toFixed(2))
    : 0

  // Break down by severity level
  const bySeverity: AIMSummary['bySeverity'] = []
  for (let level = 1; level <= 7; level++) {
    const levelClaims = approvedClaims.filter(c => c.severityLevel === level)
    const value = levelClaims.reduce((sum, c) => sum + c.aimDollarValue, 0)

    if (levelClaims.length > 0) {
      bySeverity.push({
        level,
        description: AIM_DESCRIPTIONS[level],
        count: levelClaims.length,
        value
      })
    }
  }

  // Break down by opportunity type
  const cmrClaims = approvedClaims.filter(c => c.opportunityType === 'CMR')
  const tipClaims = approvedClaims.filter(c => c.opportunityType === 'TIP')

  return {
    grossCostAvoidance,
    operationalCosts,
    netBenefit,
    roiMultiple,
    totalInterventions: claims.length,
    approvedInterventions: approvedClaims.length,
    bySeverity,
    byOpportunityType: {
      cmr: {
        count: cmrClaims.length,
        value: cmrClaims.reduce((sum, c) => sum + c.aimDollarValue, 0)
      },
      tip: {
        count: tipClaims.length,
        value: tipClaims.reduce((sum, c) => sum + c.aimDollarValue, 0)
      }
    }
  }
}

/**
 * Generate waterfall chart data for ROI visualization
 */
export function generateWaterfallData(summary: AIMSummary): WaterfallDataPoint[] {
  const data: WaterfallDataPoint[] = []

  // Start with gross cost avoidance
  data.push({
    name: 'Gross Savings',
    value: summary.grossCostAvoidance,
    displayValue: summary.grossCostAvoidance,
    fill: '#10b981' // green
  })

  // Subtract operational costs (shown as negative)
  data.push({
    name: 'Operating Costs',
    value: -summary.operationalCosts,
    displayValue: summary.operationalCosts,
    fill: '#ef4444' // red
  })

  // Net benefit total
  data.push({
    name: 'Net Benefit',
    value: summary.netBenefit,
    displayValue: summary.netBenefit,
    fill: '#3b82f6', // blue
    isTotal: true
  })

  return data
}

/**
 * Generate detailed waterfall with severity breakdown
 */
export function generateDetailedWaterfallData(summary: AIMSummary): WaterfallDataPoint[] {
  const data: WaterfallDataPoint[] = []
  let runningTotal = 0

  // Add each severity level as a step
  const colors = ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857']

  for (const severity of summary.bySeverity) {
    runningTotal += severity.value
    data.push({
      name: `L${severity.level}: ${severity.description}`,
      value: severity.value,
      displayValue: severity.value,
      fill: colors[severity.level - 1] || '#10b981'
    })
  }

  // Operational costs
  data.push({
    name: 'Operating Costs',
    value: -summary.operationalCosts,
    displayValue: summary.operationalCosts,
    fill: '#ef4444'
  })

  // Net benefit
  data.push({
    name: 'Net Benefit',
    value: summary.netBenefit,
    displayValue: summary.netBenefit,
    fill: summary.netBenefit >= 0 ? '#3b82f6' : '#ef4444',
    isTotal: true
  })

  return data
}

/**
 * Calculate monthly ROI trend
 */
export function calculateROITrend(claims: AIMClaim[]): Array<{
  month: string
  grossSavings: number
  operationalCosts: number
  netBenefit: number
  roiMultiple: number
}> {
  // Group by month
  const months = new Map<string, AIMClaim[]>()

  claims.forEach(claim => {
    const date = new Date(claim.serviceDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!months.has(monthKey)) {
      months.set(monthKey, [])
    }
    months.get(monthKey)!.push(claim)
  })

  // Calculate ROI for each month
  const trend = Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, monthClaims]) => {
      const summary = calculateAIMROI(monthClaims)
      return {
        month,
        grossSavings: summary.grossCostAvoidance,
        operationalCosts: summary.operationalCosts,
        netBenefit: summary.netBenefit,
        roiMultiple: summary.roiMultiple
      }
    })

  return trend
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

/**
 * Calculate AIM severity distribution percentages
 */
export function calculateSeverityDistribution(summary: AIMSummary): Array<{
  level: number
  description: string
  percentage: number
  count: number
  value: number
}> {
  const totalValue = summary.grossCostAvoidance

  return summary.bySeverity.map(s => ({
    ...s,
    percentage: totalValue > 0
      ? parseFloat(((s.value / totalValue) * 100).toFixed(1))
      : 0
  }))
}
