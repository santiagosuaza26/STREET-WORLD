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
        if (!input.userId) {
            throw new common_1.BadRequestException("Usuario requerido");
        }
        if (input.items.length === 0) {
            throw new common_1.BadRequestException("El carrito no puede estar vacio");
        }
        for (const item of input.items) {
            if (!item.productId || !item.productName) {
                throw new common_1.BadRequestException("Item invalido");
            }
            if (!Number.isFinite(item.unitPrice) || item.unitPrice <= 0) {
                throw new common_1.BadRequestException("Precio invalido");
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new common_1.BadRequestException("Cantidad invalida");
            }
            if (!Number.isFinite(item.subtotal) || item.subtotal <= 0) {
                throw new common_1.BadRequestException("Subtotal invalido");
            }
        }
        const total = input.items.reduce((sum, item) => sum + item.subtotal, 0);
        if (total <= 0) {
            throw new common_1.BadRequestException("Total invalido");
        }
        const order = {
            id: (0, crypto_1.randomUUID)(),
            userId: input.userId,
            items: input.items,
            total,
            status: "PENDING",
            notes: input.notes,
            createdAt: new Date().toISOString()
        };
        return this.repository.create(order);
    }
    async getOrder(id) {
        return this.repository.findById(id);
    }
    async getUserOrders(userId) {
        return this.repository.findByUserId(userId);
    }
    async getAllOrders() {
        return this.repository.findAll();
    }
    async updateStatus(id, status) {
        const order = await this.repository.findById(id);
        if (!order) {
            throw new common_1.BadRequestException("Orden no encontrada");
        }
        return this.repository.update(id, { status });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(order_repository_1.ORDER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], OrderService);
//# sourceMappingURL=order.service.js.map