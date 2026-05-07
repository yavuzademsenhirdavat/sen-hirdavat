import { NextRequest, NextResponse } from 'next/server'

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const session = req.cookies.get('admin_session')?.value
  const expected = process.env.ADMIN_SESSION_SECRET
  if (!expected || session !== expected) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }
  return null
}
