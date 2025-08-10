# Personal Finance Dashboard

A full-stack TypeScript application that provides users with a comprehensive view of their financial data, including currency exchange rates, stock portfolio tracking, and transaction management.

## Tech Stack

**Frontend:**
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- Chart.js for data visualization

**Backend:**
- Node.js with Express.js and TypeScript
- Node-cache for in-memory caching
- Winston for logging
- External APIs: ExchangeRate-API, Alpha Vantage

## Project Structure

```
finance-dashboard/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   └── types/            # TypeScript type definitions
├── backend/              # Backend source code
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   ├── middleware/   # Express middleware
│   │   └── types/        # Backend type definitions
│   ├── package.json
│   └── tsconfig.json
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

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## API Endpoints

- `GET /api/dashboard` - Main dashboard data
- `GET /api/exchange-rates` - Currency exchange rates
- `GET /api/portfolio` - Stock portfolio data
- `GET /api/transactions` - Transaction history

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
EXCHANGE_RATE_API_KEY=your_api_key
ALPHA_VANTAGE_API_KEY=your_api_key
```

## Features

- 📊 Real-time financial dashboard
- 💱 Currency exchange rate tracking
- 📈 Stock portfolio management
- 💰 Transaction categorization and filtering
- 📱 Responsive design for mobile and desktop
- ⚡ Fast data caching and updates

## Development Workflow

This project follows a spec-driven development approach. See the `.kiro/specs/finance-dashboard/` directory for:
- `requirements.md` - Feature requirements
- `design.md` - Technical design document  
- `tasks.md` - Implementation task list

## Contributing

1. Pick a task from `tasks.md`
2. Create a feature branch
3. Implement with tests
4. Submit a pull request

## License

MIT License