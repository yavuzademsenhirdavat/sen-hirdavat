import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Şifre yanlış' }, { status: 401 })
  }

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: '/',
  })
  return res
}
