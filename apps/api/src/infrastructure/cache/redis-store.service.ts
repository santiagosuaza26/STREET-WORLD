import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { createClient } from "redis";

type AppRedisClient = ReturnType<typeof createClient>;

type MemoryRateBucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class RedisStoreService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisStoreService.name);
  private client: AppRedisClient | null = null;
  private connectPromise: Promise<AppRedisClient | null> | null = null;
  private readonly memoryRateBuckets = new Map<string, MemoryRateBucket>();
  private readonly memoryJsonStore = new Map<string, { expiresAt: number; value: string }>();

  async consumeRateLimit(key: string, maxRequests: number, windowMs: number) {
    const client = await this.getClient();
    if (!client) {
      return this.consumeRateLimitInMemory(key, maxRequests, windowMs);
    }

    const count = await client.incr(key);
    if (count === 1) {
      await client.pExpire(key, windowMs);
    }

    const ttlMs = await client.pTTL(key);
    const retryAfterMs = ttlMs > 0 ? ttlMs : windowMs;

    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      retryAfterMs,
    };
  }

  async getJson<T>(key: string): Promise<T | null> {
    const client = await this.getClient();
    if (!client) {
      return this.getJsonInMemory<T>(key);
    }

    const raw = await client.get(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlMs: number): Promise<void> {
    const payload = JSON.stringify(value);
    const client = await this.getClient();

    if (!client) {
      this.memoryJsonStore.set(key, { expiresAt: Date.now() + ttlMs, value: payload });
      return;
    }

    await client.set(key, payload, { PX: ttlMs });
  }

  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }

  private async getClient(): Promise<AppRedisClient | null> {
    if (this.client?.isOpen) {
      return this.client;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    const url = process.env.REDIS_URL?.trim();
    if (!url) {
      return null;
    }

    const redisClient = createClient({ url });
    redisClient.on("error", (error) => {
      this.logger.warn(`Redis error: ${error instanceof Error ? error.message : String(error)}`);
    });

    this.connectPromise = redisClient
      .connect()
      .then(() => {
        this.client = redisClient;
        this.logger.log("Redis connected");
        return redisClient;
      })
      .catch((error) => {
        this.logger.warn(
          `Redis unavailable, falling back to in-memory cache: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        return null;
      })
      .finally(() => {
        this.connectPromise = null;
      });

    return this.connectPromise;
  }

  private consumeRateLimitInMemory(key: string, maxRequests: number, windowMs: number) {
    const now = Date.now();
    const current = this.memoryRateBuckets.get(key);

    if (!current || now >= current.resetAt) {
      this.memoryRateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - 1),
        retryAfterMs: windowMs,
      };
    }

    current.count += 1;
    return {
      allowed: current.count <= maxRequests,
      remaining: Math.max(0, maxRequests - current.count),
      retryAfterMs: Math.max(0, current.resetAt - now),
    };
  }

  private getJsonInMemory<T>(key: string): T | null {
    const current = this.memoryJsonStore.get(key);
    if (!current) {
      return null;
    }

    if (Date.now() >= current.expiresAt) {
      this.memoryJsonStore.delete(key);
      return null;
    }

    try {
      return JSON.parse(current.value) as T;
    } catch {
      return null;
    }
  }
}
