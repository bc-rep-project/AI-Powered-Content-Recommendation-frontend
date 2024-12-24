import type { Metadata } from 'next';
import Providers from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AI Content Recommendations',
  description: 'Personalized content recommendations powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 