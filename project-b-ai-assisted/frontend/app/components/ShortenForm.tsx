/**
 * URL shortening form component
 */

'use client';

import { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';
import { urlApi, ShortenUrlResponse, handleApiError } from '@/utils/api';
import { isValidUrl, getUrlValidationError, copyToClipboard } from '@/utils/validation';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import SuccessAlert from './SuccessAlert';

interface ShortenFormProps {
  onUrlShortened?: (response: ShortenUrlResponse) => void;
}

export default function ShortenForm({ onUrlShortened }: ShortenFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenUrlResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle URL input change with validation
  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError(null);
    setSuccess(null);
    setShortenedUrl(null);
    
    // Real-time validation
    if (value.trim()) {
      const error = getUrlValidationError(value);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous states
    setError(null);
    setSuccess(null);
    setShortenedUrl(null);
    setCopied(false);

    // Validate URL
    const trimmedUrl = url.trim();
    const validationError = getUrlValidationError(trimmedUrl);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Call API to shorten URL
      const response = await urlApi.shortenUrl({ url: trimmedUrl });
      
      // Store the short code locally for the dashboard
      urlApi.storeShortCode(response.data.short_code);
      
      setShortenedUrl(response);
      setSuccess('URL shortened successfully!');
      
      // Call callback if provided
      if (onUrlShortened) {
        onUrlShortened(response);
      }
      
      // Clear the input
      setUrl('');
      setValidationError(null);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!shortenedUrl) return;
    
    const success = await copyToClipboard(shortenedUrl.data.short_url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          <Link2 className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Shorten Your URL</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  validationError ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {validationError && (
                <p className="mt-1 text-sm text-red-600">{validationError}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!validationError || !url.trim()}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Shortening..." />
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-2" />
                Shorten URL
              </>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onClose={() => setError(null)}
            className="mt-4"
          />
        )}

        {/* Success Alert */}
        {success && (
          <SuccessAlert 
            message={success} 
            onClose={() => setSuccess(null)}
            className="mt-4"
          />
        )}

        {/* Shortened URL Result */}
        {shortenedUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your shortened URL:</h3>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <a
                  href={shortenedUrl.data.short_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 font-medium break-all"
                >
                  {shortenedUrl.data.short_url}
                </a>
              </div>
              
              <button
                onClick={handleCopy}
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              <p>Original: {shortenedUrl.data.original_url}</p>
              <p>Created: {new Date(shortenedUrl.data.created_at).toLocaleString()}</p>
              {shortenedUrl.data.expires_at && (
                <p>Expires: {new Date(shortenedUrl.data.expires_at).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}