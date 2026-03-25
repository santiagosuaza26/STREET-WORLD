"use client";

import { useEffect, useRef, useState } from "react";
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
  color?: string;
  disabled?: boolean;
  onMissingSize?: () => void;
  onBeforeAdd?: () => boolean;
};

function isSingleSize(size: string) {
  const normalized = size.trim().toLowerCase();
  return normalized === "unica" || normalized === "única";
}

function isOutOfStock(product: Product) {
  if (product.stockCount !== undefined) {
    return product.stockCount <= 0;
  }

  return product.stock.toLowerCase().includes("agot");
}

export default function AddToCartButton({
  product,
  label = "Agregar al carrito",
  variant = "primary",
  openOnAdd = false,
  quantity = 1,
  size,
  color,
  disabled = false,
  onMissingSize,
  onBeforeAdd
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [isPending, setIsPending] = useState(false);
  const releaseTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (releaseTimer.current !== null) {
        window.clearTimeout(releaseTimer.current);
      }
    };
  }, []);

  const outOfStock = isOutOfStock(product);
  const isDisabled = disabled || outOfStock || isPending;

  const handleAdd = () => {
    if (isDisabled) {
      return;
    }

    if (onBeforeAdd && onBeforeAdd() === false) {
      return;
    }

    const requiresSize = Boolean(product.sizes && product.sizes.some((entry) => !isSingleSize(entry)));
    if (requiresSize && !size) {
      onMissingSize?.();
      return;
    }

    const selectedSize = size || product.sizes?.[0] || "Unica";

    setIsPending(true);

    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: parsePriceToNumber(product.price),
        priceLabel: product.price,
        size: selectedSize,
        color,
      },
      quantity
    );
    if (openOnAdd) {
      openCart();
    }

    releaseTimer.current = window.setTimeout(() => {
      setIsPending(false);
    }, 260);
  };

  const computedLabel = outOfStock ? "Sin stock" : isPending ? "Agregando..." : label;

  return (
    <button
      className={variant}
      onClick={handleAdd}
      type="button"
      disabled={isDisabled}
      aria-busy={isPending}
    >
      {computedLabel}
    </button>
  );
}
