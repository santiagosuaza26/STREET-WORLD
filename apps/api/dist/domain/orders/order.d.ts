export type OrderItem = {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
};
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type Order = {
    id: string;
    userId: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
    notes?: string;
    createdAt: string;
};
