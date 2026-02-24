type WebhookValidationInput = {
    rawBody: string;
    signature: string;
};
export declare class WebhookValidator {
    private readonly secret;
    private readonly algo;
    private readonly allowInsecure;
    verify({ rawBody, signature }: WebhookValidationInput): boolean;
}
export {};
