import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'URL Shortener - Fast & Secure Link Shortening',
  description: 'Create short, shareable links with detailed analytics. Fast, secure, and reliable URL shortening service.',
  keywords: 'URL shortener, link shortener, short links, analytics, link management',
  authors: [{ name: 'URL Shortener Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'URL Shortener - Fast & Secure Link Shortening',
    description: 'Create short, shareable links with detailed analytics.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Shortener - Fast & Secure Link Shortening',
    description: 'Create short, shareable links with detailed analytics.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <div className="min-h-full">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    URL Shortener
                  </h1>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a
                    href="#shorten"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Shorten
                  </a>
                  <a
                    href="#dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-sm text-gray-600">
                <p>
                  © 2026 URL Shortener. Built with Next.js 15 and FastAPI.
                </p>
                <p className="mt-2">
                  Fast, secure, and reliable link shortening service.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}