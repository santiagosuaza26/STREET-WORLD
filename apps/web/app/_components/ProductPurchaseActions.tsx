"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "../_data/products";

type ProductPurchaseActionsProps = {
  product: Product;
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
};

export default function ProductPurchaseActions({ 
  product,
  selectedSize: externalSelectedSize,
  onSizeChange: externalOnSizeChange
}: ProductPurchaseActionsProps) {
  const [internalSelectedSize, setInternalSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>("");

  // Usar el tamaño externo si se proporciona, sino usar el interno
  const selectedSize = externalSelectedSize !== undefined ? externalSelectedSize : internalSelectedSize;
  
  const handleSizeChange = (size: string) => {
    if (externalOnSizeChange) {
      externalOnSizeChange(size);
    } else {
      setInternalSelectedSize(size);
    }
    setError("");
  };

  const decrement = () => setQuantity((current) => Math.max(1, current - 1));
  const increment = () => setQuantity((current) => Math.min(10, current + 1));

  const handleMissingSize = () => {
    setError("Por favor, selecciona una talla");
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const sizeRequired = hasSizes && product.sizes[0] !== "Unica";

  return (
    <>
      {/* Mensaje de error si es requerido seleccionar talla */}
      {sizeRequired && error && (
        <div className="error-box">
          <span className="error-message">{error}</span>
        </div>
      )}

      {/* Selector de Cantidad */}
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

      {/* Botones de Acción */}
      <div className="detail-actions">
        <AddToCartButton
          product={product}
          quantity={quantity}
          size={selectedSize}
          onMissingSize={handleMissingSize}
        />
        <AddToCartButton
          product={product}
          label="Comprar ahora"
          variant="ghost"
          openOnAdd
          quantity={quantity}
          size={selectedSize}
          onMissingSize={handleMissingSize}
        />
      </div>
    </>
  );
}
