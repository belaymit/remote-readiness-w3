'use client';

import { useState } from 'react';
import { TransactionListProps, TransactionCategory } from '@/types';

export function RecentTransactions({ 
  transactions, 
  loading = false, 
  filters, 
  onFilterChange 
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({ ...filters, searchTerm: value });
  };

  const handleCategoryFilter = (category: TransactionCategory | undefined) => {
    onFilterChange({ ...filters, category });
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));

    return (
      <span className={`font-medium ${
        type === 'income' ? 'text-green-600' : 
        type === 'expense' ? 'text-red-600' : 
        'text-blue-600'
      }`}>
        {type === 'income' ? '+' : type === 'expense' ? '-' : ''}{formatted}
      </span>
    );
  };

  const getCategoryIcon = (category: TransactionCategory) => {
    const icons = {
      [TransactionCategory.FOOD]: '🍽️',
      [TransactionCategory.TRANSPORT]: '🚗',
      [TransactionCategory.ENTERTAINMENT]: '🎬',
      [TransactionCategory.UTILITIES]: '⚡',
      [TransactionCategory.SALARY]: '💼',
      [TransactionCategory.INVESTMENT]: '📈',
      [TransactionCategory.OTHER]: '📝',
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category: TransactionCategory) => {
    const colors = {
      [TransactionCategory.FOOD]: 'bg-orange-100 text-orange-800',
      [TransactionCategory.TRANSPORT]: 'bg-blue-100 text-blue-800',
      [TransactionCategory.ENTERTAINMENT]: 'bg-purple-100 text-purple-800',
      [TransactionCategory.UTILITIES]: 'bg-yellow-100 text-yellow-800',
      [TransactionCategory.SALARY]: 'bg-green-100 text-green-800',
      [TransactionCategory.INVESTMENT]: 'bg-indigo-100 text-indigo-800',
      [TransactionCategory.OTHER]: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <div className="text-sm text-gray-500">
          {transactions.length} transactions
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search transactions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter(undefined)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !filters.category 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {Object.values(TransactionCategory).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.category === category
                  ? getCategoryColor(category)
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category)} {category}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions found.</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">
                    {getCategoryIcon(transaction.category)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {formatAmount(transaction.amount, transaction.type)}
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total shown:</span>
            <span className="font-medium text-gray-900">
              {transactions.length} transactions
            </span>
          </div>
        </div>
      )}
    </div>
  );
}