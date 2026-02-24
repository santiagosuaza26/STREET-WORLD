export type OrderItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  id: string;
  customerEmail: string;
  currency: "COP";
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};
