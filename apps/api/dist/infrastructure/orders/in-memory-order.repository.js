"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryOrderRepository = void 0;
const common_1 = require("@nestjs/common");
let InMemoryOrderRepository = class InMemoryOrderRepository {
    constructor() {
        this.store = new Map();
    }
    async create(order) {
        this.store.set(order.id, order);
        return order;
    }
    async findById(id) {
        return this.store.get(id) ?? null;
    }
    async findByUserId(userId) {
        const results = [];
        for (const order of this.store.values()) {
            if (order.userId === userId) {
                results.push(order);
            }
        }
        return results;
    }
    async findAll() {
        return Array.from(this.store.values());
    }
    async update(id, order) {
        const existing = this.store.get(id);
        if (!existing) {
            return null;
        }
        const updated = { ...existing, ...order };
        this.store.set(id, updated);
        return updated;
    }
};
exports.InMemoryOrderRepository = InMemoryOrderRepository;
exports.InMemoryOrderRepository = InMemoryOrderRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryOrderRepository);
//# sourceMappingURL=in-memory-order.repository.js.map