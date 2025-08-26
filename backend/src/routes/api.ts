import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { externalApiService } from "../services/externalApiService";
import { APIResponse, FinancialSummary } from "../types";
import { createLogger } from "../utils/logger";

const router = express.Router();
const logger = createLogger();

// GET /api/exchange-rates
router.get(
  "/exchange-rates",
  asyncHandler(async (req: Request, res: Response) => {
    const baseCurrency = (req.query.base as string) || "USD";

    logger.info(`Fetching exchange rates for base currency: ${baseCurrency}`);

    const rates = await externalApiService.getExchangeRates(baseCurrency);

    const response: APIResponse<typeof rates> = {
      success: true,
      data: rates,
      timestamp: new Date(),
    };

    return res.json(response);
  })
);

// GET /api/portfolio
router.get(
  "/portfolio",
  asyncHandler(async (req: Request, res: Response) => {
    const symbols = req.query.symbols as string;

    if (!symbols) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_SYMBOLS",
          message: "Stock symbols are required. Use ?symbols=AAPL,GOOGL,MSFT",
        },
        timestamp: new Date(),
      });
    }

    const symbolArray = symbols.split(",").map((s) => s.trim().toUpperCase());
    logger.info(
      `Fetching portfolio data for symbols: ${symbolArray.join(", ")}`
    );

    // Fetch all stocks in parallel
    const stockPromises = symbolArray.map((symbol) =>
      externalApiService.getStockPrice(symbol).catch((error) => {
        logger.warn(`Failed to fetch ${symbol}:`, error.message);
        return null; // Return null for failed requests
      })
    );

    const stocks = (await Promise.all(stockPromises)).filter(
      (stock) => stock !== null
    );

    const response: APIResponse<typeof stocks> = {
      success: true,
      data: stocks,
      timestamp: new Date(),
    };

    return res.json(response);
  })
);

// GET /api/stock/:symbol
router.get(
  "/stock/:symbol",
  asyncHandler(async (req: Request, res: Response) => {
    const symbol = req.params.symbol.toUpperCase();

    logger.info(`Fetching stock data for symbol: ${symbol}`);

    const stock = await externalApiService.getStockPrice(symbol);

    const response: APIResponse<typeof stock> = {
      success: true,
      data: stock,
      timestamp: new Date(),
    };

    return res.json(response);
  })
);

// GET /api/transactions
router.get(
  "/transactions",
  asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      category: req.query.category as any,
      type: req.query.type as any,
      searchTerm: req.query.search as string,
      dateFrom: req.query.dateFrom
        ? new Date(req.query.dateFrom as string)
        : undefined,
      dateTo: req.query.dateTo
        ? new Date(req.query.dateTo as string)
        : undefined,
    };

    logger.info("Fetching transactions with filters:", filters);

    const transactions = await externalApiService.getTransactions(filters);

    const response: APIResponse<typeof transactions> = {
      success: true,
      data: transactions,
      timestamp: new Date(),
    };

    return res.json(response);
  })
);

// GET /api/dashboard
router.get(
  "/dashboard",
  asyncHandler(async (req: Request, res: Response) => {
    logger.info("Fetching dashboard data");

    // Fetch all data in parallel
    const [exchangeRates, transactions] = await Promise.all([
      externalApiService.getExchangeRates("USD"),
      externalApiService.getTransactions({}),
    ]);

    // Calculate financial summary from transactions
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const summary: FinancialSummary = {
      totalBalance: totalIncome - totalExpenses,
      portfolioValue: 0, // Will be calculated on frontend based on selected stocks
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      monthlyChange: 2.4, // Mock value for now
      currency: "USD",
      lastUpdated: new Date(),
    };

    const dashboardData = {
      summary,
      exchangeRates,
      recentTransactions: transactions.slice(0, 10), // Last 10 transactions
    };

    const response: APIResponse<typeof dashboardData> = {
      success: true,
      data: dashboardData,
      timestamp: new Date(),
    };

    return res.json(response);
  })
);

export default router;
