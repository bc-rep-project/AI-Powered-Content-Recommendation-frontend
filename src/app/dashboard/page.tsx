'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Handle OAuth callback parameters
    const access_token = searchParams.get('access_token');
    const user = searchParams.get('user');
    
    if (access_token) {
      // Store the token and user info
      localStorage.setItem('auth_token', access_token);
      if (user) {
        localStorage.setItem('user', JSON.stringify({ email: user }));
      }
      
      // Clean up URL parameters
      router.replace('/dashboard');
    } else if (!localStorage.getItem('auth_token')) {
      // Redirect to login if no token
      router.replace('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {/* Add your dashboard content here */}
        </div>
      </div>
    </div>
  );
} 