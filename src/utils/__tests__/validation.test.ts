import {
  isValidCurrency,
  isValidStockSymbol,
  isValidTransactionCategory,
  validateStock,
  validateTransaction,
  validateExchangeRate,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
} from "../validation";
import { TransactionCategory, Stock, Transaction, ExchangeRate } from "@/types";

describe("Frontend Validation Utilities", () => {
  describe("isValidCurrency", () => {
    it("should return true for supported currencies", () => {
      expect(isValidCurrency("USD")).toBe(true);
      expect(isValidCurrency("EUR")).toBe(true);
      expect(isValidCurrency("GBP")).toBe(true);
      expect(isValidCurrency("usd")).toBe(true); // case insensitive
    });

    it("should return false for unsupported currencies", () => {
      expect(isValidCurrency("XYZ")).toBe(false);
      expect(isValidCurrency("")).toBe(false);
      expect(isValidCurrency("INVALID")).toBe(false);
    });
  });

  describe("isValidStockSymbol", () => {
    it("should return true for valid stock symbols", () => {
      expect(isValidStockSymbol("AAPL")).toBe(true);
      expect(isValidStockSymbol("MSFT")).toBe(true);
      expect(isValidStockSymbol("GOOGL")).toBe(true);
      expect(isValidStockSymbol("A")).toBe(true);
      expect(isValidStockSymbol("TSLA")).toBe(true);
    });

    it("should return false for invalid stock symbols", () => {
      expect(isValidStockSymbol("TOOLONG")).toBe(false); // too long
      expect(isValidStockSymbol("123")).toBe(false); // numbers
      expect(isValidStockSymbol("")).toBe(false); // empty
      expect(isValidStockSymbol("aapl")).toBe(false); // lowercase
      expect(isValidStockSymbol("AA-PL")).toBe(false); // special chars
    });
  });

  describe("isValidTransactionCategory", () => {
    it("should return true for valid categories", () => {
      expect(isValidTransactionCategory(TransactionCategory.FOOD)).toBe(true);
      expect(isValidTransactionCategory(TransactionCategory.TRANSPORT)).toBe(
        true
      );
      expect(isValidTransactionCategory(TransactionCategory.SALARY)).toBe(true);
      expect(isValidTransactionCategory(TransactionCategory.INVESTMENT)).toBe(
        true
      );
    });

    it("should return false for invalid categories", () => {
      expect(isValidTransactionCategory("invalid")).toBe(false);
      expect(isValidTransactionCategory("")).toBe(false);
      expect(isValidTransactionCategory("FOOD")).toBe(false); // wrong case
    });
  });

  describe("validateStock", () => {
    const validStock: Stock = {
      symbol: "AAPL",
      name: "Apple Inc.",
      currentPrice: 150.25,
      previousClose: 148.5,
      change: 1.75,
      changePercent: 1.18,
      volume: 1000000,
      lastUpdated: new Date(),
    };

    it("should return no errors for valid stock", () => {
      const errors = validateStock(validStock);
      expect(errors).toHaveLength(0);
    });

    it("should return error for invalid symbol", () => {
      const errors = validateStock({ ...validStock, symbol: "invalid" });
      expect(errors).toContain("Invalid stock symbol");
    });

    it("should return error for missing name", () => {
      const errors = validateStock({ ...validStock, name: "" });
      expect(errors).toContain("Stock name is required");
    });

    it("should return error for invalid current price", () => {
      const errors = validateStock({ ...validStock, currentPrice: -10 });
      expect(errors).toContain("Current price must be a positive number");
    });

    it("should return error for invalid previous close", () => {
      const errors = validateStock({ ...validStock, previousClose: 0 });
      expect(errors).toContain("Previous close must be a positive number");
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const errors = validateStock({
        symbol: "invalid",
        name: "",
        currentPrice: -10,
        previousClose: 0,
      });
      expect(errors).toHaveLength(4);
    });
  });

  describe("validateTransaction", () => {
    const validTransaction: Transaction = {
      id: "1",
      userId: "user1",
      date: new Date(),
      amount: 100.5,
      description: "Test transaction",
      category: TransactionCategory.FOOD,
      type: "expense",
      currency: "USD",
    };

    it("should return no errors for valid transaction", () => {
      const errors = validateTransaction(validTransaction);
      expect(errors).toHaveLength(0);
    });

    it("should return error for missing description", () => {
      const errors = validateTransaction({
        ...validTransaction,
        description: "",
      });
      expect(errors).toContain("Transaction description is required");
    });

    it("should return error for invalid amount", () => {
      const errors = validateTransaction({
        ...validTransaction,
        amount: "invalid" as any,
      });
      expect(errors).toContain("Transaction amount must be a number");
    });

    it("should return error for invalid category", () => {
      const errors = validateTransaction({
        ...validTransaction,
        category: "invalid" as any,
      });
      expect(errors).toContain("Valid transaction category is required");
    });

    it("should return error for invalid type", () => {
      const errors = validateTransaction({
        ...validTransaction,
        type: "invalid" as any,
      });
      expect(errors).toContain("Valid transaction type is required");
    });

    it("should return error for invalid date", () => {
      const errors = validateTransaction({
        ...validTransaction,
        date: "invalid" as any,
      });
      expect(errors).toContain("Valid transaction date is required");
    });
  });

  describe("validateExchangeRate", () => {
    const validRate: ExchangeRate = {
      currency: "EUR",
      rate: 1.18,
      change24h: 0.02,
      lastUpdated: new Date(),
    };

    it("should return no errors for valid exchange rate", () => {
      const errors = validateExchangeRate(validRate);
      expect(errors).toHaveLength(0);
    });

    it("should return error for invalid currency", () => {
      const errors = validateExchangeRate({
        ...validRate,
        currency: "INVALID",
      });
      expect(errors).toContain("Valid currency code is required");
    });

    it("should return error for invalid rate", () => {
      const errors = validateExchangeRate({ ...validRate, rate: -1 });
      expect(errors).toContain("Exchange rate must be a positive number");
    });

    it("should return error for invalid change24h", () => {
      const errors = validateExchangeRate({
        ...validRate,
        change24h: "invalid" as any,
      });
      expect(errors).toContain("24h change must be a number");
    });

    it("should return error for invalid lastUpdated", () => {
      const errors = validateExchangeRate({
        ...validRate,
        lastUpdated: "invalid" as unknown,
      });
      expect(errors).toContain("Valid last updated date is required");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency with default USD", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format currency with specified currency", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
    });

    it("should handle zero amount", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should handle negative amounts", () => {
      expect(formatCurrency(-100.5)).toBe("-$100.50");
    });
  });

  describe("formatPercentage", () => {
    it("should format positive percentage with plus sign", () => {
      expect(formatPercentage(2.5)).toBe("+2.50%");
    });

    it("should format negative percentage", () => {
      expect(formatPercentage(-1.25)).toBe("-1.25%");
    });

    it("should format zero percentage", () => {
      expect(formatPercentage(0)).toBe("+0.00%");
    });

    it("should respect decimal places", () => {
      expect(formatPercentage(2.5678, 1)).toBe("+2.6%");
      expect(formatPercentage(2.5678, 3)).toBe("+2.568%");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2023-12-25T12:00:00");
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
    });
  });

  describe("formatDateTime", () => {
    it("should format date and time correctly", () => {
      const date = new Date("2023-12-25T15:30:00");
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
      expect(formatted).toMatch(/3:30 PM/);
    });
  });
});
