import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (token) {
    redirect('/dashboard');
  }

  // For unauthenticated users, show a landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI-Powered Content Recommendations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover content tailored just for you through our advanced AI recommendation engine.
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/about"
              className="inline-block bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 