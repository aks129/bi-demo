import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'GeneDemo'
const AUTH_COOKIE_NAME = 'acme-demo-auth'
const AUTH_COOKIE_VALUE = 'authenticated'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === DEMO_PASSWORD) {
      const cookieStore = await cookies()

      // Set authentication cookie (expires in 7 days)
      cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
