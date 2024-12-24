import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for token in cookies
    const token = request.cookies.get('auth_token')?.value;
                 
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        response.headers.set('Access-Control-Allow-Origin', 'https://ai-powered-content-recommendation-frontend.vercel.app');
        response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        response.headers.set('Access-Control-Allow-Headers', '*');
        response.headers.set('Access-Control-Max-Age', '86400');
        return response;
    }

    // For API routes, just add CORS headers
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', 'https://ai-powered-content-recommendation-frontend.vercel.app');
        response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        response.headers.set('Access-Control-Allow-Headers', '*');
        return response;
    }

    // Handle authentication redirects
    if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/dashboard/:path*',
        '/login',
        '/register'
    ]
}; 