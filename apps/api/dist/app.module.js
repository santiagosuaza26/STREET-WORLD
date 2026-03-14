"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = require("dotenv");
const api_module_1 = require("./api/api.module");
const entities_1 = require("./infrastructure/database/entities");
dotenv.config();
const shouldSynchronize = process.env.TYPEORM_SYNCHRONIZE === "true" || process.env.NODE_ENV === "development";
const typeOrmConfig = process.env.DATABASE_URL
    ? {
        type: "postgres",
        url: process.env.DATABASE_URL,
        entities: [entities_1.UserEntity, entities_1.ProductEntity, entities_1.ContactMessageEntity, entities_1.OrderEntity, entities_1.OrderItemEntity, entities_1.PaymentEntity],
        synchronize: shouldSynchronize,
        logging: process.env.NODE_ENV === "development",
    }
    : {
        type: "sqlite",
        database: process.env.DB_PATH || "street_world.db",
        entities: [entities_1.UserEntity, entities_1.ProductEntity, entities_1.ContactMessageEntity, entities_1.OrderEntity, entities_1.OrderItemEntity, entities_1.PaymentEntity],
        synchronize: shouldSynchronize,
        logging: process.env.NODE_ENV === "development",
    };
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(typeOrmConfig),
            typeorm_1.TypeOrmModule.forFeature([entities_1.UserEntity, entities_1.ProductEntity, entities_1.ContactMessageEntity, entities_1.OrderEntity, entities_1.OrderItemEntity, entities_1.PaymentEntity]),
            api_module_1.ApiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map