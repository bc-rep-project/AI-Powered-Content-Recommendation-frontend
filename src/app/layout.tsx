import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Content Recommender',
  description: 'Personalized content recommendations powered by AI',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-bg min-h-screen`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} AI Recommender. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
} 