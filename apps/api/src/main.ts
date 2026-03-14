import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json } from "express";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./api/filters/http-exception.filter";
import { AppDataSource } from "./database.config";
import * as dotenv from "dotenv";

dotenv.config();

function getAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS ?? "http://localhost:3000";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

async function bootstrap() {
  // Initialize database
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("✅ Database initialized successfully");
  }
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

bootstrap();
