import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { reorderProjects } from '@/lib/db'

function isAuth(): boolean {
  const token = cookies().get('admin_token')?.value
  return token ? verifyToken(token) : false
}

export async function PUT(req: NextRequest) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { ids } = await req.json()
    if (
      !Array.isArray(ids) || ids.length === 0 || ids.length > 200 ||
      !ids.every((n: unknown) => Number.isInteger(n)) ||
      new Set(ids).size !== ids.length
    ) {
      return NextResponse.json({ error: 'Invalid ids' }, { status: 400 })
    }
    await reorderProjects(ids)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
