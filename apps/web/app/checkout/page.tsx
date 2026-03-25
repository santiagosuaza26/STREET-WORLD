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

type ShippingForm = {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [billingProfile, setBillingProfile] = useState<UserProfile | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine: "",
    city: "",
    country: "CO",
  });
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
        setShipping((current) => ({
          firstName: current.firstName || me.firstName || "",
          lastName: current.lastName || me.lastName || "",
          phone: current.phone || me.phone || "",
          addressLine: current.addressLine || me.addressLine || "",
          city: current.city || me.city || "",
          country: current.country || me.country || "CO",
        }));
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

  const shippingIsValid =
    shipping.firstName.trim().length >= 2 &&
    shipping.lastName.trim().length >= 2 &&
    shipping.phone.trim().length >= 7 &&
    shipping.addressLine.trim().length >= 8 &&
    shipping.city.trim().length >= 2 &&
    shipping.country.trim().length >= 2;

  const isDisabled = items.length === 0 || !effectiveEmail || !shippingIsValid || isLoading;

  const handleCheckout = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-idempotency-key": idempotencyKey,
          },
          credentials: "include",
          body: JSON.stringify({
            currency: "COP",
            customerEmail: effectiveEmail,
            userId: user?.id,
            items: items.map((item) => ({
              slug: item.slug,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
            shipping: {
              firstName: shipping.firstName.trim(),
              lastName: shipping.lastName.trim(),
              phone: shipping.phone.trim(),
              addressLine: shipping.addressLine.trim(),
              city: shipping.city.trim(),
              country: shipping.country.trim().toUpperCase(),
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo iniciar el checkout.");
      }

      const data = await response.json();
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

          <div className="card">
            <h3>Datos de envio</h3>
            <p className="muted">
              Puedes comprar sin crear cuenta, solo necesitamos estos datos para despacho.
            </p>
            <div className="billing-grid">
              <InputField
                id="shipping-first-name"
                label="Nombre"
                value={shipping.firstName}
                onChange={(event) =>
                  setShipping((current) => ({ ...current, firstName: event.target.value }))
                }
                placeholder="Nombre"
                required
              />
              <InputField
                id="shipping-last-name"
                label="Apellido"
                value={shipping.lastName}
                onChange={(event) =>
                  setShipping((current) => ({ ...current, lastName: event.target.value }))
                }
                placeholder="Apellido"
                required
              />
              <InputField
                id="shipping-phone"
                label="Telefono"
                value={shipping.phone}
                onChange={(event) =>
                  setShipping((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="3001234567"
                required
              />
              <InputField
                id="shipping-city"
                label="Ciudad"
                value={shipping.city}
                onChange={(event) =>
                  setShipping((current) => ({ ...current, city: event.target.value }))
                }
                placeholder="Bogota"
                required
              />
            </div>
            <InputField
              id="shipping-address"
              label="Direccion"
              value={shipping.addressLine}
              onChange={(event) =>
                setShipping((current) => ({ ...current, addressLine: event.target.value }))
              }
              placeholder="Calle 123 # 45-67"
              required
            />
            <InputField
              id="shipping-country"
              label="Pais"
              value={shipping.country}
              onChange={(event) =>
                setShipping((current) => ({ ...current, country: event.target.value }))
              }
              placeholder="CO"
              required
            />
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
                <li key={`${item.slug}-${item.size}-${item.color ?? ""}`}>
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
          {!shippingIsValid ? (
            <p className="muted small">
              Completa los datos de envio para continuar.
            </p>
          ) : null}
          <p className="muted small">
            Al continuar aceptas nuestros terminos y politicas de pago.
          </p>
        </div>
      </div>
    </section>
  );
}
