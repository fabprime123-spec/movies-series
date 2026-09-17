/**
 * @file apiResponse.util.ts
 * @description Standardized API JSON response helpers ensuring consistent
 *              payload structures for success states and error handling.
 */

import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, status: number = 200) {
  return res.status(status).json(data);
}

export function sendError(
  res: Response,
  message: string = 'Internal Server Error',
  status: number = 500,
  details?: unknown
) {
  return res.status(status).json({
    success: false,
    error: message,
    ...(details && process.env.NODE_ENV !== 'production' ? { details } : {}),
  });
}
