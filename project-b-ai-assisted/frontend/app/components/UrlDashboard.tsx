/**
 * URL dashboard component showing created URLs and their statistics
 */

'use client';

import { useState, useEffect } from 'react';
import { BarChart3, ExternalLink, Copy, Check, RefreshCw, Calendar, MousePointer } from 'lucide-react';
import { urlApi, UrlStats, handleApiError } from '@/utils/api';
import { formatDate, formatUrlForDisplay, copyToClipboard } from '@/utils/validation';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

export default function UrlDashboard() {
  const [urls, setUrls] = useState<UrlStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  // Fetch all URLs
  const fetchUrls = async () => {
    try {
      setError(null);
      const urlStats = await urlApi.getAllUrls();
      setUrls(urlStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUrls();
    setRefreshing(false);
  };

  // Handle copy to clipboard
  const handleCopy = async (shortUrl: string) => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopiedUrl(shortUrl);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <LoadingSpinner size="lg" text="Loading your URLs..." className="py-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your URLs</h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-6 pb-0">
            <ErrorAlert 
              message={error} 
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {urls.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
              <p className="text-gray-500">
                Create your first shortened URL using the form above.
              </p>
            </div>
          ) : (
            // URLs table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Original URL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Short URL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr key={url.short_code} className="border-b border-gray-100 hover:bg-gray-50">
                      {/* Original URL */}
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <a
                            href={url.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                            title={url.original_url}
                          >
                            {formatUrlForDisplay(url.original_url, 40)}
                            <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Short URL */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {url.short_code}
                          </code>
                          <button
                            onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${url.short_code}`)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy short URL"
                          >
                            {copiedUrl === `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${url.short_code}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Click count */}
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <MousePointer className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="font-medium">{url.click_count}</span>
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(url.created_at)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {url.is_expired ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                          >
                            Visit
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary stats */}
          {urls.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-primary-900">Total URLs</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-900 mt-1">{urls.length}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <MousePointer className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">Total Clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {urls.reduce((sum, url) => sum + url.click_count, 0)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Active URLs</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {urls.filter(url => !url.is_expired).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}