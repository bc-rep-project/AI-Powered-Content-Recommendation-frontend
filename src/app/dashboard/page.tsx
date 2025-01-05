import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { RecommendationFilter, RecommendationGrid } from '@/features/recommendations';
import { useRecommendations } from '@/features/recommendations/hooks/useRecommendations';
import { useState } from 'react';
import { RecommendationFilter as FilterType } from '@/features/recommendations/types';

export default function DashboardPage() {
  const { recommendations, isLoading, error } = useRecommendations();
  const [filter, setFilter] = useState<FilterType>({});

  const handleLearnMore = (id: string) => {
    // Handle navigation or modal open
  };

  return (
    <ErrorBoundary>
      <div className="container pb-16 pt-4">
        <RecommendationFilter 
          filter={filter}
          onFilterChange={setFilter}
        />
        <RecommendationGrid 
          recommendations={recommendations}
          onLearnMore={handleLearnMore}
        />
        <MobileNavigation />
            </div>
    </ErrorBoundary>
  );
}