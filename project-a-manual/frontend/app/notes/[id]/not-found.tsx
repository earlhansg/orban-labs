import Link from 'next/link';
import { ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Note Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The note you're looking for doesn't exist or may have been deleted.
          </p>
        </div>
        
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Link>
      </div>
    </div>
  );
}