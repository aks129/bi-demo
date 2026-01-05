import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { BarChart } from '@/components/charts/BarChart'
import {
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Pill,
  Heart,
  UserX
} from 'lucide-react'
import {
  calculatePopulationSummary,
  ELIGIBILITY_2025,
  ELIGIBILITY_PRIOR,
  CORE_CHRONIC_DISEASES,
  getNearEligibleMembers,
  checkEligibility
} from '@/lib/engines/eligibilityEngine'

async function getEligibilityData() {
  const members = await prisma.dimMember.findMany({
    select: {
      id: true,
      memberId: true,
      name: true,
      drugCostsYTD: true,
      chronicDiseaseCount: true,
      chronicDiseases: true,
      activePartDMeds: true,
      mtmEligible: true,
      optOut: true
    }
  })

  return members.map(m => ({
    id: m.id,
    memberId: m.memberId || undefined,
    name: m.name,
    drugCostsYTD: m.drugCostsYTD,
    chronicDiseaseCount: m.chronicDiseaseCount,
    chronicDiseases: m.chronicDiseases || '',
    activePartDMeds: m.activePartDMeds,
    mtmEligible: m.mtmEligible,
    optOut: m.optOut
  }))
}

export default async function EligibilityDashboardPage() {
  const members = await getEligibilityData()

  // Calculate population summary
  const summary = calculatePopulationSummary(members)
  const nearEligible = getNearEligibleMembers(members)

  // Calculate how many would be eligible under old vs new rules
  const eligibleUnderOldRules = members.filter(m =>
    m.drugCostsYTD >= ELIGIBILITY_PRIOR.COST_THRESHOLD &&
    m.chronicDiseaseCount >= ELIGIBILITY_PRIOR.MIN_CHRONIC_DISEASES &&
    m.activePartDMeds >= ELIGIBILITY_PRIOR.MIN_PART_D_MEDS &&
    !m.optOut
  ).length

  const newlyEligibleCount = summary.eligibleMembers - eligibleUnderOldRules

  // Prepare disease distribution chart data
  const diseaseChartData = summary.byDisease.slice(0, 10).map(d => ({
    disease: d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name,
    fullName: d.name,
    count: d.count,
    percentage: d.percentage
  }))

  // Prepare criteria funnel data
  const criteriaFunnel = [
    { criterion: 'Total Members', count: summary.totalMembers, percentage: 100 },
    { criterion: `Cost ≥$${ELIGIBILITY_2025.COST_THRESHOLD}`, count: summary.byCriterion.meetsCost, percentage: (summary.byCriterion.meetsCost / summary.totalMembers * 100) },
    { criterion: `${ELIGIBILITY_2025.MIN_CHRONIC_DISEASES}+ Diseases`, count: summary.byCriterion.meetsDisease, percentage: (summary.byCriterion.meetsDisease / summary.totalMembers * 100) },
    { criterion: `${ELIGIBILITY_2025.MIN_PART_D_MEDS}+ Meds`, count: summary.byCriterion.meetsMeds, percentage: (summary.byCriterion.meetsMeds / summary.totalMembers * 100) },
    { criterion: 'MTM Eligible', count: summary.eligibleMembers, percentage: summary.eligibilityRate }
  ]

  return (
    <DashboardLayout
      title="2025 CMS Eligibility Dashboard"
      subtitle="MTM population analysis under new CMS eligibility rules effective January 1, 2025"
    >
      {/* 2025 Rules Change Banner */}
      <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900">2025 CMS MTM Eligibility Changes</h3>
            <p className="text-amber-800 mt-1">
              The cost threshold has been reduced from $5,000+ to <strong>$1,623</strong>, significantly expanding the eligible population.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-amber-600 uppercase">Cost Threshold</p>
                <p className="font-bold text-amber-900">$1,623 <span className="text-xs font-normal text-amber-600">(was $5,000+)</span></p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-amber-600 uppercase">Chronic Diseases</p>
                <p className="font-bold text-amber-900">3+ of 10 core</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-amber-600 uppercase">Part D Meds</p>
                <p className="font-bold text-amber-900">8+ active</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-amber-600 uppercase">New Condition</p>
                <p className="font-bold text-amber-900">HIV/AIDS added</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Total Members"
          value={summary.totalMembers.toLocaleString()}
          subtitle="In population"
          status="neutral"
          icon={<Users className="h-10 w-10" />}
        />
        <KPICard
          title="MTM Eligible"
          value={summary.eligibleMembers.toLocaleString()}
          subtitle={`${summary.eligibilityRate.toFixed(1)}% of population`}
          status="healthy"
          icon={<CheckCircle className="h-10 w-10" />}
        />
        <KPICard
          title="Newly Eligible"
          value={newlyEligibleCount.toLocaleString()}
          subtitle="Due to 2025 rules"
          status="warning"
          change={{ value: summary.projectedGrowth, period: 'vs prior rules' }}
          icon={<TrendingUp className="h-10 w-10" />}
        />
        <KPICard
          title="Near Eligible"
          value={summary.nearEligibleMembers.toLocaleString()}
          subtitle="Close to threshold"
          status="warning"
          icon={<AlertCircle className="h-10 w-10" />}
        />
        <KPICard
          title="Opted Out"
          value={summary.optedOutMembers.toLocaleString()}
          subtitle="Declined MTM"
          status="critical"
          icon={<UserX className="h-10 w-10" />}
        />
      </div>

      {/* Population Funnel and Disease Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Eligibility Funnel"
          subtitle="Members meeting each criterion"
        >
          <div className="space-y-3">
            {criteriaFunnel.map((item, idx) => (
              <div key={item.criterion}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.criterion}</span>
                  <span className="font-semibold">{item.count.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all ${
                      idx === criteriaFunnel.length - 1 ? 'bg-green-500' :
                      idx === 0 ? 'bg-gray-400' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Impact:</strong> {summary.eligibilityRate.toFixed(1)}% of your population meets all 2025 eligibility criteria.
              With the reduced cost threshold, expect this to grow as claims data accumulates.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Chronic Disease Distribution"
          subtitle="Core conditions in your population"
        >
          <BarChart
            data={diseaseChartData}
            xKey="disease"
            bars={[{ dataKey: 'count', color: '#8b5cf6', name: 'Members' }]}
            height={300}
            layout="vertical"
          />
          <div className="mt-4 text-xs text-gray-500">
            * 2025 requires 3+ of 10 core conditions. HIV/AIDS was added for 2025.
          </div>
        </DashboardCard>
      </div>

      {/* Criteria Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Cost Criterion"
          subtitle={`≥$${ELIGIBILITY_2025.COST_THRESHOLD} annual drug costs`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Members Meeting</p>
                  <p className="text-2xl font-bold text-green-900">{summary.byCriterion.meetsCost.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-green-700">
                {((summary.byCriterion.meetsCost / summary.totalMembers) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>2025 Change:</strong> Threshold reduced from $5,000+ to $1,623</p>
              <p className="mt-2"><strong>Impact:</strong> This change alone is expected to 2-3x the eligible population</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Disease Criterion"
          subtitle={`${ELIGIBILITY_2025.MIN_CHRONIC_DISEASES}+ core chronic diseases`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600">Members Meeting</p>
                  <p className="text-2xl font-bold text-purple-900">{summary.byCriterion.meetsDisease.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {((summary.byCriterion.meetsDisease / summary.totalMembers) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>2025 Change:</strong> HIV/AIDS added to 10 core conditions</p>
              <p className="mt-2"><strong>Core 10:</strong> Alzheimer's, Arthritis, CHF, Diabetes, Dyslipidemia, ESRD, HIV/AIDS, HTN, Mental Health, Respiratory</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Medication Criterion"
          subtitle={`${ELIGIBILITY_2025.MIN_PART_D_MEDS}+ active Part D meds`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Pill className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Members Meeting</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.byCriterion.meetsMeds.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-blue-700">
                {((summary.byCriterion.meetsMeds / summary.totalMembers) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Threshold:</strong> 8 or more active Part D covered drugs</p>
              <p className="mt-2"><strong>Note:</strong> Polypharmacy often correlates with disease burden, making this a natural filter for complex patients</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Near-Eligible Members Table */}
      {nearEligible.length > 0 && (
        <DashboardCard
          title="Near-Eligible Members"
          subtitle={`${nearEligible.length} members close to meeting eligibility criteria`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Drug Costs</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Diseases</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Meds</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Gap</th>
                </tr>
              </thead>
              <tbody>
                {nearEligible.slice(0, 10).map((member) => (
                  <tr key={member.memberId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{member.memberName}</p>
                    </td>
                    <td className={`py-3 px-4 text-right ${member.meetsCostCriterion ? 'text-green-600' : 'text-gray-600'}`}>
                      ${member.drugCostsYTD.toFixed(0)}
                      {member.meetsCostCriterion && <CheckCircle className="inline h-4 w-4 ml-1" />}
                    </td>
                    <td className={`py-3 px-4 text-right ${member.meetsDiseaseCriterion ? 'text-green-600' : 'text-gray-600'}`}>
                      {member.chronicDiseaseCount}
                      {member.meetsDiseaseCriterion && <CheckCircle className="inline h-4 w-4 ml-1" />}
                    </td>
                    <td className={`py-3 px-4 text-right ${member.meetsMedCountCriterion ? 'text-green-600' : 'text-gray-600'}`}>
                      {member.activePartDMeds}
                      {member.meetsMedCountCriterion && <CheckCircle className="inline h-4 w-4 ml-1" />}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {member.eligibilityGaps[0]?.split(' ').slice(0, 4).join(' ')}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Proactive Outreach:</strong> These members are close to MTM eligibility. Monitor for changes in drug costs or new diagnoses that may push them over the threshold.
            </p>
          </div>
        </DashboardCard>
      )}

      {/* Impact Summary */}
      <DashboardCard title="2025 Eligibility Impact Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">So What?</h4>
            <p className="text-sm text-gray-600">
              The 2025 CMS rules expand your MTM-eligible population by approximately <strong>{summary.projectedGrowth.toFixed(0)}%</strong>.
              With {summary.eligibleMembers} currently eligible members (vs. {eligibleUnderOldRules} under prior rules),
              you need to prepare for increased service volume.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Now What?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Assess staffing capacity for {newlyEligibleCount} new eligible members</li>
              <li>• Update outreach scripts for expanded population</li>
              <li>• Monitor {summary.nearEligibleMembers} near-eligible members</li>
              <li>• Prepare reporting for CMS compliance</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Key Dates</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rule Effective:</span>
                <span className="font-medium">Jan 1, 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cost Threshold:</span>
                <span className="font-medium text-green-600">$1,623</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prior Threshold:</span>
                <span className="font-medium text-gray-400 line-through">$5,000+</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  )
}
