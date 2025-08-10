import { FinancialSummary, ExchangeRate, Stock, Transaction, TransactionCategory } from '@/types';

// Mock Financial Summary
export const mockFinancialSummary: FinancialSummary = {
  totalBalance: 45750.25,
  portfolioValue: 28500.00,
  monthlyIncome: 8500.00,
  monthlyExpenses: 3200.75,
  monthlyChange: 2.4,
  currency: 'USD',
  lastUpdated: new Date(),
};

// Mock Exchange Rates
export const mockExchangeRates: ExchangeRate[] = [
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

// Mock Stocks
export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.43,
    previousClose: 172.89,
    change: 2.54,
    changePercent: 1.47,
    volume: 45678900,
    lastUpdated: new Date(),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 2847.92,
    previousClose: 2834.56,
    change: 13.36,
    changePercent: 0.47,
    volume: 1234567,
    lastUpdated: new Date(),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 378.85,
    previousClose: 381.23,
    change: -2.38,
    changePercent: -0.62,
    volume: 23456789,
    lastUpdated: new Date(),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 248.67,
    previousClose: 245.12,
    change: 3.55,
    changePercent: 1.45,
    volume: 34567890,
    lastUpdated: new Date(),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
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
  {
    id: '6',
    userId: 'user1',
    date: new Date('2025-01-03'),
    amount: 2500.00,
    description: 'Stock Investment - AAPL',
    category: TransactionCategory.INVESTMENT,
    type: 'transfer',
    currency: 'USD',
  },
  {
    id: '7',
    userId: 'user1',
    date: new Date('2025-01-02'),
    amount: -67.89,
    description: 'Restaurant Dinner',
    category: TransactionCategory.FOOD,
    type: 'expense',
    currency: 'USD',
  },
  {
    id: '8',
    userId: 'user1',
    date: new Date('2025-01-01'),
    amount: -150.00,
    description: 'Electric Bill',
    category: TransactionCategory.UTILITIES,
    type: 'expense',
    currency: 'USD',
  },
];