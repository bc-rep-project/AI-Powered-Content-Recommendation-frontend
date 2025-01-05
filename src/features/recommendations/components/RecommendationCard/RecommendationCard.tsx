import { Recommendation } from '../../types';
import { FiStar, FiChevronRight } from 'react-icons/fi';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onLearnMore: (id: string) => void;
}

export const RecommendationCard = ({ recommendation, onLearnMore }: RecommendationCardProps) => {
  return (
    <div className="card flex flex-col hover:shadow-lg transition-shadow duration-200">
      {recommendation.imageUrl && (
        <img 
          src={recommendation.imageUrl} 
          alt={recommendation.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{recommendation.title}</h3>
          <span className="flex items-center text-yellow-500">
            <FiStar className="w-4 h-4" />
            {recommendation.rating || '—'}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
          {recommendation.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 
                         text-primary-800 dark:text-primary-200 rounded-full">
            {recommendation.category}
          </span>
          <button 
            onClick={() => onLearnMore(recommendation.id)}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 
                     dark:hover:text-primary-300 flex items-center gap-1 text-sm"
          >
            Learn more
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 