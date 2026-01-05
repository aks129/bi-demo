// Mock data for Platform features (Community, Wiki, Case Studies, Benchmarking, Reports, Feed)

// ============== COMMUNITY ==============
export interface MockCommunityPost {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  title: string
  content: string
  category: string
  tags: string[]
  viewCount: number
  isPinned: boolean
  voteCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MockCommunityComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  parentId: string | null
  createdAt: Date
}

export const mockCommunityPosts: MockCommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: 'Dr. Sarah Kim',
    authorRole: 'Clinical Pharmacist',
    title: 'Best practices for improving CMR completion rates',
    content: `After analyzing our MTM program data, we've identified several strategies that consistently improve CMR completion rates:\n\n1. **Optimal Contact Times**: Our data shows that calling between 10am-12pm and 2pm-4pm yields 40% higher connection rates.\n\n2. **Pre-Call Preparation**: Review the member's medication list before calling. Having specific talking points about their regimen increases engagement.\n\n3. **Follow-up Protocol**: For members who decline initially, a follow-up call 2 weeks later with new information (e.g., recent Star Ratings impact) converts 25% of initial refusals.\n\nWhat strategies have worked for your teams?`,
    category: 'best-practice',
    tags: ['CMR', 'completion-rate', 'outreach'],
    viewCount: 234,
    isPinned: true,
    voteCount: 45,
    commentCount: 12,
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: 'Michael Chen',
    authorRole: 'MTM Program Manager',
    title: 'Question: How are you handling the 2025 eligibility changes?',
    content: `With the 2025 CMS eligibility threshold dropping to $1,623 and HIV/AIDS being added to the core conditions, we're projecting a 40% increase in eligible members.\n\nHow are other programs preparing for this volume increase?\n\n- Are you hiring additional pharmacists?\n- Implementing new automation tools?\n- Adjusting workflow priorities?\n\nWould love to hear your strategies!`,
    category: 'question',
    tags: ['2025', 'eligibility', 'CMS', 'planning'],
    viewCount: 189,
    isPinned: false,
    voteCount: 32,
    commentCount: 8,
    createdAt: new Date('2025-12-18'),
    updatedAt: new Date('2025-12-18'),
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    authorName: 'Amanda Rodriguez',
    authorRole: 'Quality Coordinator',
    title: 'Success Story: 15% adherence improvement in 6 months',
    content: `Wanted to share a success story from our Midwest region!\n\nWe implemented a targeted intervention program for members with PDC between 70-79% (the "cusp" population) and saw:\n\n- **15% improvement** in average adherence\n- **$2.3M additional cost avoidance**\n- **4.2 Star Rating** achieved (up from 3.5)\n\nKey factors:\n1. Weekly adherence monitoring alerts\n2. Dedicated pharmacist assigned to cohort\n3. Coordination with prescribers for 90-day fills\n\nHappy to share more details with anyone interested!`,
    category: 'discussion',
    tags: ['adherence', 'success-story', 'Star-Ratings'],
    viewCount: 312,
    isPinned: false,
    voteCount: 67,
    commentCount: 15,
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2025-12-12'),
  },
  {
    id: 'post-4',
    authorId: 'user-4',
    authorName: 'ACME Admin',
    authorRole: 'System Admin',
    title: 'Announcement: New Benchmarking Dashboard Available',
    content: `We're excited to announce the launch of our new Benchmarking & National Comparison dashboard!\n\n**New Features:**\n- Compare your metrics against anonymized national averages\n- Percentile rankings across all key KPIs\n- Historical trend comparison with industry benchmarks\n- CMS Star Ratings threshold visualization\n\nAccess it from the Platform menu in the sidebar.\n\nFeedback welcome!`,
    category: 'announcement',
    tags: ['new-feature', 'benchmarking', 'platform'],
    viewCount: 456,
    isPinned: true,
    voteCount: 89,
    commentCount: 23,
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-01'),
  },
]

