import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Exact match — path traversal'a karşı startsWith yerine === veya /giris/ prefix'i
  const isLoginPage = pathname === '/admin/giris' || pathname.startsWith('/admin/giris/')
  if (isLoginPage) return NextResponse.next()

  const isAdminUi = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminUi || isAdminApi) {
    const expected = process.env.ADMIN_SESSION_SECRET
    if (!expected) {
      // Env yüklenememiş — tüm admin erişimini reddet
      if (isAdminApi) return NextResponse.json({ error: 'Servis kullanılamıyor' }, { status: 503 })
      return NextResponse.redirect(new URL('/admin/giris', req.url))
    }

    const session = req.cookies.get('admin_session')?.value
    if (session !== expected) {
      if (isAdminApi) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/giris', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
