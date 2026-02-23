/**
 * Authentication utilities for API key management
 */

export function getApiKey(): string | undefined {
  // In client-side code, use NEXT_PUBLIC_API_KEY
  // In server-side code, use API_KEY
  return typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_KEY 
    : process.env.API_KEY;
}

export function isAuthenticated(): boolean {
  return !!getApiKey();
}

export class AuthError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Creates headers with API key for authenticated requests
 */
export function createAuthHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
  const apiKey = getApiKey();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
  
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }
  
  return headers;
}