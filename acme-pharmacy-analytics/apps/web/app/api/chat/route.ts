import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SYSTEM_PROMPT = `You are an expert healthcare analytics assistant for ACME Pharmacy's MTM (Medication Therapy Management) Analytics platform. You help pharmacists, executives, and analysts understand their MTM program performance data.

Your role is to:
1. Explain MTM metrics like completion rates, Star Ratings thresholds, and AIM (Actuarial Investment Model) ROI calculations
2. Provide actionable insights based on the data shown
3. Answer questions about 2025 CMS eligibility rules and changes
4. Help interpret trends and patterns in the dashboard data
5. Suggest interventions and priorities based on the work queue

Key domain knowledge:
- CMS Star Ratings: 80% completion rate is the 4-star threshold for MTM
- Result codes: 300 (DTP Identified), 301 (No DTP), 379 (Unable to Reach), 380 (Refused)
- 2025 CMS changes: $1,623 cost threshold (reduced from $5,000+), HIV/AIDS added to core conditions
- AIM Severity levels: 1-7, with level 5-6 preventing ER visits/hospitalizations
- Priority scoring: Based on CMR needs, open TIPs, adherence PDC, and urgent gaps

Be concise, use healthcare terminology appropriately, and always tie insights back to business impact (cost avoidance, Star Ratings, patient outcomes).

When asked about specific data, use the context provided about the current dashboard state.`

async function getContextData() {
  try {
    // Get key metrics for context
    const [
      totalMembers,
      eligibleMembers,
      totalClaims,
      approvedClaims,
      contracts
    ] = await Promise.all([
      prisma.dimMember.count(),
      prisma.dimMember.count({ where: { mtmEligible: true } }),
      prisma.claim.count(),
      prisma.claim.count({ where: { status: 'Approved' } }),
      prisma.dimClient.findMany({ select: { name: true, cmsContractNumber: true } })
    ])

    // Get aggregate AIM value
    const aimAggregate = await prisma.claim.aggregate({
      where: { status: 'Approved' },
      _sum: { aimDollarValue: true }
    })

    // Get result code distribution
    const resultCodes = await prisma.claim.groupBy({
      by: ['resultCode'],
      _count: true
    })

    return {
      totalMembers,
      eligibleMembers,
      eligibilityRate: ((eligibleMembers / totalMembers) * 100).toFixed(1),
      totalClaims,
      approvedClaims,
      totalAimValue: aimAggregate._sum.aimDollarValue || 0,
      contracts: contracts.map(c => `${c.name} (${c.cmsContractNumber})`).join(', '),
      resultCodeDistribution: resultCodes
    }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key not configured. Add ANTHROPIC_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const { messages, dashboardContext } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

    // Get current data context
    const dataContext = await getContextData()

    // Build context message
    let contextMessage = ''
    if (dataContext) {
      contextMessage = `\n\nCurrent platform data:
- Total members: ${dataContext.totalMembers.toLocaleString()}
- MTM-eligible members: ${dataContext.eligibleMembers.toLocaleString()} (${dataContext.eligibilityRate}%)
- Total claims: ${dataContext.totalClaims.toLocaleString()}
- Approved interventions: ${dataContext.approvedClaims.toLocaleString()}
- Total AIM cost avoidance: $${dataContext.totalAimValue.toLocaleString()}
- Active contracts: ${dataContext.contracts}`
    }

    if (dashboardContext) {
      contextMessage += `\n\nCurrent dashboard view: ${dashboardContext}`
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + contextMessage,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, but I could not generate a response.'

    return NextResponse.json({
      message: assistantMessage,
      usage: response.usage
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
