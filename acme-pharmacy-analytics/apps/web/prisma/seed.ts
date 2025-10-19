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

  for (let i = 0; i < 100; i++) {
    const member = await prisma.dimMember.create({
      data: {
        clientId: client.id,
        dob: new Date(1950 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), 1),
        gender: Math.random() > 0.5 ? 'M' : 'F',
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
        severity: 'High',
        owner: 'CLIENT_ADMIN',
        slaHours: 48,
        status: 'open',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)  // 2 days ago
      },
      {
        clientId: client.id,
        ruleKey: 'gap_closure_backlog',
        entityRef: 'Open gaps >30 days',
        severity: 'Medium',
        owner: 'CLIENT_ADMIN',
        slaHours: 120,
        status: 'open',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)  // 5 days ago
      },
      {
        clientId: client.id,
        ruleKey: 'cmr_completion_lag',
        entityRef: 'Q4 CMR completion',
        severity: 'Medium',
        owner: 'CLIENT_ADMIN',
        slaHours: 72,
        status: 'triaged',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        acknowledgedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
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
