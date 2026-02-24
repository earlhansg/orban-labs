/**
 * Tests for UrlDashboard component
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UrlDashboard from '@/components/UrlDashboard'
import { urlApi } from '@/utils/api'

// Mock the API
jest.mock('@/utils/api', () => ({
  urlApi: {
    getAllUrls: jest.fn(),
  },
  handleApiError: jest.fn((error) => error.message || 'An error occurred'),
}))

// Mock clipboard
const mockCopyToClipboard = jest.fn()
jest.mock('@/utils/validation', () => ({
  ...jest.requireActual('@/utils/validation'),
  copyToClipboard: mockCopyToClipboard,
}))

const mockUrls = [
  {
    short_code: 'abc123',
    original_url: 'https://example.com',
    click_count: 5,
    created_at: '2026-02-25T10:30:00Z',
    expires_at: null,
    is_expired: false,
  },
  {
    short_code: 'def456',
    original_url: 'https://google.com',
    click_count: 10,
    created_at: '2026-02-24T15:45:00Z',
    expires_at: '2026-03-01T00:00:00Z',
    is_expired: false,
  },
  {
    short_code: 'ghi789',
    original_url: 'https://expired.com',
    click_count: 2,
    created_at: '2026-02-20T12:00:00Z',
    expires_at: '2026-02-21T12:00:00Z',
    is_expired: true,
  },
]

describe('UrlDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCopyToClipboard.mockResolvedValue(true)
  })

  it('renders loading state initially', () => {
    ;(urlApi.getAllUrls as jest.Mock).mockReturnValue(new Promise(() => {})) // Never resolves
    
    render(<UrlDashboard />)
    
    expect(screen.getByText('Loading your URLs...')).toBeInTheDocument()
  })

  it('renders empty state when no URLs exist', async () => {
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue([])
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('No URLs yet')).toBeInTheDocument()
      expect(screen.getByText('Create your first shortened URL using the form above.')).toBeInTheDocument()
    })
  })

  it('renders URLs table with data', async () => {
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(mockUrls)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Your URLs')).toBeInTheDocument()
      expect(screen.getByText('abc123')).toBeInTheDocument()
      expect(screen.getByText('def456')).toBeInTheDocument()
      expect(screen.getByText('ghi789')).toBeInTheDocument()
    })
    
    // Check that URLs are displayed
    expect(screen.getByText('https://example.com')).toBeInTheDocument()
    expect(screen.getByText('https://google.com')).toBeInTheDocument()
    expect(screen.getByText('https://expired.com')).toBeInTheDocument()
    
    // Check click counts
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows correct status badges', async () => {
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(mockUrls)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      const activeStatuses = screen.getAllByText('Active')
      const expiredStatuses = screen.getAllByText('Expired')
      
      expect(activeStatuses).toHaveLength(2) // Two active URLs
      expect(expiredStatuses).toHaveLength(1) // One expired URL
    })
  })

  it('displays summary statistics', async () => {
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(mockUrls)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Total URLs')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // Total URLs
      
      expect(screen.getByText('Total Clicks')).toBeInTheDocument()
      expect(screen.getByText('17')).toBeInTheDocument() // 5 + 10 + 2
      
      expect(screen.getByText('Active URLs')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Non-expired URLs
    })
  })

  it('handles API errors', async () => {
    const mockError = new Error('Failed to fetch URLs')
    ;(urlApi.getAllUrls as jest.Mock).mockRejectedValue(mockError)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch URLs')).toBeInTheDocument()
    })
  })

  it('refreshes data when refresh button is clicked', async () => {
    const user = userEvent.setup()
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(mockUrls)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Your URLs')).toBeInTheDocument()
    })
    
    // Clear the mock to track new calls
    ;(urlApi.getAllUrls as jest.Mock).mockClear()
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await user.click(refreshButton)
    
    expect(urlApi.getAllUrls).toHaveBeenCalledTimes(1)
  })

  it('copies short URL to clipboard', async () => {
    const user = userEvent.setup()
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(mockUrls)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('abc123')).toBeInTheDocument()
    })
    
    const copyButtons = screen.getAllByTitle('Copy short URL')
    await user.click(copyButtons[0])
    
    expect(mockCopyToClipboard).toHaveBeenCalledWith('http://localhost:8000/abc123')
  })

  it('formats URLs for display', async () => {
    const longUrl = 'https://example.com/very/long/path/that/should/be/truncated'
    const urlsWithLongUrl = [
      {
        ...mockUrls[0],
        original_url: longUrl,
      },
    ]
    
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(urlsWithLongUrl)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      // Should show truncated version
      expect(screen.getByText(/https:\/\/example\.com\/very\/long\/path\/that\.\.\.$/)).toBeInTheDocument()
    })
  })

  it('handles external link clicks', async () => {
    ;(urlApi.getAllUrls as jest.Mock).mockResolvedValue(mockUrls)
    
    render(<UrlDashboard />)
    
    await waitFor(() => {
      const externalLinks = screen.getAllByTitle('https://example.com')
      expect(externalLinks[0]).toHaveAttribute('href', 'https://example.com')
      expect(externalLinks[0]).toHaveAttribute('target', '_blank')
      expect(externalLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})