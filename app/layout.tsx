import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Health & Wellness App',
  description: 'Your personal health and wellness companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}