import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api.config';

export async function GET() {
  return NextResponse.redirect(API_ENDPOINTS.googleAuth);
} 