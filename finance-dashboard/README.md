# Personal Finance Dashboard

A full-stack TypeScript application that provides users with a comprehensive view of their financial data, including currency exchange rates, stock portfolio tracking, and transaction management.

## Tech Stack

**Frontend:**
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Axios for API requests
- Jest & Testing Library for testing

**Backend:**
- Node.js with Express.js and TypeScript
- Node-cache for in-memory caching
- Winston for logging
- Helmet & CORS for security
- Express Rate Limiting
- External APIs: ExchangeRate-API, Alpha Vantage

## Project Structure

```
finance-dashboard/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   │   ├── DashboardHeader.tsx
│   │   ├── ExchangeRates.tsx
│   │   ├── FinancialSummary.tsx
│   │   ├── Portfolio.tsx
│   │   └── RecentTransactions.tsx
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and validation
├── backend/              # Backend source code
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   ├── middleware/   # Express middleware (logging, error handling)
│   │   ├── utils/        # Backend utilities and validation
│   │   └── types/        # Backend type definitions
│   ├── package.json
│   └── tsconfig.json
├── .kiro/specs/          # Specification documents
├── package.json          # Frontend dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
npm run install:backend
```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Frontend only (port 3000)
npm run dev

# Backend only (port 3001)
npm run dev:backend
```

### Building for Production

Build both frontend and backend:
```bash
npm run build
```

### Running in Production

Start both frontend and backend:
```bash
npm run start:full
```

Or start them separately:
```bash
# Frontend only
npm start

# Backend only
npm run start:backend
```

### Running Tests

```bash
# Frontend tests only
npm test

# Backend tests only
npm run test:backend

# All tests
npm run test:all

# Watch mode
npm run test:watch
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/dashboard` - Main dashboard data (financial summary, portfolio, transactions, exchange rates)
- `GET /api/exchange-rates` - Currency exchange rates
- `GET /api/portfolio` - Stock portfolio data
- `GET /api/transactions` - Transaction history
- `GET /api/stock/:symbol` - Individual stock data

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For the backend, you can optionally set:
```
EXCHANGE_RATE_API_KEY=your_api_key
ALPHA_VANTAGE_API_KEY=your_api_key
PORT=3001
```

**Note:** The application works without API keys by using mock data and free tier limits.

## Features

- 📊 Real-time financial dashboard with summary metrics
- 💱 Currency exchange rate tracking (USD, EUR, GBP, JPY, CAD)
- 📈 Stock portfolio management (add/remove stocks, real-time prices)
- 💰 Transaction history with categorization
- 📱 Responsive design for mobile and desktop
- ⚡ Fast data caching and graceful API fallbacks
- 🔒 Security middleware (Helmet, CORS, Rate Limiting)
- 🧪 Comprehensive test coverage (141 tests)
- 📝 TypeScript throughout for type safety

## Testing

The project includes comprehensive test coverage:

**Frontend Tests (88 tests):**
- Component testing with React Testing Library
- Utility function testing
- Type guard validation
- Form validation schemas

**Backend Tests (53 tests):**
- API endpoint testing
- Service layer testing
- Cache functionality testing
- Error handling validation

Run tests with coverage:
```bash
npm run test:coverage
```

## Architecture

**Frontend Architecture:**
- Next.js 15 with App Router
- Component-based architecture with TypeScript
- Centralized API service layer
- Utility functions for validation and data processing

**Backend Architecture:**
- Express.js REST API with TypeScript
- Service layer pattern for business logic
- In-memory caching with Node-cache
- Structured logging with Winston
- Comprehensive error handling and validation

## Development Workflow

This project follows a spec-driven development approach. See the `.kiro/specs/finance-dashboard/` directory for:
- `requirements.md` - Feature requirements and user stories
- `design.md` - Technical design document and architecture
- `tasks.md` - Implementation task list and progress tracking

## Contributing

1. Pick a task from `tasks.md`
2. Create a feature branch
3. Implement with tests
4. Ensure all tests pass (`npm run test:all`)
5. Submit a pull request

## License

MIT License