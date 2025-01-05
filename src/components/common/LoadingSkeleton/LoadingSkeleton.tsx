interface LoadingSkeletonProps {
  count?: number;
  className?: string;
  height?: string;
}

export const LoadingSkeleton = ({ count = 1, className = '', height = 'h-40' }: LoadingSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className={`${height} bg-gray-200 dark:bg-gray-700 rounded-t-lg`} />
          <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}; 