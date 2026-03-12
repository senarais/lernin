import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/auth/callback']

export function middleware(request: NextRequest) {
  // const { nextUrl, cookies } = request
  
  // // Get the token from cookies
  // const token = cookies.get('access_token')

  // // 1. Check if the current route is one of the public routes
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // // 2. If logged in and trying to access login/register, redirect to home
  // if (token && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  // // 3. Allow public routes and static assets
  // if (
  //   isPublicRoute ||
  //   nextUrl.pathname.startsWith('/public') ||
  //   nextUrl.pathname.includes('.')
  // ) {
  //   return NextResponse.next()
  // }

  // // 4. For all other routes, check for the access_token cookie
  // if (!token) {
  //   // Redirect to login if token is missing
  //   const loginUrl = new URL('/login', request.url)
  //   // Optional: add a redirect parameter to return here after login
  //   // loginUrl.searchParams.set('redirect', nextUrl.pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  // return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
