import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading content...</h2>
        <p className="mt-2 text-gray-500">Please wait while we prepare your personalized recommendations.</p>
      </div>
    </div>
  );
} 