import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// 2025 CMS Core Chronic Diseases (10 conditions)
const CORE_CHRONIC_DISEASES = [
  { code: 'ALZHEIMERS', name: "Alzheimer's Disease", category: 'CORE_10' },
  { code: 'BONE_ARTHRITIS', name: 'Bone Disease-Arthritis', category: 'CORE_10' },
  { code: 'CHF', name: 'Chronic Congestive Heart Failure', category: 'CORE_10' },
  { code: 'DIABETES', name: 'Diabetes', category: 'CORE_10' },
  { code: 'DYSLIPIDEMIA', name: 'Dyslipidemia', category: 'CORE_10' },
  { code: 'ESRD', name: 'End-Stage Renal Disease', category: 'CORE_10' },
  { code: 'HIV_AIDS', name: 'HIV/AIDS', category: 'CORE_10' }, // NEW for 2025
  { code: 'HYPERTENSION', name: 'Hypertension', category: 'CORE_10' },
  { code: 'MENTAL_HEALTH', name: 'Mental Health', category: 'CORE_10' },
  { code: 'RESPIRATORY', name: 'Respiratory Disease (Asthma, COPD)', category: 'CORE_10' },
]

// AIM Severity Level to Dollar Value mapping
const AIM_VALUES: Record<number, number> = {
  1: 50,      // Adherence support
  2: 150,     // Minor intervention
  3: 500,     // Prevented physician visit
  4: 1500,    // Moderate intervention
  5: 5000,    // Prevented ER visit
  6: 15000,   // Prevented hospitalization
  7: 30000,   // Life-threatening prevention
}

// Result codes per OutcomesMTM spec
const RESULT_CODES = {
  SUCCESS_DTP: 300,       // DTP Identified
  SUCCESS_NO_DTP: 301,    // No DTP Identified
  UNABLE_TO_REACH: 379,   // Unable to reach
  REFUSED: 380,           // Patient refused
}

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Mary', 'William', 'Patricia',
  'James', 'Jennifer', 'David', 'Linda', 'Richard', 'Barbara', 'Joseph', 'Elizabeth',
  'Thomas', 'Susan', 'Charles', 'Jessica', 'Christopher', 'Margaret', 'Daniel', 'Dorothy',
  'Matthew', 'Lisa', 'Anthony', 'Nancy', 'Mark', 'Karen', 'Donald', 'Betty',
  'Steven', 'Helen', 'Paul', 'Sandra', 'Andrew', 'Donna', 'Joshua', 'Carol',
  'Kenneth', 'Ruth', 'Kevin', 'Sharon', 'Brian', 'Michelle', 'George', 'Laura',
  'Timothy', 'Sarah', 'Ronald', 'Kimberly', 'Edward', 'Deborah', 'Jason', 'Jessica',
  'Jeffrey', 'Shirley', 'Ryan', 'Cynthia', 'Jacob', 'Angela', 'Gary', 'Melissa'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker'
]

const zipCodes = [
  '10001', '10002', '10003', '10004', '10005', // NYC
  '07102', '07103', '07104', '07105', '07106', // Newark
  '06101', '06102', '06103', '06104', '06105', // Hartford
  '02101', '02102', '02103', '02104', '02105', // Boston
  '19101', '19102', '19103', '19104', '19105', // Philadelphia
]

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Calculate 2025 CMS MTM eligibility
function calculateEligibility(member: {
  drugCostsYTD: number
  chronicDiseaseCount: number
  activePartDMeds: number
}): boolean {
  const COST_THRESHOLD = 1623 // 2025 threshold (reduced from $5,000+)
  const MIN_DISEASES = 3
  const MIN_MEDS = 8

  return (
    member.drugCostsYTD >= COST_THRESHOLD &&
    member.chronicDiseaseCount >= MIN_DISEASES &&
    member.activePartDMeds >= MIN_MEDS
  )
}

// Calculate priority score (0-100)
function calculatePriorityScore(
  needsCMR: boolean,
  openTips: number,
  adherencePDC: number,
  hasUrgentGap: boolean
): number {
  let score = 0

  // Needs CMR adds 40 points
  if (needsCMR) score += 40

  // Each open TIP adds 10 points (max 30)
  score += Math.min(openTips * 10, 30)

  // Low adherence adds up to 20 points
  if (adherencePDC < 75) score += 20
  else if (adherencePDC < 80) score += 10

  // Urgent gap (like IET window) adds 10 points
  if (hasUrgentGap) score += 10

  return Math.min(score, 100)
}

