import {
  isUser,
  isFinancialSummary,
  isExchangeRate,
  isStock,
  isTransaction,
  isAPIResponse,
  isErrorResponse,
  isExchangeRateArray,
  isStockArray,
  isTransactionArray,
  safeParseDate,
  safeParseNumber,
  safeParseString,
  assertIsUser,
  assertIsStock,
  assertIsTransaction,
} from '../typeGuards';
import { TransactionCategory } from '@/types';

describe('Type Guards', () => {
  describe('isUser', () => {
    const validUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      preferredCurrency: 'USD',
      portfolioSymbols: ['AAPL', 'GOOGL'],
    };

    it('should return true for valid user', () => {
      expect(isUser(validUser)).toBe(true);
    });

    it('should return false for invalid user - missing fields', () => {
      const { id, ...invalid } = validUser;
      expect(isUser(invalid)).toBe(false);
    });

    it('should return false for invalid user - wrong type', () => {
      expect(isUser({ ...validUser, id: 123 })).toBe(false);
    });

    it('should return false for invalid portfolioSymbols', () => {
      expect(isUser({ ...validUser, portfolioSymbols: ['AAPL', 123] })).toBe(false);
    });
  });

  describe('isFinancialSummary', () => {
    const validSummary = {
      totalBalance: 10000,
      portfolioValue: 5000,
      monthlyIncome: 3000,
      monthlyExpenses: 2000,
      monthlyChange: 2.5,
      currency: 'USD',
      lastUpdated: new Date(),
    };

    it('should return true for valid financial summary', () => {
      expect(isFinancialSummary(validSummary)).toBe(true);
    });

    it('should return false for invalid summary - wrong type', () => {
      expect(isFinancialSummary({ ...validSummary, totalBalance: 'invalid' })).toBe(false);
    });

    it('should return false for invalid summary - invalid date', () => {
      expect(isFinancialSummary({ ...validSummary, lastUpdated: 'invalid' })).toBe(false);
    });
  });

  describe('isExchangeRate', () => {
    const validRate = {
      currency: 'EUR',
      rate: 1.18,
      change24h: 0.02,
      lastUpdated: new Date(),
    };

    it('should return true for valid exchange rate', () => {
      expect(isExchangeRate(validRate)).toBe(true);
    });

    it('should return false for invalid rate', () => {
      expect(isExchangeRate({ ...validRate, rate: 'invalid' })).toBe(false);
    });
  });

  describe('isStock', () => {
    const validStock = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 150.25,
      previousClose: 148.50,
      change: 1.75,
      changePercent: 1.18,
      volume: 1000000,
      lastUpdated: new Date(),
    };

    it('should return true for valid stock', () => {
      expect(isStock(validStock)).toBe(true);
    });

    it('should return false for invalid stock', () => {
      expect(isStock({ ...validStock, currentPrice: 'invalid' })).toBe(false);
    });
  });

  describe('isTransaction', () => {
    const validTransaction = {
      id: '123',
      userId: 'user123',
      date: new Date(),
      amount: 100.50,
      description: 'Test transaction',
      category: TransactionCategory.FOOD,
      type: 'expense' as const,
      currency: 'USD',
    };

    it('should return true for valid transaction', () => {
      expect(isTransaction(validTransaction)).toBe(true);
    });

    it('should return false for invalid transaction', () => {
      expect(isTransaction({ ...validTransaction, amount: 'invalid' })).toBe(false);
    });
  });

  describe('isAPIResponse', () => {
    it('should return true for successful API response', () => {
      const response = {
        success: true,
        data: { test: 'data' },
        timestamp: new Date(),
      };
      expect(isAPIResponse(response)).toBe(true);
    });

    it('should return true for error API response', () => {
      const response = {
        success: false,
        error: { code: 'ERROR', message: 'Test error' },
        timestamp: new Date(),
      };
      expect(isAPIResponse(response)).toBe(true);
    });

    it('should return false for invalid API response', () => {
      const response = {
        success: true,
        // missing data
        timestamp: new Date(),
      };
      expect(isAPIResponse(response)).toBe(false);
    });
  });

  describe('isErrorResponse', () => {
    it('should return true for valid error response', () => {
      const response = {
        success: false,
        error: { code: 'ERROR', message: 'Test error' },
        timestamp: new Date(),
      };
      expect(isErrorResponse(response)).toBe(true);
    });

    it('should return false for success response', () => {
      const response = {
        success: true,
        data: { test: 'data' },
        timestamp: new Date(),
      };
      expect(isErrorResponse(response)).toBe(false);
    });
  });

  describe('Array type guards', () => {
    const validRate = {
      currency: 'EUR',
      rate: 1.18,
      change24h: 0.02,
      lastUpdated: new Date(),
    };

    it('should validate exchange rate arrays', () => {
      expect(isExchangeRateArray([validRate])).toBe(true);
      expect(isExchangeRateArray([validRate, { ...validRate, currency: 'GBP' }])).toBe(true);
      expect(isExchangeRateArray([validRate, { invalid: 'data' }])).toBe(false);
      expect(isExchangeRateArray([])).toBe(true);
    });
  });

  describe('Safe parsing utilities', () => {
    describe('safeParseDate', () => {
      it('should parse valid dates', () => {
        const date = new Date();
        expect(safeParseDate(date)).toBe(date);
        expect(safeParseDate('2023-01-01')).toBeInstanceOf(Date);
        expect(safeParseDate(1640995200000)).toBeInstanceOf(Date);
      });

      it('should return null for invalid dates', () => {
        expect(safeParseDate('invalid')).toBeNull();
        expect(safeParseDate({})).toBeNull();
        expect(safeParseDate(null)).toBeNull();
      });
    });

    describe('safeParseNumber', () => {
      it('should parse valid numbers', () => {
        expect(safeParseNumber(123)).toBe(123);
        expect(safeParseNumber('123.45')).toBe(123.45);
        expect(safeParseNumber(0)).toBe(0);
      });

      it('should return null for invalid numbers', () => {
        expect(safeParseNumber('invalid')).toBeNull();
        expect(safeParseNumber(NaN)).toBeNull();
        expect(safeParseNumber(Infinity)).toBeNull();
        expect(safeParseNumber({})).toBeNull();
      });
    });

    describe('safeParseString', () => {
      it('should parse valid strings', () => {
        expect(safeParseString('test')).toBe('test');
        expect(safeParseString(123)).toBe('123');
        expect(safeParseString(true)).toBe('true');
      });

      it('should return null for null/undefined', () => {
        expect(safeParseString(null)).toBeNull();
        expect(safeParseString(undefined)).toBeNull();
      });
    });
  });

  describe('Assertion functions', () => {
    const validUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      preferredCurrency: 'USD',
      portfolioSymbols: ['AAPL'],
    };

    it('should not throw for valid objects', () => {
      expect(() => assertIsUser(validUser)).not.toThrow();
    });

    it('should throw for invalid objects', () => {
      expect(() => assertIsUser({ invalid: 'data' })).toThrow('Invalid User object');
    });
  });
});