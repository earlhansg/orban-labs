# URL Shortener Frontend

A modern, responsive frontend for the URL shortener service built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **URL Shortening Form**: Clean, intuitive interface for creating short URLs
- **Real-time Validation**: Instant feedback on URL format and validity
- **Dashboard**: View all created URLs with detailed statistics
- **Analytics**: Track click counts, creation dates, and URL status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth loading indicators for better UX

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js config

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your-secret-api-key-here
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 15 App Router
│   ├── components/         # React components
│   │   ├── ShortenForm.tsx     # URL shortening form
│   │   ├── UrlDashboard.tsx    # URLs dashboard
│   │   ├── LoadingSpinner.tsx  # Loading component
│   │   ├── ErrorAlert.tsx      # Error alert component
│   │   └── SuccessAlert.tsx    # Success alert component
│   ├── utils/              # Utility functions
│   │   ├── api.ts              # API client and functions
│   │   └── validation.ts       # Validation utilities
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── tests/                  # Test files
│   ├── ShortenForm.test.tsx
│   └── UrlDashboard.test.tsx
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🧪 Testing

### Run Tests

```bash
npm test
# or
yarn test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
# or
yarn test:watch
```

### Test Coverage

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## 🎨 Components

### ShortenForm

The main URL shortening form component with:

- Real-time URL validation
- Loading states during API calls
- Success/error feedback
- Copy to clipboard functionality
- Responsive design

**Props:**
- `onUrlShortened?: (response: ShortenUrlResponse) => void` - Callback when URL is successfully shortened

### UrlDashboard

Dashboard component displaying all created URLs with:

- Sortable table of URLs
- Click count analytics
- Status indicators (active/expired)
- Copy short URL functionality
- Summary statistics
- Refresh capability

### LoadingSpinner

Reusable loading spinner component with:

- Multiple sizes (sm, md, lg)
- Optional text label
- Customizable styling

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Spinner size
- `className?: string` - Additional CSS classes
- `text?: string` - Optional loading text

### ErrorAlert / SuccessAlert

Alert components for user feedback with:

- Consistent styling
- Dismissible option
- Icon indicators
- Accessible design

**Props:**
- `message: string` - Alert message
- `onClose?: () => void` - Close callback
- `className?: string` - Additional CSS classes

## 🔧 API Integration

The frontend communicates with the backend API through the `api.ts` utility:

### API Functions

- `urlApi.shortenUrl(request)` - Create a short URL
- `urlApi.getUrlStats(shortCode)` - Get URL statistics
- `urlApi.getAllUrls()` - Get all URLs (uses localStorage for demo)
- `urlApi.checkHealth()` - Check API health

### Error Handling

All API calls include comprehensive error handling:

- Network errors
- API validation errors
- Authentication errors
- Timeout handling

## 🎯 Validation

URL validation includes:

- Protocol validation (http/https)
- Length limits (10-2048 characters)
- Format validation using regex
- Real-time feedback

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized table layouts for mobile

## 🔒 Security

Security considerations:

- Input sanitization
- XSS prevention
- HTTPS enforcement in production
- Secure clipboard API usage
- Environment variable protection

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_API_KEY=your-production-api-key
```

## 🔍 Performance

Performance optimizations:

- Next.js automatic code splitting
- Image optimization
- CSS optimization with Tailwind
- Lazy loading of components
- Efficient re-rendering with React hooks

## 🧩 Customization

### Styling

Customize the design by modifying:

- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - Global styles
- Component-specific styles

### API Configuration

Update API settings in:

- `.env.local` - Environment variables
- `app/utils/api.ts` - API client configuration

### Validation Rules

Modify validation in:

- `app/utils/validation.ts` - Validation functions

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check backend is running on correct port
   - Verify `NEXT_PUBLIC_API_URL` environment variable
   - Check CORS configuration

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

3. **Test Failures**
   - Update test snapshots: `npm test -- -u`
   - Check mock configurations in `jest.setup.js`

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=true
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the backend API documentation
3. Check browser console for errors
4. Verify environment configuration