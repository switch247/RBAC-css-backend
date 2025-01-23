import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/auth'; // Utility to verify token expiration

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  const token = request.cookies.get('token')?.value;

  // Redirect unauthenticated users
  if (!user && (
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/users')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check token validity
  if (token) {
    const isTokenValid = verifyToken(token); // Verify token expiration
    if (!isTokenValid) {
      // Redirect to login if the token is expired
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } else {
    console.log('Token not set');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Add the token to the request headers
  const requestHeaders = new Headers(request.headers);
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  // Redirect unverified users
  if (user) {
    const userData = JSON.parse(user);
    if (!userData.isVerified) {
      return NextResponse.redirect(new URL('/auth/verify', request.url));
    }

    // Redirect users with role 'USER' from /users
    if (request.nextUrl.pathname === '/users' && userData.role === 'USER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Pass the modified headers to the next middleware or route
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/profile', '/users', '/'],
};