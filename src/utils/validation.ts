import { TransactionCategory, Stock, Transaction, ExchangeRate } from '@/types';

// Validation utilities for type safety

export const isValidCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
  return validCurrencies.includes(currency.toUpperCase());
};

export const isValidStockSymbol = (symbol: string): boolean => {
  // Basic validation for stock symbols (1-5 uppercase letters)
  const symbolRegex = /^[A-Z]{1,5}$/;
  return symbolRegex.test(symbol);
};

export const isValidTransactionCategory = (category: string): category is TransactionCategory => {
  return Object.values(TransactionCategory).includes(category as TransactionCategory);
};

export const validateStock = (stock: Partial<Stock>): string[] => {
  const errors: string[] = [];
  
  if (!stock.symbol || !isValidStockSymbol(stock.symbol)) {
    errors.push('Invalid stock symbol');
  }
  
  if (!stock.name || stock.name.trim().length === 0) {
    errors.push('Stock name is required');
  }
  
  if (typeof stock.currentPrice !== 'number' || stock.currentPrice <= 0) {
    errors.push('Current price must be a positive number');
  }
  
  if (typeof stock.previousClose !== 'number' || stock.previousClose <= 0) {
    errors.push('Previous close must be a positive number');
  }
  
  return errors;
};

export const validateTransaction = (transaction: Partial<Transaction>): string[] => {
  const errors: string[] = [];
  
  if (!transaction.description || transaction.description.trim().length === 0) {
    errors.push('Transaction description is required');
  }
  
  if (typeof transaction.amount !== 'number') {
    errors.push('Transaction amount must be a number');
  }
  
  if (!transaction.category || !isValidTransactionCategory(transaction.category)) {
    errors.push('Valid transaction category is required');
  }
  
  if (!transaction.type || !['income', 'expense', 'transfer'].includes(transaction.type)) {
    errors.push('Valid transaction type is required');
  }
  
  if (!transaction.date || !(transaction.date instanceof Date)) {
    errors.push('Valid transaction date is required');
  }
  
  return errors;
};

export const validateExchangeRate = (rate: Partial<ExchangeRate>): string[] => {
  const errors: string[] = [];
  
  if (!rate.currency || !isValidCurrency(rate.currency)) {
    errors.push('Valid currency code is required');
  }
  
  if (typeof rate.rate !== 'number' || rate.rate <= 0) {
    errors.push('Exchange rate must be a positive number');
  }
  
  if (typeof rate.change24h !== 'number') {
    errors.push('24h change must be a number');
  }
  
  if (!rate.lastUpdated || !(rate.lastUpdated instanceof Date)) {
    errors.push('Valid last updated date is required');
  }
  
  return errors;
};

// Utility functions for formatting
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};