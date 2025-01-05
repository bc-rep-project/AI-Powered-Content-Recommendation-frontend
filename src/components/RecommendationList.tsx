import { Recommendation } from '@/types'
import { useState } from 'react'
import { FiStar, FiFilter, FiChevronRight } from 'react-icons/fi'

interface RecommendationListProps {
  recommendations: Recommendation[]
}

export const RecommendationList = ({ recommendations }: RecommendationListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  return (
    <div className="container pb-16 pt-4">
      {/* Mobile Filter Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-bg p-3 mb-4 flex items-center justify-between border-b dark:border-dark-border sm:hidden">
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <FiFilter className="w-4 h-4" />
          Filter
        </button>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field max-w-[150px] text-sm"
        >
          <option value="all">All Categories</option>
          <option value="ai">AI & ML</option>
          <option value="web">Web Dev</option>
          <option value="data">Data Science</option>
        </select>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <div 
            key={rec.id} 
            className="card flex flex-col hover:shadow-lg transition-shadow duration-200"
          >
            {rec.imageUrl && (
              <img 
                src={rec.imageUrl} 
                alt={rec.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg">{rec.title}</h3>
                <span className="flex items-center text-yellow-500">
                  <FiStar className="w-4 h-4" />
                  {rec.rating || '—'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                {rec.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 
                               text-primary-800 dark:text-primary-200 rounded-full">
                  {rec.category}
                </span>
                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 
                                 dark:hover:text-primary-300 flex items-center gap-1 text-sm">
                  Learn more
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="flex flex-col items-center text-xs p-2">
          <span className="text-primary-600">Home</span>
        </button>
        <button className="flex flex-col items-center text-xs p-2">
          <span>Explore</span>
        </button>
        <button className="flex flex-col items-center text-xs p-2">
          <span>Saved</span>
        </button>
        <button className="flex flex-col items-center text-xs p-2">
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
} 