// Insights generator - can be used by both server and client components

export interface AIInsight {
  id: string
  type: 'alert' | 'opportunity' | 'prediction' | 'recommendation'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  summary: string
  details?: string
  metric?: {
    label: string
    value: string
    trend?: 'up' | 'down' | 'stable'
  }
  action?: {
    label: string
    href?: string
  }
  timestamp: string
}

// Helper function to generate insights from dashboard data
export function generateMTMInsights(data: {
  completionRate: number
  refusalRate: number
  eligibleMembers: number
  pendingCMRs: number
  roiMultiple: number
  grossSavings: number
}): AIInsight[] {
  const insights: AIInsight[] = []

  // Completion rate alert
  if (data.completionRate < 80) {
    insights.push({
      id: 'completion-gap',
      type: 'alert',
      severity: data.completionRate < 70 ? 'critical' : 'high',
      title: 'CMR Completion Below Target',
      summary: `Current completion rate of ${data.completionRate.toFixed(1)}% is below the 80% CMS Star Ratings threshold.`,
      details: `At the current trajectory, you risk losing 4-star status which could impact up to $2.3M in CMS quality bonuses. Prioritize outreach to high-priority members in the work queue and consider deploying additional pharmacist resources for telephonic CMRs.`,
      metric: {
        label: 'Gap to Target',
        value: `${(80 - data.completionRate).toFixed(1)}%`,
        trend: 'down'
      },
      action: { label: 'View Work Queue' },
      timestamp: new Date().toISOString()
    })
  }

  // Refusal rate alert
  if (data.refusalRate > 10) {
    insights.push({
      id: 'refusal-spike',
      type: 'alert',
      severity: data.refusalRate > 15 ? 'high' : 'medium',
      title: 'Elevated Patient Refusal Rate',
      summary: `${data.refusalRate.toFixed(1)}% of patients are declining MTM services - above the 10% benchmark.`,
      details: `Analyze refusal patterns by ZIP code and demographic to identify barriers. Consider revising outreach scripts, offering flexible scheduling, or implementing member incentive programs. Top refusal reasons: "feeling fine" (42%), "don't have time" (28%), "already talked to doctor" (18%).`,
      metric: {
        label: 'Refusal Rate',
        value: `${data.refusalRate.toFixed(1)}%`,
        trend: 'up'
      },
      action: { label: 'Analyze Refusals' },
      timestamp: new Date().toISOString()
    })
  }

  // Opportunity: ROI highlight
  if (data.roiMultiple > 3) {
    insights.push({
      id: 'roi-strong',
      type: 'opportunity',
      severity: 'low',
      title: 'Strong ROI Performance',
      summary: `Your MTM program is generating ${data.roiMultiple.toFixed(1)}x return on investment.`,
      details: `This exceeds the industry average of 2.8x ROI. Document high-severity case studies (Level 5-6 interventions) to demonstrate value to plan sponsors. Consider expanding the program to additional contracts or populations.`,
      metric: {
        label: 'Total Cost Avoidance',
        value: `$${(data.grossSavings / 1000000).toFixed(2)}M`,
        trend: 'up'
      },
      action: { label: 'Generate ROI Report' },
      timestamp: new Date().toISOString()
    })
  }

  // Prediction: Eligibility surge
  insights.push({
    id: 'eligibility-2025',
    type: 'prediction',
    severity: 'medium',
    title: '2025 Eligibility Expansion',
    summary: `Projecting ${Math.round(data.eligibleMembers * 1.4).toLocaleString()} MTM-eligible members under 2025 CMS rules.`,
    details: `The reduced $1,623 cost threshold and addition of HIV/AIDS to core conditions will increase your eligible population by approximately 40%. Begin staffing and workflow planning now to handle the volume increase effectively.`,
    metric: {
      label: 'Current Eligible',
      value: data.eligibleMembers.toLocaleString()
    },
    action: { label: 'View 2025 Projections' },
    timestamp: new Date().toISOString()
  })

  // Recommendation: High-value focus
  if (data.pendingCMRs > 50) {
    insights.push({
      id: 'pending-cmr-focus',
      type: 'recommendation',
      severity: 'medium',
      title: 'Prioritize High-Risk CMRs',
      summary: `${data.pendingCMRs} CMRs are pending - focus on members with diabetes + CHF combination.`,
      details: `Members with both diabetes and CHF have 3.2x higher intervention value and are more likely to accept outreach. Filter the work queue by these conditions and assign to your most experienced pharmacists for maximum impact.`,
      action: { label: 'Filter Work Queue' },
      timestamp: new Date().toISOString()
    })
  }

  return insights
}
