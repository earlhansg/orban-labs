/**
 * Tests for ShortenForm component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShortenForm from '@/components/ShortenForm'
import { urlApi } from '@/utils/api'

// Mock the API
jest.mock('@/utils/api', () => ({
  urlApi: {
    shortenUrl: jest.fn(),
    storeShortCode: jest.fn(),
  },
  handleApiError: jest.fn((error) => error.message || 'An error occurred'),
}))

// Mock clipboard
const mockCopyToClipboard = jest.fn()
jest.mock('@/utils/validation', () => ({
  ...jest.requireActual('@/utils/validation'),
  copyToClipboard: mockCopyToClipboard,
}))

describe('ShortenForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCopyToClipboard.mockResolvedValue(true)
  })

  it('renders the form correctly', () => {
    render(<ShortenForm />)
    
    expect(screen.getByText('Shorten Your URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Enter your long URL')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /shorten url/i })).toBeInTheDocument()
  })

  it('validates URL input', async () => {
    const user = userEvent.setup()
    render(<ShortenForm />)
    
    const input = screen.getByLabelText('Enter your long URL')
    const submitButton = screen.getByRole('button', { name: /shorten url/i })
    
    // Test empty input
    await user.click(submitButton)
    expect(submitButton).toBeDisabled()
    
    // Test invalid URL
    await user.type(input, 'not-a-url')
    expect(screen.getByText('URL must start with http:// or https://')).toBeInTheDocument()
    
    // Test valid URL
    await user.clear(input)
    await user.type(input, 'https://example.com')
    expect(screen.queryByText('URL must start with http:// or https://')).not.toBeInTheDocument()
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        short_code: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8000/abc123',
        created_at: '2026-02-25T10:30:00Z',
        expires_at: null,
      },
      message: 'URL shortened successfully',
    }
    
    ;(urlApi.shortenUrl as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<ShortenForm />)
    
    const input = screen.getByLabelText('Enter your long URL')
    const submitButton = screen.getByRole('button', { name: /shorten url/i })
    
    await user.type(input, 'https://example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(urlApi.shortenUrl).toHaveBeenCalledWith({
        url: 'https://example.com',
      })
    })
    
    expect(screen.getByText('URL shortened successfully!')).toBeInTheDocument()
    expect(screen.getByText('http://localhost:8000/abc123')).toBeInTheDocument()
  })

  it('handles API errors', async () => {
    const user = userEvent.setup()
    const mockError = new Error('Invalid URL format')
    
    ;(urlApi.shortenUrl as jest.Mock).mockRejectedValue(mockError)
    
    render(<ShortenForm />)
    
    const input = screen.getByLabelText('Enter your long URL')
    const submitButton = screen.getByRole('button', { name: /shorten url/i })
    
    await user.type(input, 'https://example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid URL format')).toBeInTheDocument()
    })
  })

  it('copies shortened URL to clipboard', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        short_code: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8000/abc123',
        created_at: '2026-02-25T10:30:00Z',
        expires_at: null,
      },
      message: 'URL shortened successfully',
    }
    
    ;(urlApi.shortenUrl as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<ShortenForm />)
    
    const input = screen.getByLabelText('Enter your long URL')
    const submitButton = screen.getByRole('button', { name: /shorten url/i })
    
    await user.type(input, 'https://example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('http://localhost:8000/abc123')).toBeInTheDocument()
    })
    
    const copyButton = screen.getByRole('button', { name: /copy/i })
    await user.click(copyButton)
    
    expect(mockCopyToClipboard).toHaveBeenCalledWith('http://localhost:8000/abc123')
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Create a promise that we can control
    let resolvePromise: (value: any) => void
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(urlApi.shortenUrl as jest.Mock).mockReturnValue(mockPromise)
    
    render(<ShortenForm />)
    
    const input = screen.getByLabelText('Enter your long URL')
    const submitButton = screen.getByRole('button', { name: /shorten url/i })
    
    await user.type(input, 'https://example.com')
    await user.click(submitButton)
    
    // Check loading state
    expect(screen.getByText('Shortening...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Resolve the promise
    resolvePromise!({
      success: true,
      data: {
        short_code: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8000/abc123',
        created_at: '2026-02-25T10:30:00Z',
        expires_at: null,
      },
      message: 'URL shortened successfully',
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Shortening...')).not.toBeInTheDocument()
    })
  })

  it('calls onUrlShortened callback when provided', async () => {
    const user = userEvent.setup()
    const mockCallback = jest.fn()
    const mockResponse = {
      success: true,
      data: {
        short_code: 'abc123',
        original_url: 'https://example.com',
        short_url: 'http://localhost:8000/abc123',
        created_at: '2026-02-25T10:30:00Z',
        expires_at: null,
      },
      message: 'URL shortened successfully',
    }
    
    ;(urlApi.shortenUrl as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<ShortenForm onUrlShortened={mockCallback} />)
    
    const input = screen.getByLabelText('Enter your long URL')
    const submitButton = screen.getByRole('button', { name: /shorten url/i })
    
    await user.type(input, 'https://example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledWith(mockResponse)
    })
  })
})