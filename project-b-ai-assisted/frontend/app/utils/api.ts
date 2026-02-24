/**
 * API utility functions for URL shortener service
 */

import axios, { AxiosResponse } from 'axios';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'your-secret-api-key-here';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Types for API responses
export interface ShortenUrlRequest {
  url: string;
  expires_at?: string;
}

export interface ShortenUrlResponse {
  success: boolean;
  data: {
    short_code: string;
    original_url: string;
    short_url: string;
    created_at: string;
    expires_at: string | null;
  };
  message: string;
}

export interface UrlStats {
  short_code: string;
  original_url: string;
  click_count: number;
  created_at: string;
  expires_at: string | null;
  is_expired: boolean;
}

export interface UrlStatsResponse {
  success: boolean;
  data: UrlStats;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// API functions
export const urlApi = {
  /**
   * Shorten a URL
   */
  async shortenUrl(request: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    try {
      const response: AxiosResponse<ShortenUrlResponse> = await apiClient.post('/shorten', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to shorten URL');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Get URL statistics
   */
  async getUrlStats(shortCode: string): Promise<UrlStatsResponse> {
    try {
      const response: AxiosResponse<UrlStatsResponse> = await apiClient.get(`/stats/${shortCode}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get URL stats');
      }
      throw new Error('Network error occurred');
    }
  },

  /**
   * Check service health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string; version: string }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Service is unavailable');
    }
  },

  /**
   * Get all URLs (mock endpoint - would need to be implemented in backend)
   * For now, we'll simulate this by storing URLs in localStorage
   */
  async getAllUrls(): Promise<UrlStats[]> {
    // In a real app, this would be a backend endpoint
    // For demo purposes, we'll use localStorage
    const storedUrls = localStorage.getItem('shortened_urls');
    if (!storedUrls) return [];
    
    const urls: string[] = JSON.parse(storedUrls);
    const urlStats: UrlStats[] = [];
    
    // Fetch stats for each stored URL
    for (const shortCode of urls) {
      try {
        const stats = await this.getUrlStats(shortCode);
        urlStats.push(stats.data);
      } catch (error) {
        // Skip URLs that no longer exist
        console.warn(`Failed to fetch stats for ${shortCode}:`, error);
      }
    }
    
    return urlStats;
  },

  /**
   * Store a short code locally (for demo purposes)
   */
  storeShortCode(shortCode: string): void {
    const storedUrls = localStorage.getItem('shortened_urls');
    const urls: string[] = storedUrls ? JSON.parse(storedUrls) : [];
    
    if (!urls.includes(shortCode)) {
      urls.push(shortCode);
      localStorage.setItem('shortened_urls', JSON.stringify(urls));
    }
  },
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};