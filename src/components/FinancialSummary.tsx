'use client';

import { FinancialSummaryProps } from '@/types';

export function FinancialSummary({ summary, loading = false }: FinancialSummaryProps) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: summary.currency || 'USD',
    }).format(amount);
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Balance */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalBalance)}
            </p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg">💰</span>
          </div>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.portfolioValue)}
            </p>
            {formatChange(summary.monthlyChange)}
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-lg">📈</span>
          </div>
        </div>
      </div>

      {/* Monthly Income */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.monthlyIncome)}
            </p>
          </div>
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 text-lg">💵</span>
          </div>
        </div>
      </div>

      {/* Monthly Expenses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.monthlyExpenses)}
            </p>
          </div>
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-lg">💸</span>
          </div>
        </div>
      </div>
    </div>
  );
}