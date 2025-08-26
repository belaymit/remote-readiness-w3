import { Request, Response, NextFunction } from 'express';
import { ErrorCodes } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger();

export interface AppError extends Error {
  statusCode?: number;
  code?: ErrorCodes;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error('Error occurred:', err, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || ErrorCodes.EXTERNAL_API_FAILURE;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = ErrorCodes.VALIDATION_ERROR;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = ErrorCodes.VALIDATION_ERROR;
    message = 'Invalid data format';
  } else if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ENOTFOUND') {
    statusCode = 503;
    errorCode = ErrorCodes.EXTERNAL_API_FAILURE;
    message = 'External service unavailable';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: err.details })
    },
    timestamp: new Date()
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    },
    timestamp: new Date()
  });
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}