/**
 * Main page component for URL shortener
 */

'use client';

import { useState } from 'react';
import ShortenForm from './components/ShortenForm';
import UrlDashboard from './components/UrlDashboard';
import { ShortenUrlResponse } from './utils/api';

export default function HomePage() {
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  // Handle URL shortened to refresh dashboard
  const handleUrlShortened = (response: ShortenUrlResponse) => {
    // Trigger dashboard refresh by updating state
    setRefreshDashboard(prev => prev + 1);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Shorten Your
            <span className="text-primary-600"> URLs</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create short, shareable links with detailed analytics. 
            Fast, secure, and reliable URL shortening service.
          </p>
        </div>

        {/* Shorten Form Section */}
        <section id="shorten" className="mb-16">
          <ShortenForm onUrlShortened={handleUrlShortened} />
        </section>

        {/* Dashboard Section */}
        <section id="dashboard">
          <UrlDashboard key={refreshDashboard} />
        </section>

        {/* Features Section */}
        <section className="mt-16 py-12 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Why Choose Our URL Shortener?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Powerful features to help you manage and track your links
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="bg-primary-100 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Generate short URLs instantly with our optimized backend infrastructure.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="bg-primary-100 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Track click counts, creation dates, and monitor your link performance.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="bg-primary-100 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">
                  API key authentication and robust error handling ensure your links are safe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Information Section */}
        <section className="mt-16 py-12 bg-gray-100 rounded-lg">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Developer Friendly
              </h2>
              <p className="mt-4 text-gray-600">
                Built with modern technologies and best practices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 15 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Responsive design</li>
                  <li>• Real-time validation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• FastAPI with Python</li>
                  <li>• SQLAlchemy ORM</li>
                  <li>• API key authentication</li>
                  <li>• Comprehensive error handling</li>
                  <li>• Auto-generated API docs</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                View API Documentation
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}