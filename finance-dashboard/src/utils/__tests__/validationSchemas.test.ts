import {
  userValidationSchema,
  transactionValidationSchema,
  stockValidationSchema,
  validateBatch,
  getAllErrors,
  getAllWarnings,
} from '../validationSchemas';
import { TransactionCategory } from '@/types';

describe('Validation Schemas', () => {
  describe('userValidationSchema', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      preferredCurrency: 'USD',
      portfolioSymbols: ['AAPL', 'GOOGL'],
    };

    it('should validate a valid user', () => {
      const result = userValidationSchema.validate(validUser);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject user with missing name', () => {
      const result = userValidationSchema.validate({ ...validUser, name: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should reject user with short name', () => {
      const result = userValidationSchema.validate({ ...validUser, name: 'A' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters long');
    });

    it('should reject user with invalid email', () => {
      const result = userValidationSchema.validate({ ...validUser, email: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should reject user with invalid currency', () => {
      const result = userValidationSchema.validate({ ...validUser, preferredCurrency: 'INVALID' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid currency code');
    });

    it('should reject user with invalid stock symbols', () => {
      const result = userValidationSchema.validate({ 
        ...validUser, 
        portfolioSymbols: ['AAPL', 'invalid'] 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid stock symbol: invalid');
    });

    it('should warn about too many portfolio symbols', () => {
      const manySymbols = Array(25).fill('AAPL');
      const result = userValidationSchema.validate({ 
        ...validUser, 
        portfolioSymbols: manySymbols 
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Consider limiting portfolio to 20 symbols for better performance');
    });

    it('should validate individual fields', () => {
      const result = userValidationSchema.validateField('email', 'invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });
  });

  describe('transactionValidationSchema', () => {
    const validTransaction = {
      amount: 100.50,
      description: 'Test transaction',
      category: TransactionCategory.FOOD,
      type: 'expense' as const,
      date: new Date(),
      currency: 'USD',
    };

    it('should validate a valid transaction', () => {
      const result = transactionValidationSchema.validate(validTransaction);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject transaction with missing amount', () => {
      const { amount, ...invalid } = validTransaction;
      const result = transactionValidationSchema.validate(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount is required');
    });

    it('should reject transaction with invalid amount', () => {
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        amount: NaN 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be a valid number');
    });

    it('should reject transaction with short description', () => {
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        description: 'Hi' 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be at least 3 characters long');
    });

    it('should reject transaction with invalid category', () => {
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        category: 'invalid' as any 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid transaction category');
    });

    it('should reject transaction with invalid type', () => {
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        type: 'invalid' as any 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid transaction type');
    });

    it('should reject transaction with invalid date', () => {
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        date: new Date('invalid') 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid date');
    });

    it('should warn about large amounts', () => {
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        amount: 2000000 
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Large transaction amount detected');
    });

    it('should warn about future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      
      const result = transactionValidationSchema.validate({ 
        ...validTransaction, 
        date: futureDate 
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Transaction date is more than a year in the future');
    });
  });

  describe('stockValidationSchema', () => {
    const validStock = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 150.25,
      previousClose: 148.50,
      volume: 1000000,
    };

    it('should validate a valid stock', () => {
      const result = stockValidationSchema.validate(validStock);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject stock with invalid symbol', () => {
      const result = stockValidationSchema.validate({ 
        ...validStock, 
        symbol: 'invalid' 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid stock symbol format (1-5 uppercase letters)');
    });

    it('should reject stock with missing name', () => {
      const result = stockValidationSchema.validate({ 
        ...validStock, 
        name: '' 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stock name is required');
    });

    it('should reject stock with invalid current price', () => {
      const result = stockValidationSchema.validate({ 
        ...validStock, 
        currentPrice: -10 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Current price must be a positive number');
    });

    it('should reject stock with invalid previous close', () => {
      const result = stockValidationSchema.validate({ 
        ...validStock, 
        previousClose: 0 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Previous close must be a positive number');
    });

    it('should reject stock with negative volume', () => {
      const result = stockValidationSchema.validate({ 
        ...validStock, 
        volume: -1000 
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Volume must be a non-negative number');
    });

    it('should warn about high stock prices', () => {
      const result = stockValidationSchema.validate({ 
        ...validStock, 
        currentPrice: 15000 
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('High stock price detected');
    });
  });

  describe('Utility functions', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      preferredCurrency: 'USD',
      portfolioSymbols: ['AAPL'],
    };

    const invalidUser = {
      name: '',
      email: 'invalid-email',
      preferredCurrency: 'INVALID',
      portfolioSymbols: ['invalid'],
    };

    describe('validateBatch', () => {
      it('should validate multiple items', () => {
        const { results, overallValid } = validateBatch(
          userValidationSchema,
          [validUser, invalidUser]
        );

        expect(results).toHaveLength(2);
        expect(results[0].isValid).toBe(true);
        expect(results[1].isValid).toBe(false);
        expect(overallValid).toBe(false);
      });

      it('should return true for all valid items', () => {
        const { overallValid } = validateBatch(
          userValidationSchema,
          [validUser, validUser]
        );

        expect(overallValid).toBe(true);
      });
    });

    describe('getAllErrors', () => {
      it('should collect all errors from multiple results', () => {
        const results = [
          { isValid: false, errors: ['Error 1', 'Error 2'] },
          { isValid: false, errors: ['Error 3'] },
          { isValid: true, errors: [] },
        ];

        const allErrors = getAllErrors(results);
        expect(allErrors).toEqual(['Error 1', 'Error 2', 'Error 3']);
      });
    });

    describe('getAllWarnings', () => {
      it('should collect all warnings from multiple results', () => {
        const results = [
          { isValid: true, errors: [], warnings: ['Warning 1'] },
          { isValid: true, errors: [], warnings: ['Warning 2', 'Warning 3'] },
          { isValid: true, errors: [] },
        ];

        const allWarnings = getAllWarnings(results);
        expect(allWarnings).toEqual(['Warning 1', 'Warning 2', 'Warning 3']);
      });
    });
  });
});