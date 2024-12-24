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
        pathname === '/' ||             // Root path (handled by page.tsx)
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif)$/) // Static files
    ) {
        return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get('auth_token');
    
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/about'];
    if (publicRoutes.includes(pathname)) {
        // If user is authenticated and tries to access public routes, redirect to dashboard
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protected routes - redirect to login if no token
    if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
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