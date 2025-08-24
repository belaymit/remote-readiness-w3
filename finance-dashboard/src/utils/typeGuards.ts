import {
  User,
  FinancialSummary,
  ExchangeRate,
  Stock,
  Transaction,
  TransactionCategory,
  APIResponse,
  ErrorResponse,
} from "@/types";

// Type guards for runtime type checking

export function isUser(obj: unknown): obj is User {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj &&
    "preferredCurrency" in obj &&
    "portfolioSymbols" in obj &&
    typeof (obj as Record<string, unknown>).id === "string" &&
    typeof (obj as Record<string, unknown>).name === "string" &&
    typeof (obj as Record<string, unknown>).email === "string" &&
    typeof (obj as Record<string, unknown>).preferredCurrency === "string" &&
    Array.isArray((obj as Record<string, unknown>).portfolioSymbols) &&
    ((obj as Record<string, unknown>).portfolioSymbols as unknown[]).every(
      (symbol: unknown) => typeof symbol === "string"
    )
  );
}

export function isFinancialSummary(obj: unknown): obj is FinancialSummary {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "totalBalance" in obj &&
    "portfolioValue" in obj &&
    "monthlyIncome" in obj &&
    "monthlyExpenses" in obj &&
    "monthlyChange" in obj &&
    "currency" in obj &&
    "lastUpdated" in obj &&
    typeof (obj as Record<string, unknown>).totalBalance === "number" &&
    typeof (obj as Record<string, unknown>).portfolioValue === "number" &&
    typeof (obj as Record<string, unknown>).monthlyIncome === "number" &&
    typeof (obj as Record<string, unknown>).monthlyExpenses === "number" &&
    typeof (obj as Record<string, unknown>).monthlyChange === "number" &&
    typeof (obj as Record<string, unknown>).currency === "string" &&
    (obj as Record<string, unknown>).lastUpdated instanceof Date
  );
}

export function isExchangeRate(obj: any): obj is ExchangeRate {
  return (
    obj &&
    typeof obj.currency === "string" &&
    typeof obj.rate === "number" &&
    typeof obj.change24h === "number" &&
    obj.lastUpdated instanceof Date
  );
}

export function isStock(obj: any): obj is Stock {
  return (
    obj &&
    typeof obj.symbol === "string" &&
    typeof obj.name === "string" &&
    typeof obj.currentPrice === "number" &&
    typeof obj.previousClose === "number" &&
    typeof obj.change === "number" &&
    typeof obj.changePercent === "number" &&
    typeof obj.volume === "number" &&
    obj.lastUpdated instanceof Date
  );
}

export function isTransaction(obj: any): obj is Transaction {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.userId === "string" &&
    obj.date instanceof Date &&
    typeof obj.amount === "number" &&
    typeof obj.description === "string" &&
    Object.values(TransactionCategory).includes(obj.category) &&
    ["income", "expense", "transfer"].includes(obj.type) &&
    typeof obj.currency === "string"
  );
}

export function isAPIResponse<T>(obj: any): obj is APIResponse<T> {
  return (
    obj &&
    typeof obj.success === "boolean" &&
    obj.timestamp instanceof Date &&
    (obj.success ? obj.data !== undefined : obj.error !== undefined)
  );
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    obj &&
    obj.success === false &&
    obj.error &&
    typeof obj.error.code === "string" &&
    typeof obj.error.message === "string" &&
    obj.timestamp instanceof Date
  );
}

// Array type guards
export function isExchangeRateArray(obj: any): obj is ExchangeRate[] {
  return Array.isArray(obj) && obj.every(isExchangeRate);
}

export function isStockArray(obj: any): obj is Stock[] {
  return Array.isArray(obj) && obj.every(isStock);
}

export function isTransactionArray(obj: any): obj is Transaction[] {
  return Array.isArray(obj) && obj.every(isTransaction);
}

// Utility functions for safe type conversion
export function safeParseDate(value: any): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export function safeParseNumber(value: any): number | null {
  if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function safeParseString(value: any): string | null {
  if (typeof value === "string") return value;
  if (value != null) return String(value);
  return null;
}

// Validation helpers
export function assertIsUser(obj: any): asserts obj is User {
  if (!isUser(obj)) {
    throw new Error("Invalid User object");
  }
}

export function assertIsStock(obj: unknown): asserts obj is Stock {
  if (!isStock(obj)) {
    throw new Error("Invalid Stock object");
  }
}

export function assertIsTransaction(obj: unknown): asserts obj is Transaction {
  if (!isTransaction(obj)) {
    throw new Error("Invalid Transaction object");
  }
}
