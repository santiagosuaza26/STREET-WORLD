"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWebhookPayload = normalizeWebhookPayload;
function normalizeWebhookPayload(payload) {
    const data = payload;
    const reference = data?.reference ?? data?.data?.transaction?.reference ?? data?.data?.reference;
    const rawStatus = data?.status ?? data?.data?.transaction?.status ?? data?.data?.status;
    if (!reference || !rawStatus) {
        return null;
    }
    return {
        reference,
        status: mapStatus(rawStatus)
    };
}
function mapStatus(status) {
    const normalized = status.toLowerCase();
    if (["approved", "paid", "succeeded", "success"].includes(normalized)) {
        return "paid";
    }
    if (["declined", "failed", "error", "canceled", "cancelled"].includes(normalized)) {
        return "failed";
    }
    return "pending";
}
//# sourceMappingURL=webhook-normalizer.js.map