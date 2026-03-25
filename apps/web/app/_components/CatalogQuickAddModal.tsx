"use client";

import { useEffect, useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "../_data/products";

type CatalogQuickAddModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

function isSingleSize(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized === "unica" || normalized === "única";
}

export default function CatalogQuickAddModal({
  product,
  isOpen,
  onClose,
}: CatalogQuickAddModalProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(product);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const sizes = useMemo(() => activeProduct?.sizes ?? [], [activeProduct]);
  const colors = useMemo(() => activeProduct?.colors ?? [], [activeProduct]);
  const requiresSize = sizes.length > 0 && sizes.some((size) => !isSingleSize(size));
  const requiresColor = colors.length > 1;
  const outOfStock =
    activeProduct?.stockCount !== undefined
      ? activeProduct.stockCount <= 0
      : activeProduct?.stock.toLowerCase().includes("agot") ?? false;

  useEffect(() => {
    if (isOpen && product) {
      setActiveProduct(product);
      setIsRendered(true);
      setIsClosing(false);
      return;
    }

    if (!isOpen && isRendered) {
      setIsClosing(true);
      const timeout = window.setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
        setActiveProduct(null);
      }, 180);

      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [isOpen, product, isRendered]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  useEffect(() => {
    if (!isOpen || !activeProduct) {
      return;
    }

    setQuantity(1);
    setError("");
    setSelectedSize(requiresSize ? "" : sizes[0] ?? "Unica");
    setSelectedColor(colors[0] ?? "");
  }, [isOpen, activeProduct, requiresSize, sizes, colors]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isRendered || !activeProduct) {
    return null;
  }

  const decrement = () => setQuantity((current) => Math.max(1, current - 1));
  const increment = () => setQuantity((current) => Math.min(10, current + 1));

  const validateBeforeAdd = () => {
    if (outOfStock) {
      setError("Este producto esta agotado por ahora.");
      return false;
    }

    if (requiresSize && !selectedSize) {
      setError("Selecciona una talla para continuar.");
      return false;
    }

    if (requiresColor && !selectedColor) {
      setError("Selecciona un color para continuar.");
      return false;
    }

    setError("");
    onClose();
    return true;
  };

  return (
    <div
      className={`quick-add-overlay ${isClosing ? "closing" : "open"}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={`quick-add-modal ${isClosing ? "closing" : "open"}`} onClick={(event) => event.stopPropagation()}>
        <div className="quick-add-header">
          <div>
            <p className="eyebrow">Agregar al carrito</p>
            <h3>{activeProduct.name}</h3>
          </div>
          <button className="ghost" type="button" onClick={onClose} aria-label="Cerrar ventana">
            X
          </button>
        </div>

        <p className="muted">{activeProduct.price}</p>
        <p className="small">Stock: {activeProduct.stock}</p>

        {requiresSize && (
          <div className="quick-add-group">
            <p className="muted">Talla</p>
            <div className="chip-row">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`chip ${selectedSize === size ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setError("");
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="quick-add-group">
            <p className="muted">Color</p>
            <div className="chip-row">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`chip ${selectedColor === color ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setError("");
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="quick-add-group">
          <p className="muted">Cantidad</p>
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

        {error ? <p className="error-message">{error}</p> : null}

        <div className="quick-add-actions">
          <AddToCartButton
            product={activeProduct}
            label="Agregar"
            variant="primary"
            openOnAdd
            quantity={quantity}
            size={selectedSize || "Unica"}
            color={selectedColor || undefined}
            disabled={outOfStock}
            onBeforeAdd={validateBeforeAdd}
          />
        </div>
      </div>
    </div>
  );
}
