"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.TransactionCategory = void 0;
var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["FOOD"] = "food";
    TransactionCategory["TRANSPORT"] = "transport";
    TransactionCategory["ENTERTAINMENT"] = "entertainment";
    TransactionCategory["UTILITIES"] = "utilities";
    TransactionCategory["SALARY"] = "salary";
    TransactionCategory["INVESTMENT"] = "investment";
    TransactionCategory["OTHER"] = "other";
})(TransactionCategory || (exports.TransactionCategory = TransactionCategory = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["EXTERNAL_API_FAILURE"] = "EXTERNAL_API_FAILURE";
    ErrorCodes["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ErrorCodes["INVALID_CURRENCY"] = "INVALID_CURRENCY";
    ErrorCodes["INVALID_STOCK_SYMBOL"] = "INVALID_STOCK_SYMBOL";
    ErrorCodes["CACHE_MISS"] = "CACHE_MISS";
    ErrorCodes["VALIDATION_ERROR"] = "VALIDATION_ERROR";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
//# sourceMappingURL=index.js.map