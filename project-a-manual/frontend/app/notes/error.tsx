'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Notes page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We encountered an error while loading your notes. This might be due to a connection issue with the backend API.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Make sure the backend API is running on <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://localhost:8000</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}