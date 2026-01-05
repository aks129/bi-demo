import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'acme-demo-auth'

export async function POST() {
  const cookieStore = await cookies()

  // Clear the authentication cookie
  cookieStore.delete(AUTH_COOKIE_NAME)

  return NextResponse.json({ success: true })
}
