"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../_state/CartContext";
import { formatPrice } from "../_lib/price";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = items.length === 0 || !email || isLoading;

  const handleCheckout = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currency: "COP",
            customerEmail: email,
            items: items.map((item) => ({
              slug: item.slug,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          })
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo iniciar el checkout.");
      }

      const data = await response.json();
      clearCart();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setIsLoading(false);
    }
  };

  return (
    <section className="section checkout">
      <div className="container checkout-grid">
        <div>
          <div className="section-title">
            <div>
              <p className="eyebrow">Checkout</p>
              <h2>Finaliza tu compra</h2>
            </div>
            <Link className="button-link ghost" href="/catalogo">
              Volver al catalogo
            </Link>
          </div>
          <div className="card">
            <h3>Contacto</h3>
            <p className="muted">
              Este correo recibira el resumen y estado del pedido.
            </p>
            <div className="form-field">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@correo.com"
                required
              />
            </div>
            {error ? <p className="form-error">{error}</p> : null}
          </div>
        </div>
        <div className="card">
          <h3>Resumen</h3>
          {items.length === 0 ? (
            <p className="muted">Tu carrito esta vacio.</p>
          ) : (
            <ul className="checkout-items">
              {items.map((item) => (
                <li key={item.slug}>
                  <span>{item.name}</span>
                  <span>{item.quantity}x</span>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout-total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <button className="primary" onClick={handleCheckout} disabled={isDisabled}>
            {isLoading ? "Procesando..." : "Ir a pago"}
          </button>
          <p className="muted small">
            Al continuar aceptas nuestros terminos y politicas de pago.
          </p>
        </div>
      </div>
    </section>
  );
}
