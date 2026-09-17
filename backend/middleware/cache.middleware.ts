/**
 * @file cache.middleware.ts
 * @description Express response cache middleware for idempotent GET routes.
 *              Intercepts incoming requests and serves from memory cache when available.
 */

import { Request, Response, NextFunction } from 'express';
import { backendCache } from '../services/cache.service';

export function routeCacheMiddleware(ttlMs: number = 2 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `route_${req.originalUrl}`;
    const cachedResponse = backendCache.get<any>(cacheKey);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    res.setHeader('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);

    res.json = (body: any): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        backendCache.set(cacheKey, body, ttlMs);
      }
      return originalJson(body);
    };

    next();
  };
}
