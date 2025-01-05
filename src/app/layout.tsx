import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Content Recommendations',
  description: 'Discover personalized content through advanced AI recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
            <MobileNavigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 