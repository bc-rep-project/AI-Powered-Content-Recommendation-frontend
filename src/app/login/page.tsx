'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api.config';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const detail = searchParams.get('detail');

  useEffect(() => {
    if (!error && !detail) {
      // Add frontend URL as a query parameter
      const authUrl = new URL(API_ENDPOINTS.googleAuth);
      authUrl.searchParams.set('redirect_uri', `${window.location.origin}/dashboard`);
      window.location.href = authUrl.toString();
    }
  }, [error, detail]);

  const getErrorMessage = () => {
    if (detail) {
      if (detail.includes('OAuth callback failed')) {
        return 'Authentication server is temporarily unavailable. Our team has been notified.';
      }
      return 'Authentication server error. Please try again later.';
    }
    
    switch (error) {
      case 'auth_failed':
        return 'Authentication failed. Please try again.';
      case 'no_code':
        return 'Invalid authentication response. Please try again.';
      case 'access_denied':
        return 'Access was denied. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {(error || detail) ? (
          <div className="text-center">
            <div className="text-red-600 mb-4">
              {getErrorMessage()}
            </div>
            {detail && (
              <div className="text-sm text-gray-500 mb-4">
                Please try again in a few minutes. If the problem persists, contact support.
              </div>
            )}
            <button
              onClick={() => {
                const authUrl = new URL(API_ENDPOINTS.googleAuth);
                authUrl.searchParams.set('redirect_uri', `${window.location.origin}/dashboard`);
                window.location.href = authUrl.toString();
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again with Google
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we redirect you to Google Sign In
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 