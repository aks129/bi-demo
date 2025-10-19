import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.factNotification.deleteMany()
  await prisma.factAdherence.deleteMany()
  await prisma.dimMember.deleteMany()
  await prisma.user.deleteMany()
  await prisma.dimClient.deleteMany()

  // Create ACME Pharmacy client
  const client = await prisma.dimClient.create({
    data: {
      name: 'ACME Pharmacy',
      segment: 'Mid-Market',
      region: 'Northeast'
    }
  })

  console.log('✓ Created client:', client.name)

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
      }
    ]
  })

  console.log('✓ Created 3 users')

  // Create 100 members with adherence data
  console.log('Creating 100 members with adherence data...')

  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Mary', 'William', 'Patricia', 'James', 'Jennifer', 'David', 'Linda', 'Richard', 'Barbara', 'Joseph', 'Elizabeth']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas']

  for (let i = 0; i < 100; i++) {
    const birthYear = 1950 + Math.floor(Math.random() * 30)
    const dob = new Date(birthYear, Math.floor(Math.random() * 12), 1)
    const age = new Date().getFullYear() - birthYear

    const member = await prisma.dimMember.create({
      data: {
        clientId: client.id,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        age,
        dob,
        gender: Math.random() > 0.5 ? 'M' : 'F',
        zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
        riskBand: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        planId: 'plan-' + (Math.floor(Math.random() * 3) + 1)
      }
    })

    // Create adherence records for each drug class
    for (const drugClass of ['Diabetes', 'Hypertension', 'Statins']) {
      const basePDC = 60 + Math.random() * 35  // PDC between 60-95%

      await prisma.factAdherence.create({
        data: {
          clientId: client.id,
          memberId: member.id,
          drugClass,
          pdc90: basePDC,
          pdc180: basePDC + (Math.random() * 10 - 5),  // Slight variation
          mpr90: basePDC + (Math.random() * 15 - 5),   // MPR can be higher
          asOfDate: new Date()
        }
      })
    }
  }

  console.log('✓ Created 100 members and 300 adherence records')

  // Create sample notifications
  await prisma.factNotification.createMany({
    data: [
      {
        clientId: client.id,
        ruleKey: 'adherence_risk_spike',
        entityRef: 'Diabetes cohort - Plan 1',
        message: 'Diabetes cohort adherence dropped below 75% threshold',
        recommendedAction: 'Deploy targeted outreach campaign: 1) Identify at-risk members 2) Schedule CMR consultations 3) Send automated refill reminders within 48 hours',
        severity: 'High',
        owner: 'Care Team Manager',
        slaHours: 48,
        status: 'Active',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)  // 2 days ago
      },
      {
        clientId: client.id,
        ruleKey: 'gap_closure_backlog',
        entityRef: 'Open gaps >30 days',
        message: '87 care gaps have been open for more than 30 days',
        recommendedAction: 'Prioritize gap closure: 1) Review backlog by severity 2) Assign to pharmacists 3) Contact members for intervention 4) Update documentation',
        severity: 'Medium',
        owner: 'Quality Manager',
        slaHours: 120,
        status: 'Active',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)  // 5 days ago
      },
      {
        clientId: client.id,
        ruleKey: 'cmr_completion_lag',
        entityRef: 'Q4 CMR completion',
        message: 'CMR completion rate at 62% - below 80% target for Star Ratings',
        recommendedAction: 'Accelerate CMR outreach: 1) Pull list of eligible members 2) Schedule remaining CMRs 3) Deploy rapid response team 4) Track daily progress',
        severity: 'High',
        owner: 'Clinical Director',
        slaHours: 72,
        status: 'Resolved',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        acknowledgedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]
  })

  console.log('✓ Created 3 sample notifications')

  console.log('\n✅ Seeding complete!')
  console.log('\nDemo Credentials:')
  console.log('  analyst@acme.com / demo123 (CLIENT_VIEWER)')
  console.log('  exec@acme.com / demo123 (EXEC)')
  console.log('  admin@acme.com / demo123 (CLIENT_ADMIN)')
  console.log('\nDatabase summary:')
  console.log('  - 1 client (ACME Pharmacy)')
  console.log('  - 3 users with different roles')
  console.log('  - 100 members')
  console.log('  - 300 adherence records (100 members × 3 drug classes)')
  console.log('  - 3 notifications')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
