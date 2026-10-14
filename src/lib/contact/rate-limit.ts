const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

/**
 * Small in-memory limiter (per server instance). It stops casual abuse of the email endpoint; on
 * serverless hosting each instance has its own counter, so use a durable store if you need hard limits.
 */
export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  hits.set(key, [...recent, now]);
  return false;
}

export function resetRateLimit(): void {
  hits.clear();
}
