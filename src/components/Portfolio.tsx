"use client";

import { useState } from "react";
import { PortfolioProps } from "@/types";

export function Portfolio({
  stocks,
  loading = false,
  onAddStock,
  onRemoveStock,
}: PortfolioProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddStock = async () => {
    if (!searchTerm.trim()) return;

    setIsAdding(true);
    try {
      await onAddStock(searchTerm.toUpperCase());
      setSearchTerm("");
    } catch (error) {
      console.error("Failed to add stock:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Filter stocks based on search term
  const filteredStocks = stocks.filter((stock) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      stock.symbol.toLowerCase().includes(search) ||
      stock.name.toLowerCase().includes(search)
    );
  });

  // Always show add button when there's text
  const showAddButton = searchTerm.trim();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <div
        className={`text-right ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        <p className="font-medium">
          {isPositive ? "+" : ""}
          {formatPrice(change)}
        </p>
        <p className="text-xs">
          ({isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%)
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
        <div className="text-sm text-gray-500">{stocks.length} stocks</div>
      </div>

      {/* Search/Add Stock Form */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stocks or add new symbol (e.g., AAPL)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) =>
              e.key === "Enter" && showAddButton && handleAddStock()
            }
          />
          {showAddButton && (
            <button
              onClick={handleAddStock}
              disabled={isAdding || !searchTerm.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
          )}
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {stocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No stocks in your portfolio yet.</p>
            <p className="text-sm">Add a stock symbol above to get started.</p>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No stocks found matching &quot;{searchTerm}&quot;.</p>
            <p className="text-sm">
              Try a different search term or add this as a new stock.
            </p>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{stock.symbol}</p>
                  <p className="text-sm text-gray-500">{stock.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {formatChange(stock.change, stock.changePercent)}
                <button
                  onClick={() => onRemoveStock(stock.symbol)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove stock"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {stocks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Portfolio Value:</span>
            <span className="font-medium text-gray-900">
              {formatPrice(
                stocks.reduce((sum, stock) => sum + stock.currentPrice, 0)
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
