import axios from "axios";
import {
  ExchangeRate,
  Stock,
  Transaction,
  TransactionFilters,
  FinancialSummary,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API response wrapper
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: Date;
}

// API service class
class ApiService {
  // Get exchange rates
  async getExchangeRates(
    baseCurrency: string = "USD"
  ): Promise<ExchangeRate[]> {
    try {
      const response = await api.get<APIResponse<ExchangeRate[]>>(
        `/api/exchange-rates?base=${baseCurrency}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(
        response.data.error?.message || "Failed to fetch exchange rates"
      );
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      throw error;
    }
  }

  // Get portfolio data
  async getPortfolio(symbols: string[]): Promise<Stock[]> {
    try {
      const symbolsParam = symbols.join(",");
      const response = await api.get<APIResponse<Stock[]>>(
        `/api/portfolio?symbols=${symbolsParam}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(
        response.data.error?.message || "Failed to fetch portfolio data"
      );
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      throw error;
    }
  }

  // Get individual stock data
  async getStock(symbol: string): Promise<Stock> {
    try {
      const response = await api.get<APIResponse<Stock>>(
        `/api/stock/${symbol}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(
        response.data.error?.message || "Failed to fetch stock data"
      );
    } catch (error) {
      console.error(`Error fetching stock ${symbol}:`, error);
      throw error;
    }
  }

  // Get transactions
  async getTransactions(
    filters: TransactionFilters = {}
  ): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.type) params.append("type", filters.type);
      if (filters.searchTerm) params.append("search", filters.searchTerm);
      if (filters.dateFrom)
        params.append("dateFrom", filters.dateFrom.toISOString());
      if (filters.dateTo) params.append("dateTo", filters.dateTo.toISOString());

      const response = await api.get<APIResponse<Transaction[]>>(
        `/api/transactions?${params.toString()}`
      );

      if (response.data.success && response.data.data) {
        // Convert date strings back to Date objects
        return response.data.data.map((transaction) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
      }

      throw new Error(
        response.data.error?.message || "Failed to fetch transactions"
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  // Get complete dashboard data
  async getDashboard(): Promise<{
    summary: FinancialSummary;
    exchangeRates: ExchangeRate[];
    recentTransactions: Transaction[];
  }> {
    try {
      const response = await api.get<
        APIResponse<{
          summary: FinancialSummary;
          exchangeRates: ExchangeRate[];
          recentTransactions: Transaction[];
        }>
      >("/api/dashboard");

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        // Convert date strings back to Date objects
        return {
          ...data,
          summary: {
            ...data.summary,
            lastUpdated: new Date(data.summary.lastUpdated),
          },
          exchangeRates: data.exchangeRates.map((rate) => ({
            ...rate,
            lastUpdated: new Date(rate.lastUpdated),
          })),
          recentTransactions: data.recentTransactions.map((transaction) => ({
            ...transaction,
            date: new Date(transaction.date),
          })),
        };
      }

      throw new Error(
        response.data.error?.message || "Failed to fetch dashboard data"
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get("/health");
      return response.data.success === true;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
