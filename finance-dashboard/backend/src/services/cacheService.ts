import NodeCache from 'node-cache';
import { CacheService } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger();

class CacheServiceImpl implements CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // Default TTL: 10 minutes
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false // Better performance, but be careful with object mutations
    });

    // Log cache statistics periodically
    setInterval(() => {
      const stats = this.cache.getStats();
      logger.debug('Cache statistics:', stats);
    }, 300000); // Every 5 minutes
  }

  get<T>(key: string): T | null {
    try {
      const value = this.cache.get<T>(key);
      if (value !== undefined) {
        logger.debug(`Cache HIT for key: ${key}`);
        return value;
      }
      logger.debug(`Cache MISS for key: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  set<T>(key: string, value: T, ttl: number = 600): void {
    try {
      this.cache.set(key, value, ttl);
      logger.debug(`Cache SET for key: ${key}, TTL: ${ttl}s`);
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error);
    }
  }

  invalidate(pattern: string): void {
    try {
      const keys = this.cache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      
      matchingKeys.forEach(key => {
        this.cache.del(key);
      });
      
      logger.info(`Cache invalidated ${matchingKeys.length} keys matching pattern: ${pattern}`);
    } catch (error) {
      logger.error(`Cache invalidation error for pattern ${pattern}:`, error);
    }
  }

  // Additional utility methods
  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.del(key) > 0;
  }

  clear(): void {
    this.cache.flushAll();
    logger.info('Cache cleared completely');
  }

  getStats() {
    return this.cache.getStats();
  }

  // Get remaining TTL for a key
  getTtl(key: string): number {
    const ttl = this.cache.getTtl(key);
    return ttl || 0; // Return 0 if key doesn't exist or has no TTL
  }
}

// Export singleton instance
export const cacheService = new CacheServiceImpl();
export default cacheService;