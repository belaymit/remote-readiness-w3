"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DashboardHeader,
  FinancialSummary,
  ExchangeRates,
  Portfolio,
  RecentTransactions,
} from "@/components";
import { apiService } from "@/services/api";
import {
  TransactionFilters,
  Stock,
  FinancialSummary as FinancialSummaryType,
  ExchangeRate,
  Transaction,
} from "@/types";

export default function Dashboard() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [transactionFilters, setTransactionFilters] =
    useState<TransactionFilters>({});
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummaryType | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const [dashboardData, portfolioData] = await Promise.all([
        apiService.getDashboard(),
        stocks.length > 0
          ? apiService.getPortfolio(stocks.map((s) => s.symbol))
          : Promise.resolve([]),
      ]);

      setFinancialSummary(dashboardData.summary);
      setExchangeRates(dashboardData.exchangeRates);
      setTransactions(dashboardData.recentTransactions);

      if (portfolioData.length > 0) {
        setStocks(portfolioData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep existing data on error
    }
  }, [stocks]);

  // Refresh data function
  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardData();

      // Also refresh exchange rates for current base currency
      if (baseCurrency !== "USD") {
        const rates = await apiService.getExchangeRates(baseCurrency);
        setExchangeRates(rates);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchDashboardData, baseCurrency]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await fetchDashboardData();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchDashboardData]);

  const handleCurrencyChange = async (currency: string) => {
    setBaseCurrency(currency);
    try {
      const rates = await apiService.getExchangeRates(currency);
      setExchangeRates(rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const handleAddStock = async (symbol: string) => {
    try {
      const newStock = await apiService.getStock(symbol);
      setStocks((prev) => [...prev, newStock]);
    } catch (error) {
      console.error(`Error adding stock ${symbol}:`, error);
      // Fallback to mock data if API fails
      const mockStock: Stock = {
        symbol,
        name: `${symbol} Inc.`,
        currentPrice: Math.random() * 200 + 50,
        previousClose: Math.random() * 200 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 10000000),
        lastUpdated: new Date(),
      };
      setStocks((prev) => [...prev, mockStock]);
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setStocks((prev) => prev.filter((stock) => stock.symbol !== symbol));
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Apply category filter
    if (
      transactionFilters.category &&
      transaction.category !== transactionFilters.category
    ) {
      return false;
    }

    // Apply search term filter
    if (
      transactionFilters.searchTerm &&
      transactionFilters.searchTerm.trim() !== ""
    ) {
      const searchLower = transactionFilters.searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Summary Cards */}
        <div className="mb-8">
          <FinancialSummary summary={financialSummary} loading={isLoading} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Exchange Rates */}
          <div className="lg:col-span-1">
            <ExchangeRates
              baseCurrency={baseCurrency}
              rates={exchangeRates}
              lastUpdated={
                exchangeRates.length > 0
                  ? exchangeRates[0].lastUpdated
                  : new Date()
              }
              loading={isLoading}
              onCurrencyChange={handleCurrencyChange}
            />
          </div>

          {/* Middle Column - Portfolio */}
          <div className="lg:col-span-1">
            <Portfolio
              stocks={stocks}
              loading={isLoading}
              onAddStock={handleAddStock}
              onRemoveStock={handleRemoveStock}
            />
          </div>

          {/* Right Column - Recent Transactions */}
          <div className="lg:col-span-1">
            <RecentTransactions
              transactions={filteredTransactions}
              loading={isLoading}
              filters={transactionFilters}
              onFilterChange={setTransactionFilters}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
