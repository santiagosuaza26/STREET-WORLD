"use client";

import { useCart } from "../_state/CartContext";
import { parsePriceToNumber } from "../_lib/price";
import type { Product } from "../_data/products";

type AddToCartButtonProps = {
  product: Product;
  label?: string;
  variant?: "primary" | "ghost";
  openOnAdd?: boolean;
  quantity?: number;
};

export default function AddToCartButton({
  product,
  label = "Agregar al carrito",
  variant = "primary",
  openOnAdd = false,
  quantity = 1
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: parsePriceToNumber(product.price),
        priceLabel: product.price
      },
      quantity
    );
    if (openOnAdd) {
      openCart();
    }
  };

  return (
    <button className={variant} onClick={handleAdd} type="button">
      {label}
    </button>
  );
}