async function main() {
  console.log('Seeding database with MTM Analytics demo data...\n')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.claim.deleteMany()
  await prisma.factNotification.deleteMany()
  await prisma.factAdherence.deleteMany()
  await prisma.chronicDisease.deleteMany()
  await prisma.dimMember.deleteMany()
  await prisma.user.deleteMany()
  await prisma.dimClient.deleteMany()

  // Create chronic disease reference data
  console.log('Creating chronic disease reference data...')
  for (const disease of CORE_CHRONIC_DISEASES) {
    await prisma.chronicDisease.create({ data: disease })
  }
  console.log(`  Created ${CORE_CHRONIC_DISEASES.length} chronic disease codes`)

  // Create multiple contracts for realistic demo filtering
  console.log('\nCreating contracts...')
  const contracts = await Promise.all([
    prisma.dimClient.create({
      data: {
        name: 'Blue Shield Northeast',
        segment: 'Enterprise',
        region: 'Northeast',
        cmsContractNumber: 'H1234'
      }
    }),
    prisma.dimClient.create({
      data: {
        name: 'HealthFirst Midwest',
        segment: 'Mid-Market',
        region: 'Midwest',
        cmsContractNumber: 'H5678'
      }
    }),
    prisma.dimClient.create({
      data: {
        name: 'SunCare West',
        segment: 'Regional',
        region: 'West',
        cmsContractNumber: 'H9012'
      }
    })
  ])

  console.log('  Created 3 contracts:')
  contracts.forEach(c => console.log(`    - ${c.name} (${c.cmsContractNumber})`))

  // Use first contract as primary for backward compatibility
  const client = contracts[0]

  // Create demo users
  const password = await bcrypt.hash('demo123', 10)
  await prisma.user.createMany({
    data: [
      {
        email: 'analyst@acme.com',
        password,
        name: 'Maria Rodriguez',
        role: 'CLIENT_VIEWER',
        clientId: client.id
      },
      {
        email: 'exec@acme.com',
        password,
        name: 'David Chen',
        role: 'EXEC',
        clientId: client.id
      },
      {
        email: 'admin@acme.com',
        password,
        name: 'ACME Admin',
        role: 'CLIENT_ADMIN',
        clientId: client.id
      },
      {
        email: 'pharmacist@acme.com',
        password,
        name: 'Dr. Sarah Kim',
        role: 'PHARMACIST',
        clientId: client.id
      }
    ]
  })
  console.log('Created 4 demo users')

  // Create 500 members with MTM-relevant data distributed across contracts
  console.log('\nCreating 500 members with MTM data...')

  const members: Array<{
    id: string
    clientId: string
    drugCostsYTD: number
    chronicDiseaseCount: number
    activePartDMeds: number
    mtmEligible: boolean
    priorityScore: number
  }> = []

  for (let i = 0; i < 500; i++) {
    // Distribute members across contracts (50%, 30%, 20%)
    const contractIdx = i < 250 ? 0 : i < 400 ? 1 : 2
    const memberContract = contracts[contractIdx]

    const firstName = randomElement(firstNames)
    const lastName = randomElement(lastNames)
    const birthYear = randomInt(1940, 1965) // Medicare-age population
    const dob = new Date(birthYear, randomInt(0, 11), randomInt(1, 28))
    const age = new Date().getFullYear() - birthYear

    // Assign chronic diseases (realistic distribution)
    const numDiseases = randomInt(0, 6)
    const memberDiseases = [...CORE_CHRONIC_DISEASES]
      .sort(() => Math.random() - 0.5)
      .slice(0, numDiseases)
      .map(d => d.code)

    // Generate realistic drug costs (many will exceed $1,623 threshold)
    const drugCostsYTD = randomFloat(500, 8000)

    // Active Part D medications (correlated with disease count)
    const activePartDMeds = Math.max(numDiseases * 2 + randomInt(0, 4), randomInt(2, 6))

    // Calculate eligibility
    const mtmEligible = calculateEligibility({
      drugCostsYTD,
      chronicDiseaseCount: numDiseases,
      activePartDMeds
    })

    // Priority score (higher for eligible members with issues)
    const basePDC = randomFloat(55, 95)
    const needsCMR = mtmEligible && Math.random() > 0.4
    const openTips = mtmEligible ? randomInt(0, 3) : 0
    const priorityScore = calculatePriorityScore(needsCMR, openTips, basePDC, Math.random() > 0.9)

    const member = await prisma.dimMember.create({
      data: {
        clientId: memberContract.id,
        memberId: `MTM-${String(i + 1).padStart(5, '0')}`,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        age,
        dob,
        gender: Math.random() > 0.52 ? 'F' : 'M', // Slightly more female in Medicare pop
        zipCode: randomElement(zipCodes),
        riskBand: basePDC < 70 ? 'High' : basePDC < 80 ? 'Medium' : 'Low',
        planId: `PBP-${randomInt(1, 5)}`,
        primaryPharmacyId: `NCPDP-${randomInt(1000000, 9999999)}`,
        drugCostsYTD,
        chronicDiseaseCount: numDiseases,
        chronicDiseases: memberDiseases.join(','),
        activePartDMeds,
        mtmEligible,
        optOut: Math.random() < 0.02, // 2% opt-out rate
        priorityScore
      }
    })

    members.push({
      id: member.id,
      clientId: memberContract.id,
      drugCostsYTD,
      chronicDiseaseCount: numDiseases,
      activePartDMeds,
      mtmEligible,
      priorityScore
    })

    // Create adherence records for each relevant drug class
    const drugClasses = []
    if (memberDiseases.includes('DIABETES')) drugClasses.push('Diabetes')
    if (memberDiseases.includes('HYPERTENSION')) drugClasses.push('Hypertension')
    if (memberDiseases.includes('DYSLIPIDEMIA')) drugClasses.push('Statins')
    if (memberDiseases.includes('RESPIRATORY')) drugClasses.push('Respiratory')
    if (memberDiseases.includes('MENTAL_HEALTH')) drugClasses.push('Antidepressants')

    // If no specific diseases, assign random classes
    if (drugClasses.length === 0) {
      drugClasses.push(randomElement(['Diabetes', 'Hypertension', 'Statins']))
    }

    for (const drugClass of drugClasses) {
      const classPDC = basePDC + randomFloat(-10, 10) // Variation per class
      await prisma.factAdherence.create({
        data: {
          clientId: memberContract.id,
          memberId: member.id,
          drugClass,
          pdc90: Math.min(Math.max(classPDC, 40), 100),
          pdc180: Math.min(Math.max(classPDC + randomFloat(-5, 5), 40), 100),
          mpr90: Math.min(Math.max(classPDC + randomFloat(0, 10), 40), 100),
          asOfDate: new Date()
        }
      })
    }
  }

  const eligibleCount = members.filter(m => m.mtmEligible).length
  console.log(`  Created 500 members (${eligibleCount} MTM-eligible per 2025 CMS rules)`)

  // Create MTM Claims/Opportunities
  console.log('\nCreating MTM claims and opportunities...')

  const eligibleMembers = members.filter(m => m.mtmEligible)
  let totalClaims = 0
  let approvedClaims = 0
  let totalAimValue = 0

  for (const member of eligibleMembers) {
    // Each eligible member has 1-5 claims over the past year
    const numClaims = randomInt(1, 5)

    for (let c = 0; c < numClaims; c++) {
      const daysAgo = randomInt(0, 365)
      const serviceDate = new Date()
      serviceDate.setDate(serviceDate.getDate() - daysAgo)

      // Determine opportunity type (CMR or TIP)
      const opportunityType = Math.random() > 0.3 ? 'TIP' : 'CMR'

      // Determine result code (weighted distribution)
      const resultRoll = Math.random()
      let resultCode: number | null = null
      let status = 'Pending'

      if (daysAgo > 30) { // Older claims have outcomes
        if (resultRoll < 0.45) {
          resultCode = RESULT_CODES.SUCCESS_DTP
          status = 'Approved'
        } else if (resultRoll < 0.70) {
          resultCode = RESULT_CODES.SUCCESS_NO_DTP
          status = 'Approved'
        } else if (resultRoll < 0.85) {
          resultCode = RESULT_CODES.UNABLE_TO_REACH
          status = 'Review'
        } else {
          resultCode = RESULT_CODES.REFUSED
          status = 'Review'
        }
      }

      // AIM severity (higher for more complex cases)
      const severityLevel = resultCode === RESULT_CODES.SUCCESS_DTP
        ? randomInt(2, 6)
        : randomInt(1, 3)

      const aimDollarValue = status === 'Approved'
        ? AIM_VALUES[severityLevel] || 0
        : 0

      await prisma.claim.create({
        data: {
          claimId: `CLM-${String(totalClaims + 1).padStart(6, '0')}`,
          clientId: member.clientId,
          memberId: member.id,
          serviceDate,
          serviceCode: opportunityType === 'CMR' ? 99605 : 99606,
          opportunityType,
          resultCode,
          severityLevel,
          aimDollarValue,
          status,
          adherenceBarrier: resultCode === RESULT_CODES.REFUSED
            ? JSON.stringify({ reason: randomElement(['cost', 'transportation', 'distrust', 'feeling_fine']) })
            : null
        }
      })

      totalClaims++
      if (status === 'Approved') {
        approvedClaims++
        totalAimValue += aimDollarValue
      }
    }
  }

  console.log(`  Created ${totalClaims} claims (${approvedClaims} approved)`)
  console.log(`  Total AIM Cost Avoidance: $${totalAimValue.toLocaleString()}`)

  // Create notifications/alerts
  console.log('\nCreating alerts and notifications...')
  await prisma.factNotification.createMany({
    data: [
      {
        clientId: client.id,
        ruleKey: 'adherence_risk_spike',
        entityRef: 'Diabetes cohort - Northeast',
        message: 'Diabetes cohort adherence dropped to 72.3%, below 80% Star Ratings threshold',
        recommendedAction: 'Execute intervention playbook: 1) Pull at-risk member list (PDC <75%) 2) Schedule CMR consultations 3) Deploy automated refill reminders within 48 hours 4) Monitor weekly progress',
        severity: 'Critical',
        owner: 'Clinical Director',
        slaHours: 24,
        status: 'Active',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: client.id,
        ruleKey: 'mtm_eligibility_surge',
        entityRef: '2025 CMS Eligibility',
        message: `${eligibleCount} members now MTM-eligible under 2025 CMS rules ($1,623 threshold)`,
        recommendedAction: 'Prepare for volume increase: 1) Review staffing capacity 2) Update outreach scripts 3) Schedule proactive CMRs for newly eligible 4) Brief clinical team on expanded criteria',
        severity: 'High',
        owner: 'Operations Manager',
        slaHours: 72,
        status: 'Active',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: client.id,
        ruleKey: 'cmr_completion_gap',
        entityRef: 'Q4 CMR Performance',
        message: 'CMR completion rate at 67% - 13 points below 80% Star Ratings target',
        recommendedAction: 'Accelerate CMR outreach: 1) Prioritize high-risk members (priority score >70) 2) Deploy rapid response team 3) Offer telephonic and in-person options 4) Track daily completion rates',
        severity: 'High',
        owner: 'Quality Manager',
        slaHours: 48,
        status: 'Active',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: client.id,
        ruleKey: 'refusal_rate_high',
        entityRef: 'MTM Refusal Analysis',
        message: 'Patient refusal rate at 15.2% - above 10% benchmark',
        recommendedAction: 'Analyze refusal patterns: 1) Review barrier data by ZIP code 2) Identify top refusal reasons 3) Develop targeted messaging 4) Consider incentive programs for hard-to-reach populations',
        severity: 'Medium',
        owner: 'Care Team Manager',
        slaHours: 120,
        status: 'Active',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: client.id,
        ruleKey: 'aim_roi_milestone',
        entityRef: 'Cost Avoidance Performance',
        message: `AIM cost avoidance reached $${Math.round(totalAimValue / 1000)}K - on track for annual target`,
        recommendedAction: 'Maintain momentum: 1) Continue high-severity interventions 2) Document case studies for level 5-6 interventions 3) Share ROI report with leadership 4) Identify additional optimization opportunities',
        severity: 'Low',
        owner: 'Analytics Team',
        slaHours: 168,
        status: 'Active',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        clientId: client.id,
        ruleKey: 'statin_adherence_recovery',
        entityRef: 'Statins cohort improvement',
        message: 'Statins adherence improved from 74% to 82% following intervention',
        recommendedAction: 'Document success: 1) Capture intervention details 2) Update playbook with learnings 3) Apply similar approach to Diabetes cohort 4) Report to CMS quality team',
        severity: 'Low',
        owner: 'Clinical Director',
        slaHours: 168,
        status: 'Resolved',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        acknowledgedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]
  })
  console.log('  Created 6 sample notifications')

  // Summary
  const adherenceStats = await prisma.factAdherence.aggregate({
    _avg: { pdc90: true },
    _count: true
  })

  console.log('\n' + '='.repeat(60))
  console.log('DATABASE SEEDING COMPLETE')
  console.log('='.repeat(60))
  console.log('\nDemo Credentials:')
  console.log('  analyst@acme.com / demo123 (Analyst)')
  console.log('  exec@acme.com / demo123 (Executive)')
  console.log('  pharmacist@acme.com / demo123 (Pharmacist)')
  console.log('  admin@acme.com / demo123 (Admin)')
  console.log('\nDatabase Summary:')
  console.log(`  - 3 contracts: Blue Shield Northeast (H1234), HealthFirst Midwest (H5678), SunCare West (H9012)`)
  console.log(`  - 4 users with different roles`)
  console.log(`  - 500 members (${eligibleCount} MTM-eligible)`)
  console.log(`  - ${adherenceStats._count} adherence records`)
  console.log(`  - ${totalClaims} MTM claims (${approvedClaims} approved)`)
  console.log(`  - $${totalAimValue.toLocaleString()} total AIM cost avoidance`)
  console.log(`  - 6 notifications/alerts`)
  console.log(`  - 10 chronic disease reference codes`)
  console.log('\n2025 CMS Eligibility Criteria Applied:')
  console.log('  - Cost threshold: $1,623 (reduced from $5,000+)')
  console.log('  - Chronic diseases: 3+ of 10 core conditions')
  console.log('  - Part D medications: 8+ active')
  console.log('  - HIV/AIDS added to core conditions')
  console.log('='.repeat(60))
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
