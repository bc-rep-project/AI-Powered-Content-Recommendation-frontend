import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ReactElement } from 'react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: 'light' | 'dark' | 'system'
}

function render(
  ui: ReactElement,
  { initialTheme = 'light', ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <ThemeProvider attribute="class" defaultTheme={initialTheme} enableSystem>
        {children}
      </ThemeProvider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
export { render } 