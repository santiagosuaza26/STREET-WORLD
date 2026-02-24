"use client";

import Link from "next/link";
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true">
      <div className="cart-drawer">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Carrito</p>
            <h3>Tu seleccion</h3>
          </div>
          <button className="ghost" onClick={closeCart} type="button">
            Cerrar
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
                <div className="cart-item" key={item.slug}>
                  <div>
                    <h4>{item.name}</h4>
                    <p className="muted">{item.priceLabel}</p>
                  </div>
                  <div className="cart-qty">
                    <button
                      className="ghost"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      type="button"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="ghost"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      className="ghost"
                      onClick={() => removeItem(item.slug)}
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
