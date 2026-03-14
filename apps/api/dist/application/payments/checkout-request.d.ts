export type CheckoutItemInput = {
    slug: string;
    name: string;
    price: number;
    quantity: number;
};
export type CheckoutRequest = {
    currency: "COP";
    customerEmail: string;
    userId?: string;
    items: CheckoutItemInput[];
};
