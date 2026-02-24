"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./api/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger("HTTP");
    app.use((0, express_1.json)({
        verify: (req, _res, buf) => {
            req.rawBody = buf.toString();
        }
    }));
    app.enableCors({
        origin: true,
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
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map