import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip locale middleware for app routes (use localStorage-based locale)
  if (
    pathname.startsWith('/app') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')
  ) {
    return
  }

  // Apply next-intl middleware for marketing routes
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
