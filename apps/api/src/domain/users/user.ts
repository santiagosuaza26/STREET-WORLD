export type UserPaymentMethod = {
  id: string;
  holderName: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  refreshTokenHash?: string;
  refreshTokenExpiresAt?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentId?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  paymentMethods?: UserPaymentMethod[];
  createdAt: string;
  updatedAt?: string;
};
