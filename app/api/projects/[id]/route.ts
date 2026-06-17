import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { updateProject, deleteProject } from '@/lib/db'

function isAuth(): boolean {
  const token = cookies().get('admin_token')?.value
  return token ? verifyToken(token) : false
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const project = await updateProject(Number(params.id), body)
    return NextResponse.json(project)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await deleteProject(Number(params.id))
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
