import { cacheService } from '../cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    // Clear cache before each test
    cacheService.clear();
  });

  afterAll(() => {
    // Clean up after all tests
    cacheService.clear();
  });

  describe('Basic Operations', () => {
    it('should set and get values correctly', () => {
      const testData = { name: 'test', value: 123 };
      cacheService.set('test-key', testData);
      
      const retrieved = cacheService.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = cacheService.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should check if key exists', () => {
      cacheService.set('exists-key', 'value');
      
      expect(cacheService.has('exists-key')).toBe(true);
      expect(cacheService.has('missing-key')).toBe(false);
    });

    it('should delete keys correctly', () => {
      cacheService.set('delete-key', 'value');
      expect(cacheService.has('delete-key')).toBe(true);
      
      const deleted = cacheService.delete('delete-key');
      expect(deleted).toBe(true);
      expect(cacheService.has('delete-key')).toBe(false);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should respect custom TTL', (done) => {
      cacheService.set('ttl-key', 'value', 1); // 1 second TTL
      
      expect(cacheService.get('ttl-key')).toBe('value');
      
      setTimeout(() => {
        expect(cacheService.get('ttl-key')).toBeNull();
        done();
      }, 1100); // Wait slightly longer than TTL
    });

    it('should get TTL for a key', () => {
      cacheService.set('ttl-check', 'value', 60);
      const ttl = cacheService.getTtl('ttl-check');
      
      expect(ttl).toBeGreaterThan(0);
      // TTL should be close to the set value (allowing for some execution time)
      expect(ttl).toBeGreaterThan(Date.now() + 50000); // At least 50 seconds remaining
    });
  });

  describe('Pattern Invalidation', () => {
    it('should invalidate keys matching pattern', () => {
      cacheService.set('user_123_profile', { name: 'John' });
      cacheService.set('user_456_profile', { name: 'Jane' });
      cacheService.set('product_789', { name: 'Widget' });
      
      cacheService.invalidate('user_');
      
      expect(cacheService.get('user_123_profile')).toBeNull();
      expect(cacheService.get('user_456_profile')).toBeNull();
      expect(cacheService.get('product_789')).toEqual({ name: 'Widget' });
    });
  });

  describe('Statistics', () => {
    it('should provide cache statistics', () => {
      cacheService.set('stats-key-1', 'value1');
      cacheService.set('stats-key-2', 'value2');
      
      const stats = cacheService.getStats();
      
      expect(stats).toHaveProperty('keys');
      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats.keys).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Clear Cache', () => {
    it('should clear all cache entries', () => {
      cacheService.set('clear-key-1', 'value1');
      cacheService.set('clear-key-2', 'value2');
      
      expect(cacheService.has('clear-key-1')).toBe(true);
      expect(cacheService.has('clear-key-2')).toBe(true);
      
      cacheService.clear();
      
      expect(cacheService.has('clear-key-1')).toBe(false);
      expect(cacheService.has('clear-key-2')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid operations gracefully', () => {
      // These should not throw errors
      expect(() => cacheService.get('')).not.toThrow();
      expect(() => cacheService.set('', 'value')).not.toThrow();
      expect(() => cacheService.delete('non-existent')).not.toThrow();
      expect(() => cacheService.invalidate('')).not.toThrow();
    });
  });
});