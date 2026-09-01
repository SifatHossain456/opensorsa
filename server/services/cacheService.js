// OpenSorsa Cache Service with TTL
class MemoryCache {
  constructor(defaultTtlMs = 15 * 60 * 1000) { // 15 minutes default
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new MemoryCache();
module.exports = cache;
