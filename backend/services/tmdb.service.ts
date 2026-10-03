/**
 * @file tmdb.service.ts
 * @description Encapsulated TMDB external service handler managing REST calls,
 *              header authentication, automatic caching, error handling,
 *              and query parameter serialization.
 */

import { TMDB_CONFIG } from '../config/tmdb.config';
import { backendCache } from './cache.service';
import { backendLogger } from '../utils/logger.util';

export class TmdbService {
  /**
   * Fetches data from TMDB API with in-memory caching
   */
  static async fetchFromTmdb<T = any>(
    endpoint: string,
    queryParams: Record<string, string | number | boolean | undefined> = {},
    ttlMs: number = 5 * 60 * 1000,
    options: { silent404?: boolean } = {}
  ): Promise<T> {
    const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    const cacheKey = url.toString();
    const cached = backendCache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url.toString(), {
        headers: TMDB_CONFIG.DEFAULT_HEADERS,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        if (response.status === 404 && options.silent404) {
          backendLogger.info(
            'TmdbService',
            `TMDB 404 on ${endpoint} (will attempt fallback if available)`
          );
        } else {
          backendLogger.error(
            'TmdbService',
            `TMDB HTTP ${response.status} on ${endpoint}: ${errorBody}`
          );
        }
        const err: any = new Error(`TMDB responded with status ${response.status}`);
        err.status = response.status;
        throw err;
      }

      const data = (await response.json()) as T;
      backendCache.set(cacheKey, data, ttlMs);
      return data;
    } catch (error: any) {
      if (!(error?.status === 404 && options.silent404)) {
        backendLogger.error('TmdbService', `Network/fetch failed for ${endpoint}:`, error?.message);
      }
      throw error;
    }
  }
}
