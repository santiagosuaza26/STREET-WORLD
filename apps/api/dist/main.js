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
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use((req, res, next) => {
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