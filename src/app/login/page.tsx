'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api.config';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) {
      window.location.href = API_ENDPOINTS.googleAuth;
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {error ? (
          <div className="text-center">
            <div className="text-red-600 mb-4">
              {error === 'auth_failed' && 'Authentication failed. Please try again.'}
              {error === 'no_code' && 'Invalid authentication response. Please try again.'}
              {error === 'access_denied' && 'Access was denied. Please try again.'}
              {!['auth_failed', 'no_code', 'access_denied'].includes(error) && 'An error occurred. Please try again.'}
            </div>
            <button
              onClick={() => window.location.href = API_ENDPOINTS.googleAuth}
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