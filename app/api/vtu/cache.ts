interface CacheEntry<T = any> {
  data: T
  timestamp: number
}

// Module-level in-memory cache that persists across requests within the Node server process
const cacheStore = new Map<string, CacheEntry>()

/**
 * Get cached data if available and not expired
 * @param key Unique cache key
 * @param ttlMs Time to live in milliseconds (default: 1 hour)
 */
export function getCached<T = any>(
  key: string,
  ttlMs: number = 1000 * 60 * 60
): T | null {
  const entry = cacheStore.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > ttlMs) {
    return null
  }
  return entry.data as T
}

/**
 * Get stale data as a fallback if remote fetch fails
 * @param key Unique cache key
 */
export function getStale<T = any>(key: string): T | null {
  const entry = cacheStore.get(key)
  return entry ? (entry.data as T) : null
}

/**
 * Store data in the in-memory cache
 * @param key Unique cache key
 * @param data Data payload to store
 */
export function setCached<T = any>(key: string, data: T): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
  })
}
