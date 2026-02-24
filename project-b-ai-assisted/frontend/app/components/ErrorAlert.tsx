/**
 * Error alert component
 */

import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function ErrorAlert({ message, onClose, className = '' }: ErrorAlertProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Close error message"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}