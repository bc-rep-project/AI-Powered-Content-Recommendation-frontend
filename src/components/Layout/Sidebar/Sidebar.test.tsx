import { render, screen } from '@/utils/test-utils'
import { Sidebar } from './Sidebar'
import { usePathname } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn()
}))

describe('Sidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard')
  })

  it('renders all navigation items', () => {
    render(<Sidebar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Explore')).toBeInTheDocument()
    expect(screen.getByText('Saved Items')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    render(<Sidebar />)

    const activeLink = screen.getByText('Dashboard').closest('a')
    expect(activeLink).toHaveClass('bg-primary-50')
  })

  it('renders theme toggle', () => {
    render(<Sidebar />)
    expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<Sidebar />)
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
}) 