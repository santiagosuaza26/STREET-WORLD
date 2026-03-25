"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "../_data/products";

type ProductPurchaseActionsProps = {
  product: Product;
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
};

function isSingleSize(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized === "unica" || normalized === "única";
}

export default function ProductPurchaseActions({ 
  product,
  selectedSize: externalSelectedSize,
  onSizeChange: externalOnSizeChange,
  selectedColor: externalSelectedColor,
  onColorChange: externalOnColorChange
}: ProductPurchaseActionsProps) {
  const [internalSelectedSize, setInternalSelectedSize] = useState<string>("");
  const [internalSelectedColor, setInternalSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>("");

  // Usar el tamaño externo si se proporciona, sino usar el interno
  const selectedSize = externalSelectedSize !== undefined ? externalSelectedSize : internalSelectedSize;
  const selectedColor =
    externalSelectedColor !== undefined ? externalSelectedColor : internalSelectedColor;
  
  const handleSizeChange = (size: string) => {
    if (externalOnSizeChange) {
      externalOnSizeChange(size);
    } else {
      setInternalSelectedSize(size);
    }
    setError("");
  };

  const handleColorChange = (color: string) => {
    if (externalOnColorChange) {
      externalOnColorChange(color);
    } else {
      setInternalSelectedColor(color);
    }
    setError("");
  };

  const decrement = () => setQuantity((current) => Math.max(1, current - 1));
  const increment = () => setQuantity((current) => Math.min(10, current + 1));

  const handleMissingSize = () => {
    setError("Por favor, selecciona una talla");
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const sizeRequired = hasSizes && product.sizes.some((size) => !isSingleSize(size));
  const hasColors = product.colors && product.colors.length > 0;
  const colorRequired = Boolean(product.colors && product.colors.length > 1);
  const outOfStock =
    product.stockCount !== undefined
      ? product.stockCount <= 0
      : product.stock.toLowerCase().includes("agot");

  const validateBeforeAdd = () => {
    if (sizeRequired && !selectedSize) {
      setError("Por favor, selecciona una talla");
      return false;
    }

    if (colorRequired && !selectedColor) {
      setError("Por favor, selecciona un color");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <>
      {/* Mensaje de error si es requerido seleccionar talla */}
      {sizeRequired && error && (
        <div className="error-box">
          <span className="error-message">{error}</span>
        </div>
      )}

      {hasSizes && (
        <div className="detail-option-group">
          <span className="muted">Talla</span>
          <div className="chip-row">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`chip ${selectedSize === size ? "active" : ""}`}
                onClick={() => handleSizeChange(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasColors && (
        <div className="detail-option-group">
          <span className="muted">Color</span>
          <div className="chip-row">
            {product.colors?.map((color) => (
              <button
                key={color}
                className={`chip ${selectedColor === color ? "active" : ""}`}
                onClick={() => handleColorChange(color)}
                type="button"
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Cantidad */}
      <div className="detail-quantity">
        <span className="muted">Cantidad</span>
        <div className="qty-stepper">
          <button className="ghost" onClick={decrement} type="button" disabled={quantity <= 1 || outOfStock}>
            -
          </button>
          <span>{quantity}</span>
          <button className="ghost" onClick={increment} type="button" disabled={quantity >= 10 || outOfStock}>
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
          color={selectedColor}
          disabled={outOfStock}
          onMissingSize={handleMissingSize}
          onBeforeAdd={validateBeforeAdd}
        />
        <AddToCartButton
          product={product}
          label="Comprar ahora"
          variant="ghost"
          openOnAdd
          quantity={quantity}
          size={selectedSize}
          color={selectedColor}
          disabled={outOfStock}
          onMissingSize={handleMissingSize}
          onBeforeAdd={validateBeforeAdd}
        />
      </div>
    </>
  );
}
