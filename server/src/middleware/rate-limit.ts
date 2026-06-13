import { createMiddleware } from "hono/factory";
import { redis } from "../lib/redis.js";

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const defaults: Record<string, RateLimitConfig> = {
  default: { windowMs: 60_000, max: 120 },
  strict: { windowMs: 60_000, max: 10 },
  admin: { windowMs: 60_000, max: 60 },
};

/**
 * Normalise a URL path so that dynamic segments (UUIDs, numeric IDs)
 * are replaced with a placeholder. This ensures all requests to the
 * same route pattern share a single rate-limit bucket.
 *
 * Examples:
 *   /api/rules/abc-123/toggle  →  /api/rules/:id/toggle
 *   /api/billing/purchase      →  /api/billing/purchase
 */
function normaliseRoutePath(path: string): string {
  return path
    .split("/")
    .map((segment) =>
      // UUID pattern
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
        ? ":id"
        // Pure numeric ID
        : /^\d+$/.test(segment)
        ? ":id"
        : segment
    )
    .join("/");
}

export function rateLimit(profile: keyof typeof defaults = "default") {
  return createMiddleware(async (c, next) => {
    const config = defaults[profile] || defaults.default;
    const routePath = normaliseRoutePath(c.req.path);
    const ip = c.req.header("x-forwarded-for") || "unknown";
    const key = `ratelimit:${routePath}:${ip}`;

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.pexpire(key, config.windowMs);
    }

    if (current > config.max) {
      return c.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests", requestId: crypto.randomUUID() } },
        429,
        { "Retry-After": String(Math.ceil(config.windowMs / 1000)) }
      );
    }

    await next();
  });
}
