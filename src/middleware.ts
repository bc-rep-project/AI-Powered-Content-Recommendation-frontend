import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token');
    const isAuthPage = request.nextUrl.pathname === '/auth/google/callback';
    const isApiRequest = request.nextUrl.pathname.startsWith('/api');

    // Allow API requests and auth callback to pass through
    if (isApiRequest || isAuthPage) {
        return NextResponse.next();
    }

    // If not authenticated, redirect to Google auth
    if (!token) {
        const googleAuthUrl = 'https://ai-recommendation-api.onrender.com/api/v1/auth/google';
        return NextResponse.redirect(googleAuthUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}; 