export const mockCommunityComments: MockCommunityComment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-5',
    authorName: 'Dr. James Wilson',
    content: 'Great insights! We\'ve also found that sending a text reminder 24 hours before the scheduled call increases our show rate by 35%.',
    parentId: null,
    createdAt: new Date('2025-12-16'),
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    authorId: 'user-6',
    authorName: 'Lisa Thompson',
    content: 'What system are you using for the text reminders? We\'ve been looking for a HIPAA-compliant solution.',
    parentId: 'comment-1',
    createdAt: new Date('2025-12-16'),
  },
  {
    id: 'comment-3',
    postId: 'post-2',
    authorId: 'user-1',
    authorName: 'Dr. Sarah Kim',
    content: 'We\'re planning to onboard 3 additional clinical pharmacists in Q1 2025. Also implementing automated eligibility scoring to prioritize high-value members.',
    parentId: null,
    createdAt: new Date('2025-12-19'),
  },
]

// ============== WIKI & DATA DICTIONARY ==============
export interface MockWikiPage {
  id: string
  slug: string
  title: string
  content: string
  category: string
  parentId: string | null
  authorId: string
  authorName: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface MockDictionaryEntry {
  id: string
  term: string
  definition: string
  category: string
  dataType: string | null
  source: string | null
  formula: string | null
  example: string | null
  relatedTerms: string[]
}

export const mockWikiPages: MockWikiPage[] = [
  {
    id: 'wiki-1',
    slug: 'pdc-calculation',
    title: 'PDC (Proportion of Days Covered) Calculation',
    content: `# PDC Calculation Guide

## Overview
PDC (Proportion of Days Covered) is the gold standard for measuring medication adherence, endorsed by CMS and PQA.

## Formula
\`\`\`
PDC = (Total Days with Medication Available / Total Days in Measurement Period) × 100
\`\`\`

## Key Rules
1. **Non-overlapping supply**: Days with overlapping fills only count once
2. **90-day vs 180-day**: Different lookback periods for different use cases
3. **Drug class grouping**: PDC calculated per therapeutic class

## CMS Thresholds
- **≥80%**: Adherent (4+ Star Rating)
- **75-79%**: At Risk
- **<75%**: Non-Adherent

## Example
Member with diabetes medication:
- Measurement period: 90 days
- Days with medication available: 75 days
- PDC = 75/90 × 100 = **83.3%** (Adherent)`,
    category: 'metric',
    parentId: null,
    authorId: 'user-1',
    authorName: 'Dr. Sarah Kim',
    publishedAt: new Date('2025-11-01'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-12-15'),
  },
  {
    id: 'wiki-2',
    slug: 'aim-model',
    title: 'AIM (Actuarial Impact Model) Overview',
    content: `# AIM Cost Avoidance Model

## What is AIM?
The Actuarial Impact Model (AIM) quantifies the financial value of MTM interventions by estimating avoided healthcare costs.

## Severity Levels
| Level | Description | Est. Cost Avoidance |
|-------|-------------|---------------------|
| 1 | Minor counseling | $50 |
| 2 | Basic DTP resolution | $150 |
| 3 | Moderate intervention | $500 |
| 4 | Significant DTP | $1,500 |
| 5 | Major intervention | $5,000 |
| 6 | Critical prevention | $15,000 |
| 7 | Life-saving intervention | $30,000 |

## ROI Calculation
\`\`\`
ROI = (Total Cost Avoidance - Program Costs) / Program Costs
\`\`\`

Industry average: **2.8x ROI**
Top performers: **4.0x+ ROI**`,
    category: 'metric',
    parentId: null,
    authorId: 'user-2',
    authorName: 'Michael Chen',
    publishedAt: new Date('2025-10-15'),
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-12-01'),
  },
  {
    id: 'wiki-3',
    slug: 'cmr-workflow',
    title: 'CMR (Comprehensive Medication Review) Workflow',
    content: `# CMR Workflow Guide

## Pre-Call Preparation
1. Review member medication history
2. Check recent claims for gaps
3. Identify potential DTPs
4. Prepare talking points

## During the Call
1. Verify identity (2-factor)
2. Review all medications
3. Assess adherence barriers
4. Document DTPs found
5. Provide recommendations

## Post-Call
1. Document result code
2. Send MAP to member
3. Notify prescriber if needed
4. Schedule follow-up TIP

## Result Codes
- **300**: DTP Identified
- **301**: No DTP Identified
- **379**: Unable to Reach
- **380**: Patient Refused`,
    category: 'process',
    parentId: null,
    authorId: 'user-3',
    authorName: 'Amanda Rodriguez',
    publishedAt: new Date('2025-09-01'),
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-11-20'),
  },
]

export const mockDictionaryEntries: MockDictionaryEntry[] = [
  {
    id: 'dict-1',
    term: 'PDC',
    definition: 'Proportion of Days Covered - A measure of medication adherence calculated as the percentage of days a patient has access to medication over a defined period.',
    category: 'metric',
    dataType: 'number',
    source: 'FactAdherence.pdc90',
    formula: '(Days with Medication / Total Days in Period) × 100',
    example: 'PDC of 85% means the patient had medication available for 85% of the measurement period',
    relatedTerms: ['MPR', 'Adherence', 'Star Ratings'],
  },
  {
    id: 'dict-2',
    term: 'CMR',
    definition: 'Comprehensive Medication Review - An interactive consultation between a pharmacist and patient to review all medications, identify problems, and create an action plan.',
    category: 'clinical',
    dataType: 'string',
    source: 'Claim.opportunityType',
    formula: null,
    example: 'A 30-minute phone call reviewing all 12 of a patient\'s medications',
    relatedTerms: ['TIP', 'MTM', 'MAP'],
  },
  {
    id: 'dict-3',
    term: 'DTP',
    definition: 'Drug Therapy Problem - Any issue with medication therapy that prevents optimal outcomes, including adverse effects, drug interactions, or non-adherence.',
    category: 'clinical',
    dataType: 'string',
    source: 'Claim.resultCode',
    formula: null,
    example: 'Patient taking two medications that interact, causing dizziness',
    relatedTerms: ['CMR', 'Intervention', 'Result Code'],
  },
  {
    id: 'dict-4',
    term: 'Star Rating',
    definition: 'CMS quality rating system (1-5 stars) measuring Medicare Advantage and Part D plan performance. Higher ratings qualify for bonus payments.',
    category: 'business',
    dataType: 'number',
    source: null,
    formula: 'Based on adherence measures: ≥80% PDC = 4+ stars',
    example: 'A plan with 82% adherence across drug classes achieves 4.5 stars',
    relatedTerms: ['PDC', 'CMS', 'Quality Bonus'],
  },
  {
    id: 'dict-5',
    term: 'AIM Value',
    definition: 'Actuarial Impact Model dollar value - Estimated cost avoidance from an MTM intervention based on severity level.',
    category: 'metric',
    dataType: 'number',
    source: 'Claim.aimDollarValue',
    formula: 'Lookup by severityLevel: L1=$50, L2=$150, L3=$500, L4=$1,500, L5=$5,000, L6=$15,000, L7=$30,000',
    example: 'A Level 4 intervention preventing an ER visit = $1,500 cost avoidance',
    relatedTerms: ['ROI', 'Severity Level', 'Cost Avoidance'],
  },
  {
    id: 'dict-6',
    term: 'MTM Eligibility',
    definition: 'Criteria for Medicare Part D Medication Therapy Management program enrollment, based on chronic conditions, medications, and drug costs.',
    category: 'business',
    dataType: 'boolean',
    source: 'DimMember.mtmEligible',
    formula: '2025: ≥3 chronic conditions AND ≥8 Part D drugs AND ≥$1,623 drug costs YTD',
    example: 'Patient with diabetes, hypertension, CHF taking 10 medications with $2,100 drug costs = Eligible',
    relatedTerms: ['CMS', 'Part D', 'Chronic Conditions'],
  },
]

// ============== CASE STUDIES ==============
export interface MockCaseStudy {
  id: string
  clientId: string | null
  title: string
  summary: string
  challenge: string
  solution: string
  outcomes: Array<{ metric: string; before: string; after: string; improvement: string }>
  industry: string
  tags: string[]
  featured: boolean
  publishedAt: Date | null
  authorId: string
  authorName: string
  createdAt: Date
}

export const mockCaseStudies: MockCaseStudy[] = [
  {
    id: 'case-1',
    clientId: null,
    title: 'Blue Shield Northeast: 18% Adherence Improvement',
    summary: 'How a regional Medicare Advantage plan achieved 4.5 Star Rating through targeted adherence interventions.',
    challenge: 'Blue Shield Northeast was struggling with low adherence rates (68% average PDC) and facing potential loss of CMS quality bonus payments worth $4.2M annually.',
    solution: 'Implemented a three-pronged approach: 1) Weekly adherence monitoring alerts for at-risk members, 2) Dedicated pharmacist cohort management, 3) Prescriber coordination for 90-day fills and mail-order conversion.',
    outcomes: [
      { metric: 'Average PDC', before: '68%', after: '86%', improvement: '+18%' },
      { metric: 'Star Rating', before: '3.0', after: '4.5', improvement: '+1.5 stars' },
      { metric: 'Cost Avoidance', before: '$1.2M', after: '$4.8M', improvement: '+$3.6M' },
      { metric: 'Member Satisfaction', before: '72%', after: '89%', improvement: '+17%' },
    ],
    industry: 'medicare',
    tags: ['adherence', 'star-ratings', 'pharmacist-intervention'],
    featured: true,
    publishedAt: new Date('2025-11-15'),
    authorId: 'user-1',
    authorName: 'Dr. Sarah Kim',
    createdAt: new Date('2025-11-15'),
  },
  {
    id: 'case-2',
    clientId: null,
    title: 'HealthFirst Midwest: ROI Optimization Success',
    summary: 'Achieving 4.2x ROI by focusing on high-severity interventions and efficient resource allocation.',
    challenge: 'HealthFirst was seeing diminishing returns on their MTM investment with a 2.1x ROI, below industry average. High-cost interventions were not being prioritized effectively.',
    solution: 'Deployed AIM-based prioritization in the work queue, routing high-severity cases to experienced pharmacists and using automated outreach for low-complexity members.',
    outcomes: [
      { metric: 'ROI Multiple', before: '2.1x', after: '4.2x', improvement: '+100%' },
      { metric: 'Avg Severity Level', before: '2.3', after: '4.1', improvement: '+78%' },
      { metric: 'Cost per Intervention', before: '$85', after: '$62', improvement: '-27%' },
      { metric: 'Annual Savings', before: '$2.8M', after: '$6.4M', improvement: '+$3.6M' },
    ],
    industry: 'medicare',
    tags: ['ROI', 'AIM', 'efficiency'],
    featured: true,
    publishedAt: new Date('2025-10-20'),
    authorId: 'user-2',
    authorName: 'Michael Chen',
    createdAt: new Date('2025-10-20'),
  },
  {
    id: 'case-3',
    clientId: null,
    title: 'SunCare West: Reducing Refusal Rates',
    summary: 'Cutting patient refusal rates in half through improved outreach strategies and member engagement.',
    challenge: 'SunCare had a 22% refusal rate, significantly impacting completion rates and wasting pharmacist time on unsuccessful calls.',
    solution: 'Redesigned outreach scripts, implemented pre-call SMS notifications, offered flexible scheduling options, and introduced member incentive program.',
    outcomes: [
      { metric: 'Refusal Rate', before: '22%', after: '11%', improvement: '-50%' },
      { metric: 'Completion Rate', before: '58%', after: '74%', improvement: '+28%' },
      { metric: 'Pharmacist Efficiency', before: '4.2 CMRs/day', after: '6.1 CMRs/day', improvement: '+45%' },
      { metric: 'Member Engagement', before: '45%', after: '72%', improvement: '+27%' },
    ],
    industry: 'medicare',
    tags: ['refusal-rate', 'member-engagement', 'outreach'],
    featured: false,
    publishedAt: new Date('2025-09-10'),
    authorId: 'user-3',
    authorName: 'Amanda Rodriguez',
    createdAt: new Date('2025-09-10'),
  },
]

// ============== BENCHMARKING ==============
export interface MockBenchmarkMetric {
  metricKey: string
  metricName: string
  clientValue: number
  percentile: number
  nationalAvg: number
  topDecile: number
  bottomDecile: number
  trend: 'up' | 'down' | 'stable'
}

export const mockBenchmarkMetrics: MockBenchmarkMetric[] = [
  {
    metricKey: 'completion-rate',
    metricName: 'CMR Completion Rate',
    clientValue: 76.5,
    percentile: 65,
    nationalAvg: 72.0,
    topDecile: 88.0,
    bottomDecile: 55.0,
    trend: 'up',
  },
  {
    metricKey: 'adherence-pdc',
    metricName: 'Overall Adherence (PDC)',
    clientValue: 81.2,
    percentile: 72,
    nationalAvg: 78.5,
    topDecile: 89.0,
    bottomDecile: 65.0,
    trend: 'up',
  },
  {
    metricKey: 'refusal-rate',
    metricName: 'Patient Refusal Rate',
    clientValue: 12.5,
    percentile: 58,
    nationalAvg: 15.0,
    topDecile: 8.0,
    bottomDecile: 25.0,
    trend: 'down',
  },
  {
    metricKey: 'roi-multiple',
    metricName: 'ROI Multiple',
    clientValue: 3.4,
    percentile: 70,
    nationalAvg: 2.8,
    topDecile: 4.5,
    bottomDecile: 1.5,
    trend: 'up',
  },
  {
    metricKey: 'cost-avoidance',
    metricName: 'Cost Avoidance per Member',
    clientValue: 245,
    percentile: 68,
    nationalAvg: 210,
    topDecile: 380,
    bottomDecile: 95,
    trend: 'stable',
  },
  {
    metricKey: 'star-rating',
    metricName: 'Overall Star Rating',
    clientValue: 4.0,
    percentile: 75,
    nationalAvg: 3.5,
    topDecile: 4.5,
    bottomDecile: 2.5,
    trend: 'up',
  },
]

// ============== CUSTOM REPORTS ==============
export interface MockCustomReport {
  id: string
  name: string
  description: string | null
  config: {
    metrics: string[]
    filters: Record<string, string>
    groupBy: string[]
    chartType: string
  }
  isPublic: boolean
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
  lastRunAt: Date | null
}

export const mockCustomReports: MockCustomReport[] = [
  {
    id: 'report-1',
    name: 'Weekly Adherence Summary',
    description: 'Adherence metrics by drug class with week-over-week comparison',
    config: {
      metrics: ['pdc90', 'atRiskCount', 'criticalCount'],
      filters: { dateRange: 'last7days' },
      groupBy: ['drugClass'],
      chartType: 'bar',
    },
    isPublic: true,
    authorId: 'user-1',
    authorName: 'Dr. Sarah Kim',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-12-15'),
    lastRunAt: new Date('2025-12-20'),
  },
  {
    id: 'report-2',
    name: 'MTM Performance Dashboard',
    description: 'Comprehensive MTM metrics including completion rates, ROI, and eligibility',
    config: {
      metrics: ['completionRate', 'attemptRate', 'refusalRate', 'roiMultiple'],
      filters: { contract: 'all', dateRange: 'last30days' },
      groupBy: ['month'],
      chartType: 'line',
    },
    isPublic: true,
    authorId: 'user-2',
    authorName: 'Michael Chen',
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-12-10'),
    lastRunAt: new Date('2025-12-19'),
  },
  {
    id: 'report-3',
    name: 'High-Risk Member Cohort',
    description: 'Members with PDC below 75% requiring immediate intervention',
    config: {
      metrics: ['memberCount', 'avgPDC', 'potentialSavings'],
      filters: { pdcMax: '75', status: 'active' },
      groupBy: ['contract', 'drugClass'],
      chartType: 'table',
    },
    isPublic: false,
    authorId: 'user-3',
    authorName: 'Amanda Rodriguez',
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-18'),
    lastRunAt: new Date('2025-12-18'),
  },
]

// ============== ACTIVITY FEED ==============
export interface MockActivityItem {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  entityTitle: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
}

export const mockActivityItems: MockActivityItem[] = [
  {
    id: 'activity-1',
    userId: 'user-1',
    userName: 'Dr. Sarah Kim',
    action: 'completed',
    entityType: 'CMR',
    entityId: 'claim-123',
    entityTitle: 'CMR for John Smith',
    metadata: { resultCode: 300, severity: 4, aimValue: 1500 },
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: 'activity-2',
    userId: 'user-2',
    userName: 'Michael Chen',
    action: 'created',
    entityType: 'Report',
    entityId: 'report-4',
    entityTitle: 'Q4 Performance Summary',
    metadata: { metrics: ['completionRate', 'roi'], shared: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
  },
  {
    id: 'activity-3',
    userId: 'user-3',
    userName: 'Amanda Rodriguez',
    action: 'posted',
    entityType: 'Community',
    entityId: 'post-5',
    entityTitle: 'Tips for difficult patient conversations',
    metadata: { category: 'best-practice', tags: ['communication'] },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'activity-4',
    userId: 'user-1',
    userName: 'Dr. Sarah Kim',
    action: 'updated',
    entityType: 'Wiki',
    entityId: 'wiki-1',
    entityTitle: 'PDC Calculation Guide',
    metadata: { changeNote: 'Added 2025 CMS threshold updates' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: 'activity-5',
    userId: 'user-4',
    userName: 'System',
    action: 'alert',
    entityType: 'Notification',
    entityId: 'notif-1',
    entityTitle: 'Adherence Alert: 15 members dropped below 75%',
    metadata: { severity: 'high', count: 15 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: 'activity-6',
    userId: 'user-2',
    userName: 'Michael Chen',
    action: 'commented',
    entityType: 'Community',
    entityId: 'post-1',
    entityTitle: 'Best practices for improving CMR completion rates',
    metadata: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'activity-7',
    userId: 'user-3',
    userName: 'Amanda Rodriguez',
    action: 'published',
    entityType: 'CaseStudy',
    entityId: 'case-3',
    entityTitle: 'SunCare West: Reducing Refusal Rates',
    metadata: { industry: 'medicare', featured: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
]

// Available metrics for Report Builder
export const availableMetrics = [
  { key: 'completionRate', name: 'CMR Completion Rate', category: 'MTM', type: 'percentage' },
  { key: 'attemptRate', name: 'Attempt Rate', category: 'MTM', type: 'percentage' },
  { key: 'refusalRate', name: 'Refusal Rate', category: 'MTM', type: 'percentage' },
  { key: 'unreachableRate', name: 'Unreachable Rate', category: 'MTM', type: 'percentage' },
  { key: 'pdc90', name: 'PDC (90-day)', category: 'Adherence', type: 'percentage' },
  { key: 'pdc180', name: 'PDC (180-day)', category: 'Adherence', type: 'percentage' },
  { key: 'atRiskCount', name: 'At-Risk Members', category: 'Adherence', type: 'count' },
  { key: 'criticalCount', name: 'Critical Members', category: 'Adherence', type: 'count' },
  { key: 'healthyCount', name: 'Healthy Members', category: 'Adherence', type: 'count' },
  { key: 'roiMultiple', name: 'ROI Multiple', category: 'Financial', type: 'ratio' },
  { key: 'costAvoidance', name: 'Cost Avoidance', category: 'Financial', type: 'currency' },
  { key: 'grossSavings', name: 'Gross Savings', category: 'Financial', type: 'currency' },
  { key: 'eligibleMembers', name: 'Eligible Members', category: 'Eligibility', type: 'count' },
  { key: 'optOutRate', name: 'Opt-Out Rate', category: 'Eligibility', type: 'percentage' },
  { key: 'priorityScore', name: 'Avg Priority Score', category: 'Work Queue', type: 'number' },
]

export const availableFilters = [
  { key: 'dateRange', name: 'Date Range', options: ['last7days', 'last30days', 'last90days', 'thisYear', 'custom'] },
  { key: 'contract', name: 'Contract', options: ['all', 'H1234', 'H5678', 'H9012'] },
  { key: 'drugClass', name: 'Drug Class', options: ['all', 'Diabetes', 'Hypertension', 'Cholesterol', 'COPD'] },
  { key: 'status', name: 'Member Status', options: ['all', 'active', 'inactive', 'optOut'] },
]

export const chartTypes = [
  { key: 'bar', name: 'Bar Chart', icon: 'BarChart3' },
  { key: 'line', name: 'Line Chart', icon: 'LineChart' },
  { key: 'area', name: 'Area Chart', icon: 'AreaChart' },
  { key: 'table', name: 'Data Table', icon: 'Table' },
  { key: 'kpi', name: 'KPI Cards', icon: 'LayoutDashboard' },
]
