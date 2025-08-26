# Validation Utilities

This directory contains comprehensive validation utilities for the Finance Dashboard application.

## Files Overview

### `validation.ts`
Core validation functions for basic data types and formatting utilities.

**Key Functions:**
- `isValidCurrency()` - Validates currency codes
- `isValidStockSymbol()` - Validates stock symbols (1-5 uppercase letters)
- `isValidTransactionCategory()` - Validates transaction categories
- `validateStock()` - Comprehensive stock object validation
- `validateTransaction()` - Comprehensive transaction object validation
- `validateExchangeRate()` - Comprehensive exchange rate validation
- `formatCurrency()` - Currency formatting utility
- `formatPercentage()` - Percentage formatting utility
- `formatDate()` - Date formatting utility

### `typeGuards.ts`
Runtime type checking utilities using TypeScript type guards.

**Key Functions:**
- `isUser()` - Type guard for User objects
- `isStock()` - Type guard for Stock objects
- `isTransaction()` - Type guard for Transaction objects
- `isExchangeRate()` - Type guard for ExchangeRate objects
- `isAPIResponse()` - Type guard for API responses
- `safeParseDate()` - Safe date parsing with null fallback
- `safeParseNumber()` - Safe number parsing with null fallback
- `assertIsUser()` - Assertion function for User objects

### `validationSchemas.ts`
Schema-based validation for complex objects with detailed error reporting.

**Key Features:**
- `userValidationSchema` - Complete user data validation
- `transactionValidationSchema` - Complete transaction validation
- `stockValidationSchema` - Complete stock data validation
- `validateBatch()` - Batch validation utility
- `getAllErrors()` - Error aggregation utility
- `getAllWarnings()` - Warning aggregation utility

## Usage Examples

### Basic Validation
```typescript
import { isValidCurrency, validateStock } from '@/utils/validation';

// Simple validation
if (isValidCurrency('USD')) {
  console.log('Valid currency');
}

// Object validation
const stock = { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150 };
const errors = validateStock(stock);
if (errors.length === 0) {
  console.log('Valid stock');
}
```

### Type Guards
```typescript
import { isStock, assertIsUser } from '@/utils/typeGuards';

// Runtime type checking
if (isStock(data)) {
  // TypeScript now knows data is a Stock
  console.log(data.symbol);
}

// Assertion (throws if invalid)
assertIsUser(userData); // Throws if not a valid User
```

### Schema Validation
```typescript
import { userValidationSchema } from '@/utils/validationSchemas';

const result = userValidationSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  preferredCurrency: 'USD'
});

if (result.isValid) {
  console.log('User is valid');
} else {
  console.log('Errors:', result.errors);
  console.log('Warnings:', result.warnings);
}
```

## Testing

All validation utilities are thoroughly tested with Jest. Run tests with:

```bash
npm run test
```

Test files are located in `__tests__/` subdirectories:
- `__tests__/validation.test.ts`
- `__tests__/typeGuards.test.ts`
- `__tests__/validationSchemas.test.ts`

## Best Practices

1. **Use Type Guards** for runtime type checking when dealing with external data
2. **Use Schema Validation** for form validation and complex object validation
3. **Use Basic Validation** for simple field validation
4. **Always handle validation errors** gracefully in your UI
5. **Use assertion functions** only when you're certain the data should be valid

## Error Handling

All validation functions return detailed error information:
- **Basic validation**: Returns boolean or array of error strings
- **Type guards**: Returns boolean (use with type narrowing)
- **Schema validation**: Returns `ValidationResult` with `isValid`, `errors`, and `warnings`

## Performance Considerations

- Type guards are optimized for runtime performance
- Schema validation provides detailed feedback but is more expensive
- Use appropriate validation level based on your use case
- Cache validation results when possible for repeated validations