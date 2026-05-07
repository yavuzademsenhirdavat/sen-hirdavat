import { NextRequest, NextResponse } from 'next/server'

const attempts = new Map<string, { count: number; lockedUntil: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000
const CLEANUP_MS = 60 * 60 * 1000 // 1 saat sonra girişleri temizle

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(forwarded) ? forwarded : 'unknown'
}

function cleanup() {
  const cutoff = Date.now() - CLEANUP_MS
  for (const [ip, entry] of attempts) {
    if (entry.lockedUntil < cutoff) attempts.delete(ip)
  }
}

export async function POST(req: NextRequest) {
  cleanup()

  const ip = getClientIp(req)
  const now = Date.now()
  const entry = attempts.get(ip)

  if (entry !== undefined && entry.lockedUntil > now) {
    const remaining = Math.ceil((entry.lockedUntil - now) / 60000)
    return NextResponse.json(
      { error: `Çok fazla deneme. ${remaining} dakika sonra tekrar deneyin.` },
      { status: 429 }
    )
  }

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  if (body.password !== process.env.ADMIN_PASSWORD) {
    const prevCount = entry?.count ?? 0
    const newCount = prevCount + 1
    attempts.set(ip, {
      count: newCount,
      lockedUntil: newCount >= MAX_ATTEMPTS ? now + LOCK_MS : 0,
    })
    return NextResponse.json({ error: 'Şifre yanlış' }, { status: 401 })
  }

  attempts.delete(ip)

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
