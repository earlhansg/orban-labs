import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if API key is set in environment variables
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn('API_KEY environment variable is not set');
  }

  // Add API key to headers for API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    
    if (apiKey) {
      requestHeaders.set('x-api-key', apiKey);
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};