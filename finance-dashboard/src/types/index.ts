// Core data models for the Personal Finance Dashboard

export interface User {
  id: string;
  name: string;
  email: string;
  preferredCurrency: string;
  portfolioSymbols: string[];
}

export interface FinancialSummary {
  totalBalance: number;
  portfolioValue: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyChange: number;
  currency: string;
  lastUpdated: Date;
}

export interface ExchangeRate {
  currency: string;
  rate: number;
  change24h: number;
  lastUpdated: Date;
}

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  date: Date;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: 'income' | 'expense' | 'transfer';
  currency: string;
}

export enum TransactionCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  INVESTMENT = 'investment',
  OTHER = 'other'
}

// Component Props Interfaces
export interface DashboardHeaderProps {
  user?: User;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export interface FinancialSummaryProps {
  summary: FinancialSummary | null;
  loading?: boolean;
}

export interface ExchangeRatesProps {
  baseCurrency: string;
  rates: ExchangeRate[];
  lastUpdated: Date;
  loading?: boolean;
  onCurrencyChange: (currency: string) => void;
}

export interface PortfolioProps {
  stocks: Stock[];
  loading?: boolean;
  onAddStock: (symbol: string) => void;
  onRemoveStock: (symbol: string) => void;
}

export interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
}

export interface TransactionFilters {
  category?: TransactionCategory;
  type?: 'income' | 'expense' | 'transfer';
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// Error Types
export enum ErrorCodes {
  EXTERNAL_API_FAILURE = 'EXTERNAL_API_FAILURE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_CURRENCY = 'INVALID_CURRENCY',
  INVALID_STOCK_SYMBOL = 'INVALID_STOCK_SYMBOL',
  CACHE_MISS = 'CACHE_MISS',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: Date;
}