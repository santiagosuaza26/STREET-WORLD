import "./tracing";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json } from "express";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./api/filters/http-exception.filter";
import { AppDataSource } from "./database.config";
import { RedisStoreService } from "./infrastructure/cache/redis-store.service";
import * as dotenv from "dotenv";

dotenv.config();

function getAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS ?? "http://localhost:3000";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

function assertRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function parseNumberEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function applySecurityHeaders(res: Response) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-DNS-Prefetch-Control", "off");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

function isSensitivePath(path: string) {
  return (
    path.startsWith("/auth/") ||
    path.startsWith("/contact") ||
    path.startsWith("/payments/checkout") ||
    path.startsWith("/payments/webhook")
  );
}

async function bootstrap() {
  assertRequiredEnv("JWT_SECRET");
  assertRequiredEnv("JWT_REFRESH_SECRET");
  const bootstrapLogger = new Logger("Bootstrap");

  // Initialize database
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    bootstrapLogger.log("Database initialized successfully");
  }
  const app = await NestFactory.create(AppModule);
  const redisStore = app.get(RedisStoreService);
  const logger = new Logger("HTTP");
  app.use(
    json({
      verify: (req: Request & { rawBody?: string }, _res: Response, buf: Buffer) => {
        req.rawBody = buf.toString();
      }
    })
  );
  const allowedOrigins = getAllowedOrigins();
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origen no permitido por CORS"), false);
    },
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
      applySecurityHeaders(res);

      if (isSensitivePath(req.path)) {
        const windowMs = parseNumberEnv(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
        const maxRequests = parseNumberEnv(process.env.RATE_LIMIT_MAX, 30);
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        const key = `rate-limit:${ip}:${req.path}`;
        const rate = await redisStore.consumeRateLimit(key, maxRequests, windowMs);

        if (!rate.allowed) {
          const retryAfterSeconds = Math.max(1, Math.ceil(rate.retryAfterMs / 1000));
          res.setHeader("Retry-After", String(retryAfterSeconds));
          res.status(429).json({
            statusCode: 429,
            error: "TOO_MANY_REQUESTS",
            message: "Demasiadas solicitudes. Intenta nuevamente en unos minutos.",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
      });
      next();
    } catch (error) {
      next(error as Error);
    }
  });
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

bootstrap();
