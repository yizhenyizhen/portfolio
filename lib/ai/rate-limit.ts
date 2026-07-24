import "server-only";

import { aiServerConfig } from "./server-config";

type RateLimitBucket = {
  active: number;
  timestamps: number[];
};

type RateLimitStore = Map<string, RateLimitBucket>;

type GlobalWithAIRateLimit = typeof globalThis & {
  __portfolioAIRateLimit?: RateLimitStore;
};

const globalWithRateLimit = globalThis as GlobalWithAIRateLimit;
const buckets: RateLimitStore =
  globalWithRateLimit.__portfolioAIRateLimit ??
  (globalWithRateLimit.__portfolioAIRateLimit = new Map<
    string,
    RateLimitBucket
  >());

export type RateLimitLease =
  | {
      allowed: true;
      release: () => void;
    }
  | {
      allowed: false;
      retryAfterSeconds: number;
    };

export function acquireAIRateLimit(key: string): RateLimitLease {
  const now = Date.now();
  const { maxConcurrent, maxRequests, windowMs } = aiServerConfig.rateLimit;
  const current: RateLimitBucket = buckets.get(key) ?? {
    active: 0,
    timestamps: [],
  };

  current.timestamps = current.timestamps.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (
    current.active >= maxConcurrent ||
    current.timestamps.length >= maxRequests
  ) {
    const oldest = current.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1_000),
    );
    buckets.set(key, current);
    return { allowed: false, retryAfterSeconds };
  }

  current.active += 1;
  current.timestamps.push(now);
  buckets.set(key, current);

  let released = false;

  return {
    allowed: true,
    release: () => {
      if (released) return;
      released = true;
      const latest = buckets.get(key);
      if (!latest) return;
      latest.active = Math.max(0, latest.active - 1);
      if (latest.active === 0 && latest.timestamps.length === 0) {
        buckets.delete(key);
      }
    },
  };
}
