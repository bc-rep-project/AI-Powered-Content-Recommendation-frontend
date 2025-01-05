import { render, screen, fireEvent } from '@/utils/test-utils'
import { RecommendationCard } from './RecommendationCard'

const mockRecommendation = {
  id: '1',
  title: 'Introduction to AI',
  description: 'Learn the basics of Artificial Intelligence',
  category: 'AI & ML',
  imageUrl: 'https://example.com/image.jpg',
  rating: 4.5,
  tags: ['ai', 'beginner'],
  createdAt: '2024-03-19T12:00:00Z'
}

describe('RecommendationCard', () => {
  it('renders all recommendation information correctly', () => {
    const handleLearnMore = jest.fn()
    render(
      <RecommendationCard 
        recommendation={mockRecommendation}
        onLearnMore={handleLearnMore}
      />
    )

    expect(screen.getByText(mockRecommendation.title)).toBeInTheDocument()
    expect(screen.getByText(mockRecommendation.description)).toBeInTheDocument()
    expect(screen.getByText(mockRecommendation.category)).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', mockRecommendation.imageUrl)
  })

  it('handles missing image gracefully', () => {
    const handleLearnMore = jest.fn()
    const recommendationWithoutImage = { ...mockRecommendation, imageUrl: undefined }
    
    render(
      <RecommendationCard 
        recommendation={recommendationWithoutImage}
        onLearnMore={handleLearnMore}
      />
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('calls onLearnMore with correct id when clicking learn more', () => {
    const handleLearnMore = jest.fn()
    render(
      <RecommendationCard 
        recommendation={mockRecommendation}
        onLearnMore={handleLearnMore}
      />
    )

    fireEvent.click(screen.getByText('Learn more'))
    expect(handleLearnMore).toHaveBeenCalledWith(mockRecommendation.id)
  })

  it('applies dark mode styles correctly', () => {
    const handleLearnMore = jest.fn()
    render(
      <RecommendationCard 
        recommendation={mockRecommendation}
        onLearnMore={handleLearnMore}
      />,
      { initialTheme: 'dark' }
    )

    const card = screen.getByText(mockRecommendation.title).closest('.card')
    expect(card).toHaveClass('dark:bg-dark-card')
  })
}) 