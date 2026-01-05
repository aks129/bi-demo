/**
 * 2025 CMS MTM Eligibility Engine
 *
 * Implements the new eligibility criteria effective January 1, 2025 per the
 * CMS Final Rule for Contract Year 2025.
 *
 * Key Changes for 2025:
 * - Cost threshold reduced to $1,623 (from $5,000+)
 * - Requires 3+ of 10 core chronic diseases
 * - Requires 8+ active Part D medications
 * - HIV/AIDS added to core chronic disease list
 */

// 2025 CMS Eligibility Thresholds
export const ELIGIBILITY_2025 = {
  COST_THRESHOLD: 1623,         // Annual drug cost threshold ($1,623)
  MIN_CHRONIC_DISEASES: 3,      // Minimum chronic disease count
  MIN_PART_D_MEDS: 8,           // Minimum active Part D medications
} as const

// Previous thresholds for comparison
export const ELIGIBILITY_PRIOR = {
  COST_THRESHOLD: 5000,         // Prior threshold was $5,000+
  MIN_CHRONIC_DISEASES: 3,
  MIN_PART_D_MEDS: 8,
}

// 2025 Core Chronic Diseases (10 conditions)
export const CORE_CHRONIC_DISEASES = [
  { code: 'ALZHEIMERS', name: "Alzheimer's Disease" },
  { code: 'BONE_ARTHRITIS', name: 'Bone Disease-Arthritis' },
  { code: 'CHF', name: 'Chronic Congestive Heart Failure' },
  { code: 'DIABETES', name: 'Diabetes' },
  { code: 'DYSLIPIDEMIA', name: 'Dyslipidemia' },
  { code: 'ESRD', name: 'End-Stage Renal Disease' },
  { code: 'HIV_AIDS', name: 'HIV/AIDS' },  // NEW for 2025
  { code: 'HYPERTENSION', name: 'Hypertension' },
  { code: 'MENTAL_HEALTH', name: 'Mental Health' },
  { code: 'RESPIRATORY', name: 'Respiratory Disease (Asthma, COPD)' },
] as const

export type ChronicDiseaseCode = typeof CORE_CHRONIC_DISEASES[number]['code']

export interface MemberEligibilityData {
  id: string
  memberId?: string
  name: string
  drugCostsYTD: number
  chronicDiseaseCount: number
  chronicDiseases: string  // Comma-separated codes
  activePartDMeds: number
  mtmEligible: boolean
  optOut: boolean
}

export interface EligibilityResult {
  memberId: string
  memberName: string
  eligible: boolean
  meetsCostCriterion: boolean
  meetsDiseaseCriterion: boolean
  meetsMedCountCriterion: boolean
  drugCostsYTD: number
  chronicDiseaseCount: number
  activePartDMeds: number
  chronicDiseases: string[]
  nearEligibility: boolean        // Close to meeting criteria
  eligibilityGaps: string[]       // What's missing
  optedOut: boolean
}

export interface PopulationSummary {
  totalMembers: number
  eligibleMembers: number
  eligibilityRate: number
  nearEligibleMembers: number      // Members close to threshold
  optedOutMembers: number
  projectedGrowth: number          // Projected growth due to 2025 rules
  byCriterion: {
    meetsCost: number
    meetsDisease: number
    meetsMeds: number
    meetsAllThree: number
  }
  byDisease: Array<{
    code: string
    name: string
    count: number
    percentage: number
  }>
}

/**
 * Check if a member meets 2025 CMS MTM eligibility
 */
