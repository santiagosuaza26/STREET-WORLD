"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "../_data/products";

type ProductPurchaseActionsProps = {
  product: Product;
};

export default function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((current) => Math.max(1, current - 1));
  const increment = () => setQuantity((current) => Math.min(10, current + 1));

  return (
    <>
      <div className="detail-quantity">
        <span className="muted">Cantidad</span>
        <div className="qty-stepper">
          <button className="ghost" onClick={decrement} type="button">
            -
          </button>
          <span>{quantity}</span>
          <button className="ghost" onClick={increment} type="button">
            +
          </button>
        </div>
      </div>
      <div className="detail-actions">
        <AddToCartButton product={product} quantity={quantity} />
        <AddToCartButton
          product={product}
          label="Comprar ahora"
          variant="ghost"
          openOnAdd
          quantity={quantity}
        />
      </div>
    </>
  );
}
