import {
  isValidCurrency,
  isValidStockSymbol,
  isValidTransactionCategory,
  isValidAmount,
  isValidDate,
  isValidEmail,
  SUPPORTED_CURRENCIES
} from '../validation';
import { TransactionCategory } from '../../types';

describe('Validation Utilities', () => {
  describe('isValidCurrency', () => {
    it('should return true for supported currencies', () => {
      expect(isValidCurrency('USD')).toBe(true);
      expect(isValidCurrency('EUR')).toBe(true);
      expect(isValidCurrency('usd')).toBe(true); // case insensitive
    });

    it('should return false for unsupported currencies', () => {
      expect(isValidCurrency('XYZ')).toBe(false);
      expect(isValidCurrency('')).toBe(false);
    });
  });

  describe('isValidStockSymbol', () => {
    it('should return true for valid stock symbols', () => {
      expect(isValidStockSymbol('AAPL')).toBe(true);
      expect(isValidStockSymbol('MSFT')).toBe(true);
      expect(isValidStockSymbol('A')).toBe(true);
    });

    it('should return false for invalid stock symbols', () => {
      expect(isValidStockSymbol('TOOLONG')).toBe(false);
      expect(isValidStockSymbol('123')).toBe(false);
      expect(isValidStockSymbol('')).toBe(false);
      expect(isValidStockSymbol('aapl')).toBe(false); // lowercase
    });
  });

  describe('isValidTransactionCategory', () => {
    it('should return true for valid categories', () => {
      expect(isValidTransactionCategory(TransactionCategory.FOOD)).toBe(true);
      expect(isValidTransactionCategory(TransactionCategory.SALARY)).toBe(true);
    });

    it('should return false for invalid categories', () => {
      expect(isValidTransactionCategory('invalid')).toBe(false);
      expect(isValidTransactionCategory('')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should return true for valid amounts', () => {
      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(0)).toBe(true);
      expect(isValidAmount(-50)).toBe(true);
      expect(isValidAmount(123.45)).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(isValidAmount(NaN)).toBe(false);
      expect(isValidAmount(Infinity)).toBe(false);
      expect(isValidAmount(-Infinity)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2023-01-01')).toBe(true);
      expect(isValidDate('2023-12-31T23:59:59Z')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('')).toBe(false);
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });
});