export function checkEligibility(member: MemberEligibilityData): EligibilityResult {
  const meetsCost = member.drugCostsYTD >= ELIGIBILITY_2025.COST_THRESHOLD
  const meetsDisease = member.chronicDiseaseCount >= ELIGIBILITY_2025.MIN_CHRONIC_DISEASES
  const meetsMeds = member.activePartDMeds >= ELIGIBILITY_2025.MIN_PART_D_MEDS

  const eligible = meetsCost && meetsDisease && meetsMeds && !member.optOut

  // Check near-eligibility (within 10% or 1 unit of threshold)
  const nearCost = member.drugCostsYTD >= ELIGIBILITY_2025.COST_THRESHOLD * 0.8
  const nearDisease = member.chronicDiseaseCount >= ELIGIBILITY_2025.MIN_CHRONIC_DISEASES - 1
  const nearMeds = member.activePartDMeds >= ELIGIBILITY_2025.MIN_PART_D_MEDS - 1

  const nearEligibility = !eligible && (
    (nearCost && meetsDisease && meetsMeds) ||
    (meetsCost && nearDisease && meetsMeds) ||
    (meetsCost && meetsDisease && nearMeds)
  )

  // Identify gaps
  const eligibilityGaps: string[] = []
  if (!meetsCost) {
    eligibilityGaps.push(`Drug costs $${member.drugCostsYTD.toFixed(0)} below $${ELIGIBILITY_2025.COST_THRESHOLD} threshold`)
  }
  if (!meetsDisease) {
    eligibilityGaps.push(`${member.chronicDiseaseCount} chronic diseases, need ${ELIGIBILITY_2025.MIN_CHRONIC_DISEASES}+`)
  }
  if (!meetsMeds) {
    eligibilityGaps.push(`${member.activePartDMeds} Part D meds, need ${ELIGIBILITY_2025.MIN_PART_D_MEDS}+`)
  }
  if (member.optOut) {
    eligibilityGaps.push('Member opted out of MTM program')
  }

  const chronicDiseases = member.chronicDiseases
    ? member.chronicDiseases.split(',').filter(Boolean)
    : []

  return {
    memberId: member.id,
    memberName: member.name,
    eligible,
    meetsCostCriterion: meetsCost,
    meetsDiseaseCriterion: meetsDisease,
    meetsMedCountCriterion: meetsMeds,
    drugCostsYTD: member.drugCostsYTD,
    chronicDiseaseCount: member.chronicDiseaseCount,
    activePartDMeds: member.activePartDMeds,
    chronicDiseases,
    nearEligibility,
    eligibilityGaps,
    optedOut: member.optOut
  }
}

/**
 * Calculate population-level eligibility summary
 */
export function calculatePopulationSummary(members: MemberEligibilityData[]): PopulationSummary {
  const results = members.map(checkEligibility)

  const eligibleMembers = results.filter(r => r.eligible).length
  const nearEligibleMembers = results.filter(r => r.nearEligibility).length
  const optedOutMembers = members.filter(m => m.optOut).length

  // Count by criterion
  const meetsCost = results.filter(r => r.meetsCostCriterion).length
  const meetsDisease = results.filter(r => r.meetsDiseaseCriterion).length
  const meetsMeds = results.filter(r => r.meetsMedCountCriterion).length

  // Count by disease
  const diseaseCounts = new Map<string, number>()
  CORE_CHRONIC_DISEASES.forEach(d => diseaseCounts.set(d.code, 0))

  members.forEach(member => {
    const diseases = member.chronicDiseases?.split(',') || []
    diseases.forEach(d => {
      if (diseaseCounts.has(d)) {
        diseaseCounts.set(d, diseaseCounts.get(d)! + 1)
      }
    })
  })

  const byDisease = CORE_CHRONIC_DISEASES.map(d => ({
    code: d.code,
    name: d.name,
    count: diseaseCounts.get(d.code) || 0,
    percentage: members.length > 0
      ? parseFloat((((diseaseCounts.get(d.code) || 0) / members.length) * 100).toFixed(1))
      : 0
  })).sort((a, b) => b.count - a.count)

  // Estimate projected growth due to 2025 threshold reduction
  // Members who would be eligible under old rules
  const eligibleUnderOldRules = members.filter(m =>
    m.drugCostsYTD >= ELIGIBILITY_PRIOR.COST_THRESHOLD &&
    m.chronicDiseaseCount >= ELIGIBILITY_PRIOR.MIN_CHRONIC_DISEASES &&
    m.activePartDMeds >= ELIGIBILITY_PRIOR.MIN_PART_D_MEDS &&
    !m.optOut
  ).length

  const projectedGrowth = eligibleUnderOldRules > 0
    ? parseFloat((((eligibleMembers - eligibleUnderOldRules) / eligibleUnderOldRules) * 100).toFixed(1))
    : eligibleMembers * 100 // All new if none under old rules

  return {
    totalMembers: members.length,
    eligibleMembers,
    eligibilityRate: members.length > 0
      ? parseFloat(((eligibleMembers / members.length) * 100).toFixed(1))
      : 0,
    nearEligibleMembers,
    optedOutMembers,
    projectedGrowth,
    byCriterion: {
      meetsCost,
      meetsDisease,
      meetsMeds,
      meetsAllThree: eligibleMembers
    },
    byDisease
  }
}

