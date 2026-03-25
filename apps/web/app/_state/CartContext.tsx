"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  size: string;
  color?: string;
  quantity: number;
};

type AddItemInput = {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  size: string;
  color?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: AddItemInput, quantity?: number) => void;
  removeItem: (slug: string, size: string, color?: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number, color?: string) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "street-world-cart";
const FREE_SHIPPING_THRESHOLD = 220000;
const SHIPPING_BASE = 12000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: AddItemInput, quantity = 1) => {
    const itemColor = item.color?.trim() || "";
    setItems((current) => {
      const existing = current.find(
        (entry) =>
          entry.slug === item.slug &&
          entry.size === item.size &&
          (entry.color?.trim() || "") === itemColor
      );
      if (existing) {
        return current.map((entry) =>
          entry.slug === item.slug &&
          entry.size === item.size &&
          (entry.color?.trim() || "") === itemColor
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...current, { ...item, quantity }];
    });
  };

  const removeItem = (slug: string, size: string, color?: string) => {
    const normalizedColor = color?.trim() || "";
    setItems((current) =>
      current.filter(
        (entry) =>
          !(
            entry.slug === slug &&
            entry.size === size &&
            (entry.color?.trim() || "") === normalizedColor
          )
      )
    );
  };

  const updateQuantity = (slug: string, size: string, quantity: number, color?: string) => {
    const normalizedColor = color?.trim() || "";
    if (quantity <= 0) {
      removeItem(slug, size, color);
      return;
    }
    setItems((current) =>
      current.map((entry) =>
        entry.slug === slug &&
        entry.size === size &&
        (entry.color?.trim() || "") === normalizedColor
          ? { ...entry, quantity }
          : entry
      )
    );
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = useMemo(() => {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return SHIPPING_BASE;
  }, [subtotal]);

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const value = {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    total,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
