import axios from 'axios';
import { externalApiService } from '../externalApiService';
import { cacheService } from '../cacheService';
import { TransactionCategory } from '../../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock cache service
jest.mock('../cacheService');
const mockedCacheService = cacheService as jest.Mocked<typeof cacheService>;

describe('ExternalAPIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset cache mock
    mockedCacheService.get.mockReturnValue(null);
  });

  describe('getExchangeRates', () => {
    it('should fetch exchange rates successfully', async () => {
      const mockResponse = {
        data: {
          rates: {
            EUR: 0.8456,
            GBP: 0.7834,
            JPY: 149.23,
            CAD: 1.3456,
            AUD: 1.4567,
            CHF: 0.9123
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const rates = await externalApiService.getExchangeRates('USD');

      expect(rates).toHaveLength(6);
      expect(rates[0]).toHaveProperty('currency');
      expect(rates[0]).toHaveProperty('rate');
      expect(rates[0]).toHaveProperty('change24h');
      expect(rates[0]).toHaveProperty('lastUpdated');
      
      expect(mockedCacheService.set).toHaveBeenCalledWith(
        'exchange_rates_USD',
        expect.any(Array),
        3600
      );
    });

    it('should return cached data when available', async () => {
      const cachedRates = [
        { currency: 'EUR', rate: 0.8456, change24h: -0.12, lastUpdated: new Date() }
      ];
      
      mockedCacheService.get.mockReturnValueOnce(cachedRates);

      const rates = await externalApiService.getExchangeRates('USD');

      expect(rates).toEqual(cachedRates);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fallback to mock data on API failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const rates = await externalApiService.getExchangeRates('USD');

      expect(rates).toHaveLength(4); // Mock data has 4 currencies
      expect(rates[0]).toHaveProperty('currency', 'EUR');
    });
  });

  describe('getStockPrice', () => {
    it('should fetch stock data successfully', async () => {
      const mockResponse = {
        data: {
          'Global Quote': {
            '01. symbol': 'AAPL',
            '05. price': '150.25',
            '08. previous close': '148.50',
            '09. change': '1.75',
            '10. change percent': '1.18%',
            '06. volume': '50000000'
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const stock = await externalApiService.getStockPrice('AAPL');

      expect(stock).toEqual({
        symbol: 'AAPL',
        name: 'AAPL Inc.',
        currentPrice: 150.25,
        previousClose: 148.50,
        change: 1.75,
        changePercent: 1.18,
        volume: 50000000,
        lastUpdated: expect.any(Date)
      });

      expect(mockedCacheService.set).toHaveBeenCalled();
    });

    it('should return cached stock data when available', async () => {
      const cachedStock = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        currentPrice: 150.25,
        previousClose: 148.50,
        change: 1.75,
        changePercent: 1.18,
        volume: 50000000,
        lastUpdated: new Date()
      };

      mockedCacheService.get.mockReturnValueOnce(cachedStock);

      const stock = await externalApiService.getStockPrice('AAPL');

      expect(stock).toEqual(cachedStock);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should handle invalid stock symbol', async () => {
      const mockResponse = {
        data: {
          'Error Message': 'Invalid API call'
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const stock = await externalApiService.getStockPrice('INVALID');

      // Should return mock data as fallback
      expect(stock).toHaveProperty('symbol', 'INVALID');
      expect(stock).toHaveProperty('currentPrice');
      expect(stock.currentPrice).toBeGreaterThan(0);
    });

    it('should handle API rate limit', async () => {
      const mockResponse = {
        data: {
          'Note': 'Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute'
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const stock = await externalApiService.getStockPrice('AAPL');

      // Should return mock data as fallback
      expect(stock).toHaveProperty('symbol', 'AAPL');
      expect(stock).toHaveProperty('currentPrice');
    });
  });

  describe('getTransactions', () => {
    it('should return mock transactions', async () => {
      const transactions = await externalApiService.getTransactions({});

      expect(transactions).toHaveLength(5);
      expect(transactions[0]).toHaveProperty('id');
      expect(transactions[0]).toHaveProperty('userId');
      expect(transactions[0]).toHaveProperty('date');
      expect(transactions[0]).toHaveProperty('amount');
      expect(transactions[0]).toHaveProperty('description');
      expect(transactions[0]).toHaveProperty('category');
      expect(transactions[0]).toHaveProperty('type');
    });

    it('should filter transactions by category', async () => {
      const transactions = await externalApiService.getTransactions({
        category: TransactionCategory.FOOD
      });

      const foodTransactions = transactions.filter(t => t.category === TransactionCategory.FOOD);
      expect(transactions).toEqual(foodTransactions);
    });

    it('should filter transactions by type', async () => {
      const transactions = await externalApiService.getTransactions({
        type: 'income'
      });

      const incomeTransactions = transactions.filter(t => t.type === 'income');
      expect(transactions).toEqual(incomeTransactions);
    });

    it('should filter transactions by search term', async () => {
      const transactions = await externalApiService.getTransactions({
        searchTerm: 'salary'
      });

      expect(transactions.length).toBeGreaterThan(0);
      expect(transactions[0].description.toLowerCase()).toContain('salary');
    });
  });
});