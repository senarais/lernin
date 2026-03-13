import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Daftar route yang BEBAS diakses siapa saja
const publicRoutes = ['/', '/login', '/register', '/auth/callback']

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request
  
  // 1. Ambil token dari cookies
  const token = cookies.get('access_token')

  // 2. BYPASS UNTUK ASSET/GAMBAR: 
  // Jika path ada titiknya (contoh: .png, .svg, .jpg), biarkan lewat!
  if (nextUrl.pathname.includes('.')) {
    return NextResponse.next()
  }

  // 3. Cek apakah route saat ini persis ada di dalam array publicRoutes
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // 4. LOGIC UTAMA:
  // Jika mencoba akses route SELAIN public routes (seperti /course, /admin)
  // DAN user belum punya token (belum login), tendang ke /login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Lolos filter, biarkan render halamannya
  return NextResponse.next()
}

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