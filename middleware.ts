import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get user from localStorage equivalent in middleware (we'll use cookies)
  const userCookie = request.cookies.get('connect.sid'); // Session cookie
  
  // Public routes that don't need authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/'];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // If no session and trying to access protected route, redirect to login
  if (!userCookie && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Role-based route protection
  // Admin routes
  if (pathname.startsWith('/Admin')) {
    // We'll verify role on the client side with API call
    // This middleware just ensures session exists
    if (!userCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Coach routes
  if (pathname.startsWith('/Coach')) {
    if (!userCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // User routes
  if (pathname.startsWith('/Users')) {
    if (!userCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};