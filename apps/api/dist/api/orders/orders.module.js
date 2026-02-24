"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_controller_1 = require("./orders.controller");
const order_service_1 = require("../../application/orders/order.service");
const order_repository_1 = require("../../domain/orders/order-repository");
const in_memory_order_repository_1 = require("../../infrastructure/orders/in-memory-order.repository");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        controllers: [orders_controller_1.OrdersController],
        providers: [
            order_service_1.OrderService,
            {
                provide: order_repository_1.ORDER_REPOSITORY,
                useClass: in_memory_order_repository_1.InMemoryOrderRepository
            }
        ],
        exports: [order_service_1.OrderService]
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map