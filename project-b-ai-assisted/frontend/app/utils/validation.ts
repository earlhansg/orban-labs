/**
 * Validation utility functions
 */

// URL validation regex pattern
const URL_PATTERN = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;

/**
 * Validate if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Remove whitespace
  const trimmedUrl = url.trim();

  // Check minimum length
  if (trimmedUrl.length < 10) {
    return false;
  }

  // Check maximum length (backend limit is 2048)
  if (trimmedUrl.length > 2048) {
    return false;
  }

  // Check if it starts with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return false;
  }

  // Use regex for detailed validation
  return URL_PATTERN.test(trimmedUrl);
};

/**
 * Normalize URL by adding protocol if missing
 */
export const normalizeUrl = (url: string): string => {
  const trimmedUrl = url.trim();
  
  // If no protocol, assume https
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }
  
  return trimmedUrl;
};

/**
 * Get validation error message for URL
 */
export const getUrlValidationError = (url: string): string | null => {
  if (!url || !url.trim()) {
    return 'URL is required';
  }

  const trimmedUrl = url.trim();

  if (trimmedUrl.length < 10) {
    return 'URL is too short';
  }

  if (trimmedUrl.length > 2048) {
    return 'URL is too long (maximum 2048 characters)';
  }

  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return 'URL must start with http:// or https://';
  }

  if (!isValidUrl(trimmedUrl)) {
    return 'Please enter a valid URL';
  }

  return null;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format URL for display (truncate if too long)
 */
export const formatUrlForDisplay = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) {
    return url;
  }
  
  return `${url.substring(0, maxLength - 3)}...`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};