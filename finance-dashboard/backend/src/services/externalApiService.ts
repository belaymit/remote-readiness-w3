import axios from 'axios';
import { ExternalAPIService, ExchangeRate, Stock, Transaction, TransactionFilters, TransactionCategory } from '../types';
import { cacheService } from './cacheService';
import { createLogger } from '../utils/logger';

const logger = createLogger();

class ExternalAPIServiceImpl implements ExternalAPIService {
  private readonly exchangeRateApiKey: string;
  private readonly alphaVantageApiKey: string;

  constructor() {
    this.exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY || '';
    this.alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    
    if (!this.exchangeRateApiKey) {
      logger.warn('EXCHANGE_RATE_API_KEY not set, using free tier');
    }
    if (!this.alphaVantageApiKey) {
      logger.warn('ALPHA_VANTAGE_API_KEY not set, using demo key');
    }
  }

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRate[]> {
    const cacheKey = `exchange_rates_${baseCurrency}`;
    
    // Try cache first
    const cached = cacheService.get<ExchangeRate[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Using exchangerate-api.com (free tier: 1,500 requests/month)
      const url = this.exchangeRateApiKey 
        ? `https://v6.exchangerate-api.com/v6/${this.exchangeRateApiKey}/latest/${baseCurrency}`
        : `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Finance-Dashboard/1.0'
        }
      });

      const data = response.data;
      const rates: ExchangeRate[] = [];

      // Convert to our format
      const targetCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];
      
      for (const currency of targetCurrencies) {
        if (data.rates && data.rates[currency]) {
          rates.push({
            currency,
            rate: data.rates[currency],
            change24h: Math.random() * 2 - 1, // Mock 24h change for now
            lastUpdated: new Date()
          });
        }
      }

      // Cache for 1 hour
      cacheService.set(cacheKey, rates, 3600);
      logger.info(`Fetched exchange rates for ${baseCurrency}: ${rates.length} currencies`);
      
      return rates;
    } catch (error) {
      logger.error('Failed to fetch exchange rates:', error);
      
      // Return cached data if available, even if expired
      const staleCache = cacheService.get<ExchangeRate[]>(cacheKey);
      if (staleCache) {
        logger.warn('Returning stale exchange rate data');
        return staleCache;
      }
      
      // Fallback to mock data
      return this.getMockExchangeRates(baseCurrency);
    }
  }

  async getStockPrice(symbol: string): Promise<Stock> {
    const cacheKey = `stock_${symbol}`;
    
    // Try cache first (5 minute TTL during market hours)
    const cached = cacheService.get<Stock>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Using Alpha Vantage API (free tier: 5 requests/minute, 500/day)
      const apiKey = this.alphaVantageApiKey || 'demo';
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Finance-Dashboard/1.0'
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`Invalid stock symbol: ${symbol}`);
      }

      if (data['Note']) {
        throw new Error('API rate limit exceeded');
      }

      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error('No stock data available');
      }

      const stock: Stock = {
        symbol: quote['01. symbol'] || symbol,
        name: `${symbol} Inc.`, // Alpha Vantage doesn't provide company name in this endpoint
        currentPrice: parseFloat(quote['05. price']) || 0,
        previousClose: parseFloat(quote['08. previous close']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        lastUpdated: new Date()
      };

      // Cache for 5 minutes during market hours, 1 hour after close
      const isMarketHours = this.isMarketHours();
      const ttl = isMarketHours ? 300 : 3600;
      cacheService.set(cacheKey, stock, ttl);
      
      logger.info(`Fetched stock data for ${symbol}: $${stock.currentPrice}`);
      return stock;
    } catch (error) {
      logger.error(`Failed to fetch stock data for ${symbol}:`, error);
      
      // Return cached data if available, even if expired
      const staleCache = cacheService.get<Stock>(cacheKey);
      if (staleCache) {
        logger.warn(`Returning stale stock data for ${symbol}`);
        return staleCache;
      }
      
      // Fallback to mock data
      return this.getMockStock(symbol);
    }
  }

  async getTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    // For now, return mock transactions since we don't have a real transaction API
    // In a real app, this would connect to a banking API or database
    return this.getMockTransactions(filters);
  }

  // Helper methods
  private isMarketHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Simple check: weekdays 9:30 AM - 4:00 PM EST (approximate)
    return day >= 1 && day <= 5 && hour >= 9 && hour <= 16;
  }

  private getMockExchangeRates(baseCurrency: string): ExchangeRate[] {
    return [
      {
        currency: 'EUR',
        rate: 0.8456,
        change24h: -0.12,
        lastUpdated: new Date(),
      },
      {
        currency: 'GBP',
        rate: 0.7834,
        change24h: 0.08,
        lastUpdated: new Date(),
      },
      {
        currency: 'JPY',
        rate: 149.23,
        change24h: -0.34,
        lastUpdated: new Date(),
      },
      {
        currency: 'CAD',
        rate: 1.3456,
        change24h: 0.15,
        lastUpdated: new Date(),
      },
    ];
  }

  private getMockStock(symbol: string): Stock {
    return {
      symbol,
      name: `${symbol} Inc.`,
      currentPrice: Math.random() * 200 + 50,
      previousClose: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 10000000),
      lastUpdated: new Date(),
    };
  }

  private getMockTransactions(filters: TransactionFilters): Transaction[] {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'user1',
        date: new Date('2025-01-08'),
        amount: 8500.00,
        description: 'Monthly Salary',
        category: TransactionCategory.SALARY,
        type: 'income',
        currency: 'USD',
      },
      {
        id: '2',
        userId: 'user1',
        date: new Date('2025-01-07'),
        amount: -85.50,
        description: 'Grocery Shopping - Whole Foods',
        category: TransactionCategory.FOOD,
        type: 'expense',
        currency: 'USD',
      },
      {
        id: '3',
        userId: 'user1',
        date: new Date('2025-01-06'),
        amount: -45.00,
        description: 'Gas Station Fill-up',
        category: TransactionCategory.TRANSPORT,
        type: 'expense',
        currency: 'USD',
      },
      {
        id: '4',
        userId: 'user1',
        date: new Date('2025-01-05'),
        amount: -1200.00,
        description: 'Monthly Rent Payment',
        category: TransactionCategory.UTILITIES,
        type: 'expense',
        currency: 'USD',
      },
      {
        id: '5',
        userId: 'user1',
        date: new Date('2025-01-04'),
        amount: -25.99,
        description: 'Netflix Subscription',
        category: TransactionCategory.ENTERTAINMENT,
        type: 'expense',
        currency: 'USD',
      },
    ];

    // Apply filters
    return mockTransactions.filter(transaction => {
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return transaction.description.toLowerCase().includes(searchLower) ||
               transaction.category.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }
}

// Export singleton instance
export const externalApiService = new ExternalAPIServiceImpl();
export default externalApiService;