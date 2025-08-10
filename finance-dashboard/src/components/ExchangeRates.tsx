'use client';

import { useState } from 'react';
import { ExchangeRatesProps } from '@/types';

export function ExchangeRates({ 
  baseCurrency, 
  rates, 
  lastUpdated, 
  loading = false, 
  onCurrencyChange 
}: ExchangeRatesProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    onCurrencyChange(currency);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatRate = (rate: number) => {
    return rate.toFixed(4);
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Exchange Rates</h3>
        <select
          value={selectedCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>

      <div className="space-y-3">
        {rates.map((rate) => (
          <div key={rate.currency} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {rate.currency}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{rate.currency}</p>
                <p className="text-xs text-gray-500">
                  1 {selectedCurrency} = {formatRate(rate.rate)} {rate.currency}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatRate(rate.rate)}</p>
              {formatChange(rate.change24h)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}