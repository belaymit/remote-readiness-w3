'use client';

import { useState, useEffect } from 'react';
import { DashboardHeaderProps } from '@/types';

export function DashboardHeader({ user, onRefresh, isRefreshing }: DashboardHeaderProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('--:--:--');

  useEffect(() => {
    // Update timestamp on client side only
    setLastUpdated(new Date().toLocaleTimeString());
    
    // Update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Personal Finance Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              {user ? `Welcome back, ${user.name}` : 'Track your finances in real-time'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </div>
            
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
            >
              {isRefreshing && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}