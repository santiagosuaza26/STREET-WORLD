"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./api/filters/http-exception.filter");
const database_config_1 = require("./database.config");
const dotenv = require("dotenv");
dotenv.config();
function getAllowedOrigins() {
    const raw = process.env.CORS_ORIGINS ?? "http://localhost:3000";
    return raw
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);
}
const rateBuckets = new Map();
function parseNumberEnv(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function applySecurityHeaders(res) {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
}
function isSensitivePath(path) {
    return (path.startsWith("/auth/") ||
        path.startsWith("/contact") ||
        path.startsWith("/payments/checkout") ||
        path.startsWith("/payments/webhook"));
}
async function bootstrap() {
    if (!database_config_1.AppDataSource.isInitialized) {
        await database_config_1.AppDataSource.initialize();
        console.log("✅ Database initialized successfully");
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger("HTTP");
    app.use((0, express_1.json)({
        verify: (req, _res, buf) => {
            req.rawBody = buf.toString();
        }
    }));
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use((req, res, next) => {
        applySecurityHeaders(res);
        if (isSensitivePath(req.path)) {
            const windowMs = parseNumberEnv(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
            const maxRequests = parseNumberEnv(process.env.RATE_LIMIT_MAX, 30);
            const ip = req.ip || req.socket.remoteAddress || "unknown";
            const key = `${ip}:${req.path}`;
            const now = Date.now();
            const current = rateBuckets.get(key);
            if (!current || now >= current.resetAt) {
                rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
            }
            else if (current.count >= maxRequests) {
                res.status(429).json({
                    statusCode: 429,
                    error: "TOO_MANY_REQUESTS",
                    message: "Demasiadas solicitudes. Intenta nuevamente en unos minutos.",
                    path: req.originalUrl,
                    timestamp: new Date().toISOString()
                });
                return;
            }
            else {
                current.count += 1;
            }
        }
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
//# sourceMappingURL=main.js.map