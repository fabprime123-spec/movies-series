/**
 * @file logger.middleware.ts
 * @description Express request logging middleware recording endpoint hits,
 *              HTTP method, response status codes, and execution duration.
 */

import { Request, Response, NextFunction } from 'express';
import { backendLogger } from '../utils/logger.util';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    backendLogger.info(
      'HTTP',
      `${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`
    );
  });

  next();
}
