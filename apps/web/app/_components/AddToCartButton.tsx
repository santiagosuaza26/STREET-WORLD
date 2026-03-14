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
  size?: string;
  onMissingSize?: () => void;
};

export default function AddToCartButton({
  product,
  label = "Agregar al carrito",
  variant = "primary",
  openOnAdd = false,
  quantity = 1,
  size,
  onMissingSize
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    // Validar que se haya seleccionado una talla si el producto tiene tallas
    if (product.sizes && product.sizes.length > 0 && !size) {
      onMissingSize?.();
      return;
    }

    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: parsePriceToNumber(product.price),
        priceLabel: product.price,
        size: size || "Unica"
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
