import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Content Recommendations',
  description: 'Personalized content recommendations powered by AI'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-white">
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 