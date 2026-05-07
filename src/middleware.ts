import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin/giris')) return NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const session = req.cookies.get('admin_session')?.value
    const expected = process.env.ADMIN_SESSION_SECRET
    if (!expected || session !== expected) {
      return NextResponse.redirect(new URL('/admin/giris', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
