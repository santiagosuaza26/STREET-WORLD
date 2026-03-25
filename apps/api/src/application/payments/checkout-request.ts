export type CheckoutItemInput = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutShippingInput = {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
};

export type CheckoutRequest = {
  currency: "COP";
  customerEmail: string;
  userId?: string;
  idempotencyKey?: string;
  shipping: CheckoutShippingInput;
  items: CheckoutItemInput[];
};
