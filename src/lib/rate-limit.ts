type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

const WINDOW_MS = 60 * 1000;
const LIMIT = 10;

const globalForRateLimit = globalThis as unknown as {
  flashlinkRateLimit: Map<string, Bucket> | undefined;
};

const buckets = globalForRateLimit.flashlinkRateLimit ?? new Map<string, Bucket>();

if (!globalForRateLimit.flashlinkRateLimit) {
  globalForRateLimit.flashlinkRateLimit = buckets;
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export const rateLimit = {
  limitValue: LIMIT,
  limit(identifier: string): RateLimitResult {
    const now = Date.now();
    pruneExpiredBuckets(now);

    const currentBucket = buckets.get(identifier);

    if (!currentBucket || currentBucket.resetAt <= now) {
      buckets.set(identifier, {
        count: 1,
        resetAt: now + WINDOW_MS
      });

      return {
        success: true,
        remaining: LIMIT - 1,
        resetAt: now + WINDOW_MS
      };
    }

    if (currentBucket.count >= LIMIT) {
      return {
        success: false,
        remaining: 0,
        resetAt: currentBucket.resetAt
      };
    }

    currentBucket.count += 1;
    buckets.set(identifier, currentBucket);

    return {
      success: true,
      remaining: Math.max(LIMIT - currentBucket.count, 0),
      resetAt: currentBucket.resetAt
    };
  }
};

