import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the pathname
    const pathname = request.nextUrl.pathname;

    // Skip middleware for these paths
    if (
        pathname.startsWith('/_next') || // Next.js system paths
        pathname.startsWith('/api') ||   // API routes
        pathname.startsWith('/auth') ||  // Auth routes
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif)$/) // Static files
    ) {
        return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get('auth_token');
    
    // If no token and not already on login page, redirect to login
    if (!token && pathname !== '/login') {
        const url = new URL('/login', request.url);
        return NextResponse.redirect(url);
    }

    // If has token and on login page, redirect to dashboard
    if (token && pathname === '/login') {
        const url = new URL('/dashboard', request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api/ routes
         * 2. /_next/ (Next.js internals)
         * 3. /auth/ (auth routes)
         * 4. /static (public files)
         * 5. all root files like favicon.ico, robots.txt, etc.
         */
        '/((?!api|_next|auth|static|.*\\.[\\w]+$).*)',
    ],
}; 