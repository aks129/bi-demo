import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  const directUrl = process.env.DIRECT_URL

  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 15) + '...' : 'not set',
    hasDirectUrl: !!directUrl,
    directUrlPrefix: directUrl ? directUrl.substring(0, 15) + '...' : 'not set',
    nodeEnv: process.env.NODE_ENV
  })
}
