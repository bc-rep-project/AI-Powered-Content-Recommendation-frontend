export default function Home() {
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
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 