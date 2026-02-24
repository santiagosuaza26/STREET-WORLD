import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json } from "express";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./api/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("HTTP");
  app.use(
    json({
      verify: (req: Request & { rawBody?: string }, _res: Response, buf: Buffer) => {
        req.rawBody = buf.toString();
      }
    })
  );
  app.enableCors({
    origin: true,
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
  await app.listen(3001);
}

bootstrap();
