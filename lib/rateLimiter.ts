interface RateLimitRecord {
  timestamps: number[]
}

const rateLimitStore = new Map<string, RateLimitRecord>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  rateLimitStore.forEach((record: RateLimitRecord, key: string) => {
    record.timestamps = record.timestamps.filter((t: number) => now - t < 60000)
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key)
    }
  })
}, 5 * 60 * 1000)

/**
 * In-memory sliding window rate limiter.
 * @param identifier Client IP or unique key
 * @param limit Maximum allowed requests within windowMs
 * @param windowMs Time window in milliseconds (default 60000 = 1 min)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  let record = rateLimitStore.get(identifier)

  if (!record) {
    record = { timestamps: [] }
    rateLimitStore.set(identifier, record)
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t: number) => now - t < windowMs)

  if (record.timestamps.length >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.timestamps.push(now)
  return { allowed: true, remaining: limit - record.timestamps.length }
}
