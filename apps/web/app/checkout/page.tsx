"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "../_components/ui/Button";
import InputField from "../_components/ui/InputField";
import { getCountryNameByCode } from "../_data/countries";
import { useCart } from "../_state/CartContext";
import { usersService, type UserProfile } from "../_lib/api";
import { useAuth } from "../_lib/auth-context";
import { formatPrice } from "../_lib/price";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [billingProfile, setBillingProfile] = useState<UserProfile | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setBillingProfile(null);
      setBillingLoading(false);
      setBillingError(null);
      return;
    }

    const loadBilling = async () => {
      setBillingLoading(true);
      setBillingError(null);
      try {
        const me = await usersService.getMe();
        setBillingProfile(me);
        if (me.email) {
          setEmail((current) => current || me.email);
        }
      } catch {
        setBillingError("No se pudieron cargar tus datos de facturacion.");
      } finally {
        setBillingLoading(false);
      }
    };

    void loadBilling();
  }, [isAuthenticated]);

  const effectiveEmail = email || billingProfile?.email || user?.email || "";

  const documentLabel = useMemo(() => {
    const raw = billingProfile?.documentId;
    if (!raw) {
      return "No registrado";
    }

    const [type, ...rest] = raw.split("-");
    if (!type || rest.length === 0) {
      return raw;
    }
    return `${type}: ${rest.join("-")}`;
  }, [billingProfile?.documentId]);

  const hasBillingData =
    Boolean(billingProfile?.firstName?.trim()) &&
    Boolean(billingProfile?.lastName?.trim()) &&
    Boolean(billingProfile?.documentId?.trim()) &&
    Boolean(billingProfile?.addressLine?.trim()) &&
    Boolean(billingProfile?.city?.trim()) &&
    Boolean(billingProfile?.country?.trim());

  const fullName = `${billingProfile?.firstName ?? ""} ${billingProfile?.lastName ?? ""}`.trim();
  const countryName = getCountryNameByCode(billingProfile?.country);

  const isDisabled = items.length === 0 || !effectiveEmail || isLoading;

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
            customerEmail: effectiveEmail,
            userId: user?.id,
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
            <InputField
              id="email"
              label="Correo"
              type="email"
              value={effectiveEmail}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@correo.com"
              required
            />
            {error ? <p className="form-error">{error}</p> : null}
          </div>

          <div className="card billing-summary">
            <div className="billing-summary-head">
              <h3>Datos de facturacion</h3>
              {billingLoading ? <span className="muted small">Cargando...</span> : null}
            </div>

            {billingError ? <p className="form-error">{billingError}</p> : null}

            {!isAuthenticated ? (
              <p className="muted">
                Inicia sesion para usar tus datos de facturacion de forma automatica.
              </p>
            ) : (
              <>
                <div className="billing-grid">
                  <div>
                    <span className="muted">Cliente</span>
                    <strong>{fullName || "No registrado"}</strong>
                  </div>
                  <div>
                    <span className="muted">Documento</span>
                    <strong>{documentLabel}</strong>
                  </div>
                  <div>
                    <span className="muted">Telefono</span>
                    <strong>{billingProfile?.phone || "No registrado"}</strong>
                  </div>
                  <div>
                    <span className="muted">Direccion</span>
                    <strong>
                      {billingProfile?.addressLine
                        ? `${billingProfile.addressLine}, ${billingProfile.city}, ${countryName}`
                        : "No registrada"}
                    </strong>
                  </div>
                </div>

                {!hasBillingData ? (
                  <p className="billing-warning">
                    Completa tus datos en <Link href="/cuenta">Mi cuenta</Link> para generar factura electronica completa sin friccion.
                  </p>
                ) : (
                  <p className="muted small">
                    Estos datos se usaran automaticamente para tu proceso de compra y facturacion.
                  </p>
                )}
              </>
            )}
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
          <Button onClick={handleCheckout} disabled={isDisabled} variant="primary">
            {isLoading ? "Procesando..." : "Ir a pago"}
          </Button>
          <p className="muted small">
            Al continuar aceptas nuestros terminos y politicas de pago.
          </p>
        </div>
      </div>
    </section>
  );
}
