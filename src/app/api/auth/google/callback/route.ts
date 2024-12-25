import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api.config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/login?error=' + error, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens with our backend
    const response = await fetch(API_ENDPOINTS.googleCallback, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();
    
    // Create response with redirect
    const redirectUrl = new URL('/dashboard', request.url);
    const res = NextResponse.redirect(redirectUrl);

    // Set auth token cookie
    res.cookies.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return res;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
} 