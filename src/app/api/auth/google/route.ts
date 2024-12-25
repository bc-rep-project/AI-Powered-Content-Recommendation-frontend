import { NextResponse } from 'next/server';
import { API_ENDPOINTS, FRONTEND_URL } from '@/config/api.config';

export async function GET() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: API_ENDPOINTS.frontendGoogleCallback,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return NextResponse.redirect(`${GOOGLE_OAUTH_URL}?${params.toString()}`);
} 