import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

// Skip both auth and localization for these paths
const SKIP_PATHS = [
  '/_next',
  '/api/auth',
  '/assets',
  '/favicon.ico',
  '/sw.js',
  '/site.webmanifest',
  '/icon',
  '/chrome'
]

function shouldSkip(pathname: string) {
  return SKIP_PATHS.some(path => pathname.startsWith(path))
}

async function handleLocalization(request: NextRequest) {
  // Skip localization if path should be skipped
  if (shouldSkip(request.nextUrl.pathname)) {
    return null
  }

  let lng: string | undefined | null
  if (request.cookies.has(cookieName)) {
    lng = acceptLanguage.get(request.cookies.get(cookieName)?.value)
  }
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // Skip redirect for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return null
  }

  // Redirect if lng in path is not supported
  if (!languages.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`))) {
    const originalPath = request.nextUrl.pathname
    const searchParams = request.nextUrl.search
    
    return NextResponse.redirect(
      new URL(`/${lng}${originalPath}${searchParams}`, request.url)
    )
  }

  const response = NextResponse.next()

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
  }

  return response
}

export async function middleware(request: NextRequest) {
  // Skip middleware completely for certain paths
  if (shouldSkip(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Then handle localization
  const localizationResponse = await handleLocalization(request)
  if (localizationResponse) {
    return localizationResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
}