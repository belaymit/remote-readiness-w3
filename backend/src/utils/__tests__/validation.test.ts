import {
  isValidCurrency,
  isValidStockSymbol,
  isValidTransactionCategory,
  isValidAmount,
  isValidDate,
  isValidEmail,
  createValidationError,
  isTransaction,
  isStock,
  isExchangeRate,
  SUPPORTED_CURRENCIES,
} from "../validation";
import { TransactionCategory, ErrorCodes } from "../../types";

describe("Validation Utilities", () => {
  describe("isValidCurrency", () => {
    it("should return true for supported currencies", () => {
      expect(isValidCurrency("USD")).toBe(true);
      expect(isValidCurrency("EUR")).toBe(true);
      expect(isValidCurrency("usd")).toBe(true); // case insensitive
    });

    it("should return false for unsupported currencies", () => {
      expect(isValidCurrency("XYZ")).toBe(false);
      expect(isValidCurrency("")).toBe(false);
    });
  });

  describe("isValidStockSymbol", () => {
    it("should return true for valid stock symbols", () => {
      expect(isValidStockSymbol("AAPL")).toBe(true);
      expect(isValidStockSymbol("MSFT")).toBe(true);
      expect(isValidStockSymbol("A")).toBe(true);
    });

    it("should return false for invalid stock symbols", () => {
      expect(isValidStockSymbol("TOOLONG")).toBe(false);
      expect(isValidStockSymbol("123")).toBe(false);
      expect(isValidStockSymbol("")).toBe(false);
      expect(isValidStockSymbol("aapl")).toBe(false); // lowercase
    });
  });

  describe("isValidTransactionCategory", () => {
    it("should return true for valid categories", () => {
      expect(isValidTransactionCategory(TransactionCategory.FOOD)).toBe(true);
      expect(isValidTransactionCategory(TransactionCategory.SALARY)).toBe(true);
    });

    it("should return false for invalid categories", () => {
      expect(isValidTransactionCategory("invalid")).toBe(false);
      expect(isValidTransactionCategory("")).toBe(false);
    });
  });

  describe("isValidAmount", () => {
    it("should return true for valid amounts", () => {
      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(0)).toBe(true);
      expect(isValidAmount(-50)).toBe(true);
      expect(isValidAmount(123.45)).toBe(true);
    });

    it("should return false for invalid amounts", () => {
      expect(isValidAmount(NaN)).toBe(false);
      expect(isValidAmount(Infinity)).toBe(false);
      expect(isValidAmount(-Infinity)).toBe(false);
    });
  });

  describe("isValidDate", () => {
    it("should return true for valid dates", () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate("2023-01-01")).toBe(true);
      expect(isValidDate("2023-12-31T23:59:59Z")).toBe(true);
    });

    it("should return false for invalid dates", () => {
      expect(isValidDate("invalid-date")).toBe(false);
      expect(isValidDate("")).toBe(false);
      expect(isValidDate(new Date("invalid"))).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("createValidationError", () => {
    it("should create validation error with correct structure", () => {
      const error = createValidationError("email", "Invalid format");

      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.message).toBe("Validation failed for email: Invalid format");
      expect(error.details).toEqual({
        field: "email",
        message: "Invalid format",
      });
    });
  });

  describe("Type Guards", () => {
    describe("isTransaction", () => {
      const validTransaction = {
        id: "123",
        userId: "user123",
        date: new Date(),
        amount: 100.5,
        description: "Test transaction",
        category: TransactionCategory.FOOD,
        type: "expense" as const,
        currency: "USD",
      };

      it("should return true for valid transaction", () => {
        expect(isTransaction(validTransaction)).toBe(true);
      });

      it("should return false for invalid transaction - missing id", () => {
        const { id, ...invalid } = validTransaction;
        expect(isTransaction(invalid)).toBe(false);
      });

      it("should return false for invalid transaction - invalid amount", () => {
        expect(isTransaction({ ...validTransaction, amount: "invalid" })).toBe(
          false
        );
      });

      it("should return false for invalid transaction - invalid category", () => {
        expect(
          isTransaction({ ...validTransaction, category: "invalid" })
        ).toBe(false);
      });

      it("should return false for invalid transaction - invalid type", () => {
        expect(isTransaction({ ...validTransaction, type: "invalid" })).toBe(
          false
        );
      });

      it("should return false for invalid transaction - invalid currency", () => {
        expect(
          isTransaction({ ...validTransaction, currency: "INVALID" })
        ).toBe(false);
      });

      it("should return false for null or undefined", () => {
        expect(isTransaction(null)).toBe(false);
        expect(isTransaction(undefined)).toBe(false);
      });
    });

    describe("isStock", () => {
      const validStock = {
        symbol: "AAPL",
        name: "Apple Inc.",
        currentPrice: 150.25,
        previousClose: 148.5,
        change: 1.75,
        changePercent: 1.18,
        volume: 1000000,
        lastUpdated: new Date(),
      };

      it("should return true for valid stock", () => {
        expect(isStock(validStock)).toBe(true);
      });

      it("should return false for invalid stock - missing symbol", () => {
        const { symbol, ...invalid } = validStock;
        expect(isStock(invalid)).toBe(false);
      });

      it("should return false for invalid stock - invalid currentPrice", () => {
        expect(isStock({ ...validStock, currentPrice: "invalid" })).toBe(false);
      });

      it("should return false for invalid stock - invalid volume", () => {
        expect(isStock({ ...validStock, volume: "invalid" })).toBe(false);
      });

      it("should return false for invalid stock - invalid lastUpdated", () => {
        expect(isStock({ ...validStock, lastUpdated: "invalid" })).toBe(false);
      });

      it("should return false for null or undefined", () => {
        expect(isStock(null)).toBe(false);
        expect(isStock(undefined)).toBe(false);
      });
    });

    describe("isExchangeRate", () => {
      const validRate = {
        currency: "EUR",
        rate: 1.18,
        change24h: 0.02,
        lastUpdated: new Date(),
      };

      it("should return true for valid exchange rate", () => {
        expect(isExchangeRate(validRate)).toBe(true);
      });

      it("should return false for invalid rate - invalid currency", () => {
        expect(isExchangeRate({ ...validRate, currency: "INVALID" })).toBe(
          false
        );
      });

      it("should return false for invalid rate - invalid rate value", () => {
        expect(isExchangeRate({ ...validRate, rate: "invalid" })).toBe(false);
      });

      it("should return false for invalid rate - invalid change24h", () => {
        expect(isExchangeRate({ ...validRate, change24h: "invalid" })).toBe(
          false
        );
      });

      it("should return false for invalid rate - invalid lastUpdated", () => {
        expect(isExchangeRate({ ...validRate, lastUpdated: "invalid" })).toBe(
          false
        );
      });

      it("should return false for null or undefined", () => {
        expect(isExchangeRate(null)).toBe(false);
        expect(isExchangeRate(undefined)).toBe(false);
      });
    });
  });
});
