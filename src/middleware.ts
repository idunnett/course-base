import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/signin', '/auth/signup']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.endsWith('.map') ||
    pathname === '/favicon.ico'
  )
    return NextResponse.next()

  if (request.cookies.has('next-auth.session-token')) return NextResponse.next()

  if (!publicPaths.includes(request.nextUrl.pathname)) {
    console.log(`${request.nextUrl.pathname} redirect`)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  console.log(`${request.nextUrl.pathname} don't redirect`)
  return NextResponse.next()
}
