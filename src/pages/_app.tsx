import '@/styles/globals.css'
import { type AppType } from 'next/app'
import { ThemeProvider } from 'next-themes'

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App 