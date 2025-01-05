import { Recommendation } from '../../types';
import { RecommendationCard } from '../RecommendationCard/RecommendationCard';

interface RecommendationGridProps {
  recommendations: Recommendation[];
  onLearnMore: (id: string) => void;
}

export const RecommendationGrid = ({ recommendations, onLearnMore }: RecommendationGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onLearnMore={onLearnMore}
        />
      ))}
    </div>
  );
}; 