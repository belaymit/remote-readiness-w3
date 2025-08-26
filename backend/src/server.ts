import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { createLogger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;
const logger = createLogger();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    },
    timestamp: new Date()
  }
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Dashboard API is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Import API routes
import apiRoutes from './routes/api';

// API routes
app.use('/api', apiRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Dashboard API v1.0',
    endpoints: [
      'GET /health - Health check',
      'GET /api/dashboard - Dashboard data',
      'GET /api/exchange-rates?base=USD - Currency exchange rates',
      'GET /api/portfolio?symbols=AAPL,GOOGL - Portfolio data',
      'GET /api/stock/:symbol - Individual stock data',
      'GET /api/transactions?category=&search= - Transaction history'
    ],
    timestamp: new Date()
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Finance Dashboard API server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔗 API endpoints: http://localhost:${PORT}/api`);
});

export default app;