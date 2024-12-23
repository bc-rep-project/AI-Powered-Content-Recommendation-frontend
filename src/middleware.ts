import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for token in both cookie and localStorage
    const token = request.cookies.get('auth_token')?.value || 
                 (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
                 
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register');

    // Add CORS headers to all responses
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', 'https://ai-powered-content-recommendation-frontend.vercel.app');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (!token && !isAuthPage) {
        // Redirect to login if accessing protected route without token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        // Redirect to dashboard if accessing auth pages while logged in
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/api/:path*',
        '/dashboard/:path*',
        '/login',
        '/register'
    ]
}; 