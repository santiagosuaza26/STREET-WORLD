"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "../_lib/price";
import { useCart } from "../_state/CartContext";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal
  } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" onClick={closeCart}>
      <div className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">Carrito</p>
            <h3>Tu seleccion</h3>
          </div>
          <button className="ghost" onClick={closeCart} type="button" aria-label="Cerrar carrito">
            X
          </button>
        </div>
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito esta vacio.</p>
            <button className="primary" onClick={closeCart} type="button">
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={`${item.slug}-${item.size}-${item.color ?? ""}`}>
                  <div>
                    <h4>{item.name}</h4>
                    <p className="muted">{item.priceLabel}</p>
                    {item.size && item.size !== "Unica" && (
                      <p className="size-label">Talla: {item.size}</p>
                    )}
                    {item.color ? <p className="size-label">Color: {item.color}</p> : null}
                  </div>
                  <div className="cart-qty">
                    <button
                      className="ghost"
                      onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1, item.color)}
                      type="button"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="ghost"
                      onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1, item.color)}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      className="ghost"
                      onClick={() => removeItem(item.slug, item.size, item.color)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-summary">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="cart-actions">
                <button className="ghost" onClick={clearCart} type="button">
                  Vaciar carrito
                </button>
                <Link className="button-link primary" href="/checkout" onClick={closeCart}>
                  Ir a checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
