/**
 * @file cache.service.ts
 * @description High-performance in-memory TTL (Time-To-Live) cache service
 *              to reduce external API latency, eliminate redundant network queries,
 *              and respect rate limits.
 */

export class CacheService {
  private cache = new Map<string, { data: unknown; expiry: number }>();

  /**
   * Retrieves an item from the cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Sets an item into the cache with a designated TTL in milliseconds
   */
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  /**
   * Deletes a specific key from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all stored cache items
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Returns current count of cached items
   */
  size(): number {
    return this.cache.size;
  }
}

// Global shared cache instance
export const backendCache = new CacheService();
