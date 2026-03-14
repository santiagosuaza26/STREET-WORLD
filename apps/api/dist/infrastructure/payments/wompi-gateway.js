"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WompiGateway = void 0;
const common_1 = require("@nestjs/common");
let WompiGateway = class WompiGateway {
    async createCheckoutSession(input) {
        const template = process.env.PAYMENTS_CHECKOUT_URL_TEMPLATE ??
            "http://localhost:3000/checkout/estado?orderId={reference}";
        const checkoutUrl = template
            .replace("{reference}", encodeURIComponent(input.reference))
            .replace("{email}", encodeURIComponent(input.customerEmail))
            .replace("{amount}", encodeURIComponent(String(input.amount)))
            .replace("{currency}", encodeURIComponent(input.currency));
        return {
            provider: "wompi",
            checkoutUrl,
            reference: input.reference
        };
    }
};
exports.WompiGateway = WompiGateway;
exports.WompiGateway = WompiGateway = __decorate([
    (0, common_1.Injectable)()
], WompiGateway);
//# sourceMappingURL=wompi-gateway.js.map