/**
 * @file errorHandler.middleware.ts
 * @description Centralized Express error handler capturing uncaught operational
 *              and programming errors, preventing server crashes and sending
 *              safe sanitised error responses.
 */

import { Request, Response, NextFunction } from 'express';
import { backendLogger } from '../utils/logger.util';

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  backendLogger.error(
    'ErrorHandler',
    `Unhandled Exception on ${req.method} ${req.originalUrl}:`,
    err?.stack || err?.message || err
  );

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}
