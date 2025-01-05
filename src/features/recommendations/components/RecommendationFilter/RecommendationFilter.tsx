import { FiFilter } from 'react-icons/fi';
import { RecommendationFilter as FilterType } from '../../types';

interface RecommendationFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const RecommendationFilter = ({ filter, onFilterChange }: RecommendationFilterProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-dark-bg p-3 mb-4 
                    flex items-center justify-between border-b dark:border-dark-border sm:hidden">
      <button className="btn-secondary flex items-center gap-2 text-sm">
        <FiFilter className="w-4 h-4" />
        Filter
      </button>
      <select 
        value={filter.category}
        onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        className="input-field max-w-[150px] text-sm"
      >
        <option value="">All Categories</option>
        <option value="ai">AI & ML</option>
        <option value="web">Web Dev</option>
        <option value="data">Data Science</option>
      </select>
    </div>
  );
}; 