/**
 * Get members who are near-eligible (for proactive outreach)
 */
export function getNearEligibleMembers(members: MemberEligibilityData[]): EligibilityResult[] {
  return members
    .map(checkEligibility)
    .filter(r => r.nearEligibility)
    .sort((a, b) => {
      // Sort by how close they are to full eligibility
      const aGaps = a.eligibilityGaps.length
      const bGaps = b.eligibilityGaps.length
      return aGaps - bGaps
    })
}

/**
 * Get newly eligible members under 2025 rules
 * (Would not have been eligible under prior rules)
 */
export function getNewlyEligibleMembers(members: MemberEligibilityData[]): EligibilityResult[] {
  return members
    .map(checkEligibility)
    .filter(r => {
      // Eligible under 2025 rules
      if (!r.eligible) return false

      // Check if would NOT be eligible under old rules (mainly cost threshold)
      const member = members.find(m => m.id === r.memberId)
      if (!member) return false

      return member.drugCostsYTD < ELIGIBILITY_PRIOR.COST_THRESHOLD
    })
}

/**
 * Format eligibility status for display
 */
export function formatEligibilityStatus(result: EligibilityResult): {
  status: 'eligible' | 'near_eligible' | 'not_eligible' | 'opted_out'
  label: string
  color: string
  icon: string
} {
  if (result.optedOut) {
    return {
      status: 'opted_out',
      label: 'Opted Out',
      color: 'text-gray-500',
      icon: 'x-circle'
    }
  }

  if (result.eligible) {
    return {
      status: 'eligible',
      label: 'MTM Eligible',
      color: 'text-green-600',
      icon: 'check-circle'
    }
  }

  if (result.nearEligibility) {
    return {
      status: 'near_eligible',
      label: 'Near Eligible',
      color: 'text-yellow-600',
      icon: 'alert-circle'
    }
  }

  return {
    status: 'not_eligible',
    label: 'Not Eligible',
    color: 'text-gray-400',
    icon: 'minus-circle'
  }
}

/**
 * Generate eligibility trend projection
 */
export function projectEligibilityTrend(
  currentSummary: PopulationSummary,
  monthsToProject: number = 6
): Array<{
  month: string
  projected: number
  cumulative: number
}> {
  const trend: Array<{ month: string; projected: number; cumulative: number }> = []
  const monthlyGrowthRate = 0.02 // 2% monthly growth estimate

  const now = new Date()
  let cumulative = currentSummary.eligibleMembers

  for (let i = 1; i <= monthsToProject; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const monthLabel = futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    const projected = Math.round(currentSummary.nearEligibleMembers * monthlyGrowthRate * i)
    cumulative += projected

    trend.push({
      month: monthLabel,
      projected,
      cumulative
    })
  }

  return trend
}
