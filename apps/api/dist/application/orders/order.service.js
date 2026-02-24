"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const order_repository_1 = require("../../domain/orders/order-repository");
let OrderService = class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
    async createOrder(input) {
        if (input.items.length === 0) {
            throw new Error("El carrito no puede estar vacio");
        }
        const totalAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = {
            id: (0, crypto_1.randomUUID)(),
            customerEmail: input.customerEmail,
            currency: input.currency,
            items: input.items,
            totalAmount,
            status: "pending",
            createdAt: new Date().toISOString()
        };
        return this.repository.create(order);
    }
    async getOrder(id) {
        return this.repository.findById(id);
    }
    async updateStatus(id, status) {
        const order = await this.repository.findById(id);
        if (!order) {
            return null;
        }
        const updated = { ...order, status };
        await this.repository.update(updated);
        return updated;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(order_repository_1.ORDER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], OrderService);
//# sourceMappingURL=order.service.js.map