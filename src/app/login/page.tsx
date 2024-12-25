'use client';

import { useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api.config';

export default function LoginPage() {
  useEffect(() => {
    window.location.href = `${API_ENDPOINTS.googleAuth}`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to Google Sign In...</p>
      </div>
    </div>
  );
} 