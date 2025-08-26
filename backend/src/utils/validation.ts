import { TransactionCategory, ErrorCodes } from '../types';

// Currency validation
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

export function isValidCurrency(currency: string): boolean {
  return SUPPORTED_CURRENCIES.includes(currency.toUpperCase());
}

// Stock symbol validation
export function isValidStockSymbol(symbol: string): boolean {
  // Basic validation: 1-5 uppercase letters (must be already uppercase)
  const symbolRegex = /^[A-Z]{1,5}$/;
  return symbolRegex.test(symbol);
}

// Transaction category validation
export function isValidTransactionCategory(category: string): category is TransactionCategory {
  return Object.values(TransactionCategory).includes(category as TransactionCategory);
}

// Amount validation
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && !isNaN(amount) && isFinite(amount);
}

// Date validation
export function isValidDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation error creator
export function createValidationError(field: string, message: string) {
  return {
    code: ErrorCodes.VALIDATION_ERROR,
    message: `Validation failed for ${field}: ${message}`,
    details: { field, message }
  };
}

// Type guards
export function isTransaction(obj: any): obj is import('../types').Transaction {
  if (!obj || obj === null || obj === undefined) {
    return false;
  }
  return (
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    isValidDate(obj.date) &&
    isValidAmount(obj.amount) &&
    typeof obj.description === 'string' &&
    isValidTransactionCategory(obj.category) &&
    ['income', 'expense', 'transfer'].includes(obj.type) &&
    isValidCurrency(obj.currency)
  );
}

export function isStock(obj: any): obj is import('../types').Stock {
  if (!obj || obj === null || obj === undefined) {
    return false;
  }
  return (
    typeof obj.symbol === 'string' &&
    typeof obj.name === 'string' &&
    isValidAmount(obj.currentPrice) &&
    isValidAmount(obj.previousClose) &&
    isValidAmount(obj.change) &&
    isValidAmount(obj.changePercent) &&
    typeof obj.volume === 'number' &&
    isValidDate(obj.lastUpdated)
  );
}

export function isExchangeRate(obj: any): obj is import('../types').ExchangeRate {
  if (!obj || obj === null || obj === undefined) {
    return false;
  }
  return (
    isValidCurrency(obj.currency) &&
    isValidAmount(obj.rate) &&
    isValidAmount(obj.change24h) &&
    isValidDate(obj.lastUpdated)
  );
}