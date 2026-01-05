import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

function createPrismaClient(): PrismaClient | null {
  // Check if DATABASE_URL is set and valid
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl || (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://'))) {
    console.warn('DATABASE_URL not set or invalid, Prisma client will not be initialized')
    return null
  }

  try {
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error)
    return null
  }
}

const prismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (prismaClient && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient
}

// Export the client (may be null if initialization failed)
export const prisma = prismaClient as PrismaClient
