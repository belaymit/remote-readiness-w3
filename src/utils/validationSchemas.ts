import { TransactionCategory } from "@/types";

// Validation schemas for form validation and API input validation

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationSchema<T> {
  validate(data: Partial<T>): ValidationResult;
  validateField(field: keyof T, value: any): ValidationResult;
}

// User validation schema
export const userValidationSchema: ValidationSchema<{
  name: string;
  email: string;
  preferredCurrency: string;
  portfolioSymbols: string[];
}> = {
  validate(data) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.push("Name is required");
    } else if (data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    } else if (data.name.trim().length > 100) {
      errors.push("Name must be less than 100 characters");
    }

    // Email validation
    if (!data.email || data.email.trim().length === 0) {
      errors.push("Email is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push("Invalid email format");
      }
    }

    // Currency validation
    if (!data.preferredCurrency) {
      errors.push("Preferred currency is required");
    } else {
      const validCurrencies = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CAD",
        "AUD",
        "CHF",
        "CNY",
      ];
      if (!validCurrencies.includes(data.preferredCurrency.toUpperCase())) {
        errors.push("Invalid currency code");
      }
    }

    // Portfolio symbols validation
    if (data.portfolioSymbols) {
      if (!Array.isArray(data.portfolioSymbols)) {
        errors.push("Portfolio symbols must be an array");
      } else {
        data.portfolioSymbols.forEach((symbol, index) => {
          if (typeof symbol !== "string") {
            errors.push(`Portfolio symbol at index ${index} must be a string`);
          } else if (!/^[A-Z]{1,5}$/.test(symbol)) {
            errors.push(`Invalid stock symbol: ${symbol}`);
          }
        });

        if (data.portfolioSymbols.length > 20) {
          warnings.push(
            "Consider limiting portfolio to 20 symbols for better performance"
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  },

  validateField(field, value) {
    const data = { [field]: value };
    return this.validate(data);
  },
};

// Transaction validation schema
export const transactionValidationSchema: ValidationSchema<{
  amount: number;
  description: string;
  category: TransactionCategory;
  type: "income" | "expense" | "transfer";
  date: Date;
  currency: string;
}> = {
  validate(data) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Amount validation
    if (data.amount === undefined || data.amount === null) {
      errors.push("Amount is required");
    } else if (typeof data.amount !== "number" || isNaN(data.amount)) {
      errors.push("Amount must be a valid number");
    } else if (!isFinite(data.amount)) {
      errors.push("Amount must be a finite number");
    } else if (Math.abs(data.amount) > 1000000) {
      warnings.push("Large transaction amount detected");
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
      errors.push("Description is required");
    } else if (data.description.trim().length < 3) {
      errors.push("Description must be at least 3 characters long");
    } else if (data.description.trim().length > 200) {
      errors.push("Description must be less than 200 characters");
    }

    // Category validation
    if (!data.category) {
      errors.push("Category is required");
    } else if (!Object.values(TransactionCategory).includes(data.category)) {
      errors.push("Invalid transaction category");
    }

    // Type validation
    if (!data.type) {
      errors.push("Transaction type is required");
    } else if (!["income", "expense", "transfer"].includes(data.type)) {
      errors.push("Invalid transaction type");
    }

    // Date validation
    if (!data.date) {
      errors.push("Date is required");
    } else if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
      errors.push("Invalid date");
    } else {
      const now = new Date();
      const oneYearFromNow = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate()
      );

      if (data.date > oneYearFromNow) {
        warnings.push("Transaction date is more than a year in the future");
      }
    }

    // Currency validation
    if (!data.currency) {
      errors.push("Currency is required");
    } else {
      const validCurrencies = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CAD",
        "AUD",
        "CHF",
        "CNY",
      ];
      if (!validCurrencies.includes(data.currency.toUpperCase())) {
        errors.push("Invalid currency code");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  },

  validateField(field, value) {
    const data = { [field]: value };
    return this.validate(data);
  },
};

// Stock validation schema
export const stockValidationSchema: ValidationSchema<{
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  volume: number;
}> = {
  validate(data) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Symbol validation
    if (!data.symbol || data.symbol.trim().length === 0) {
      errors.push("Stock symbol is required");
    } else if (!/^[A-Z]{1,5}$/.test(data.symbol.trim())) {
      errors.push("Invalid stock symbol format (1-5 uppercase letters)");
    }

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.push("Stock name is required");
    } else if (data.name.trim().length > 100) {
      errors.push("Stock name must be less than 100 characters");
    }

    // Price validation
    if (data.currentPrice === undefined || data.currentPrice === null) {
      errors.push("Current price is required");
    } else if (
      typeof data.currentPrice !== "number" ||
      data.currentPrice <= 0
    ) {
      errors.push("Current price must be a positive number");
    } else if (data.currentPrice > 10000) {
      warnings.push("High stock price detected");
    }

    if (data.previousClose === undefined || data.previousClose === null) {
      errors.push("Previous close is required");
    } else if (
      typeof data.previousClose !== "number" ||
      data.previousClose <= 0
    ) {
      errors.push("Previous close must be a positive number");
    }

    // Volume validation
    if (data.volume !== undefined && data.volume !== null) {
      if (typeof data.volume !== "number" || data.volume < 0) {
        errors.push("Volume must be a non-negative number");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  },

  validateField(field, value) {
    const data = { [field]: value };
    return this.validate(data);
  },
};

// Utility function to validate multiple objects
export function validateBatch<T>(
  schema: ValidationSchema<T>,
  items: Partial<T>[]
): { results: ValidationResult[]; overallValid: boolean } {
  const results = items.map((item) => schema.validate(item));
  const overallValid = results.every((result) => result.isValid);

  return { results, overallValid };
}

// Utility function to get all validation errors as a flat array
export function getAllErrors(results: ValidationResult[]): string[] {
  return results.flatMap((result) => result.errors);
}

// Utility function to get all validation warnings as a flat array
export function getAllWarnings(results: ValidationResult[]): string[] {
  return results.flatMap((result) => result.warnings || []);
}
