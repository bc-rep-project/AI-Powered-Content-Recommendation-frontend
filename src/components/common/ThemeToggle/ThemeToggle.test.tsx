import { render, screen, fireEvent } from '@/utils/test-utils'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}))

describe('ThemeToggle', () => {
  it('renders sun icon in dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn()
    })

    render(<ThemeToggle />)
    expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
  })

  it('renders moon icon in light mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn()
    })

    render(<ThemeToggle />)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('toggles theme when clicked', () => {
    const setTheme = jest.fn()
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme
    })

    render(<ThemeToggle />)
    fireEvent.click(screen.getByLabelText('Toggle dark mode'))
    expect(setTheme).toHaveBeenCalledWith('dark')
  })
}) 