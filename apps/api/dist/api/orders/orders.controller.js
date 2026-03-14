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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../application/orders/order.service");
const dtos_1 = require("./dtos");
let OrdersController = class OrdersController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getAll(req) {
        const userId = req.user?.sub;
        if (userId) {
            return this.orderService.getUserOrders(userId);
        }
        return this.orderService.getAllOrders();
    }
    async getOrder(id) {
        const order = await this.orderService.getOrder(id);
        if (!order) {
            throw new common_1.NotFoundException("Pedido no encontrado");
        }
        return order;
    }
    async create(dto, req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.BadRequestException("Usuario no autenticado");
        }
        const itemsWithSubtotal = dto.items.map(item => ({
            ...item,
            subtotal: item.unitPrice * item.quantity
        }));
        return this.orderService.createOrder({
            userId,
            items: itemsWithSubtotal,
            notes: dto.notes
        });
    }
    async updateStatus(id, body) {
        const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(body.status)) {
            throw new common_1.BadRequestException("Estado invalido");
        }
        const updated = await this.orderService.updateStatus(id, body.status);
        if (!updated) {
            throw new common_1.NotFoundException("Pedido no encontrado");
        }
        return updated;
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)("orders"),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map