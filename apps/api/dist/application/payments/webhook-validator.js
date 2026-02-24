"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookValidator = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let WebhookValidator = class WebhookValidator {
    constructor() {
        this.secret = process.env.PAYMENTS_WEBHOOK_SECRET ?? "";
        this.algo = (process.env.PAYMENTS_WEBHOOK_ALGO ?? "hmac-sha256").toLowerCase();
        this.allowInsecure = process.env.PAYMENTS_WEBHOOK_ALLOW_INSECURE === "true";
    }
    verify({ rawBody, signature }) {
        if (!signature) {
            return this.allowInsecure && !this.secret;
        }
        if (!this.secret) {
            return this.allowInsecure;
        }
        if (this.algo !== "hmac-sha256") {
            return false;
        }
        const normalized = signature.split("=").pop()?.trim() ?? signature.trim();
        try {
            const expected = (0, crypto_1.createHmac)("sha256", this.secret)
                .update(rawBody)
                .digest("hex");
            const expectedBuffer = Buffer.from(expected, "hex");
            const receivedBuffer = Buffer.from(normalized, "hex");
            if (expectedBuffer.length !== receivedBuffer.length) {
                return false;
            }
            return (0, crypto_1.timingSafeEqual)(expectedBuffer, receivedBuffer);
        }
        catch {
            return false;
        }
    }
};
exports.WebhookValidator = WebhookValidator;
exports.WebhookValidator = WebhookValidator = __decorate([
    (0, common_1.Injectable)()
], WebhookValidator);
//# sourceMappingURL=webhook-validator.js.map