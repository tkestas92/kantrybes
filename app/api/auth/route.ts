import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createToken, verifyToken } from '@/lib/auth'
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit'

export async function GET() {
  const token = cookies().get('admin_token')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Per daug bandymų. Bandyk vėl po ${Math.ceil((rateLimit.retryAfterSeconds || 0) / 60)} min.` },
      { status: 429 }
    )
  }

  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  resetRateLimit(ip)
  const token = createToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}
