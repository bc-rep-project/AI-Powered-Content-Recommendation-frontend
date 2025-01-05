import { render, screen } from '@/utils/test-utils'
import { LoadingSkeleton } from './LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders correct number of skeleton items', () => {
    render(<LoadingSkeleton count={3} />)
    const skeletonItems = screen.getAllByRole('generic').filter(
      item => item.classList.contains('animate-pulse')
    )
    expect(skeletonItems).toHaveLength(3)
  })

  it('applies custom height class correctly', () => {
    render(<LoadingSkeleton height="h-20" />)
    const skeletonItem = screen.getByRole('generic', { name: '' })
    expect(skeletonItem.firstChild).toHaveClass('h-20')
  })

  it('applies dark mode styles correctly', () => {
    render(<LoadingSkeleton />, { initialTheme: 'dark' })
    const skeletonItems = screen.getAllByRole('generic').filter(
      item => item.classList.contains('dark:bg-gray-700')
    )
    expect(skeletonItems.length).toBeGreaterThan(0)
  })
}) 