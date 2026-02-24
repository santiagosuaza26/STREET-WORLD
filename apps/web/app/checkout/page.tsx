"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../_state/CartContext";
import { formatPrice } from "../_lib/price";

const SHIPPING_CITIES = {
  bogota: {
    label: "Bogota",
    standard: 9000,
    express: 16000,
    etaStandard: "24-48h",
    etaExpress: "12-24h"
  },
  medellin: {
    label: "Medellin",
    standard: 10000,
    express: 18000,
    etaStandard: "24-48h",
    etaExpress: "12-24h"
  },
  cali: {
    label: "Cali",
    standard: 11000,
    express: 19000,
    etaStandard: "48-72h",
    etaExpress: "24-48h"
  },
  barranquilla: {
    label: "Barranquilla",
    standard: 12000,
    express: 20000,
    etaStandard: "48-72h",
    etaExpress: "24-48h"
  }
} as const;

const PAYMENT_METHODS = [
  { value: "card", label: "Tarjeta", hint: "Credito o debito" },
  { value: "transfer", label: "Transferencia", hint: "PSE o banco" },
  { value: "cash", label: "Contra entrega", hint: "Pago al recibir" }
] as const;

export default function CheckoutPage() {
  const { items, subtotal, freeShippingThreshold, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express" | "">("");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "transfer" | "cash" | ""
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const steps = ["Contacto", "Envio", "Pago"];

  const validateEmail = (value: string) => {
    if (!value) {
      return "El correo es obligatorio";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Correo invalido";
    }
    return null;
  };

  const validateContact = () => {
    const nextErrors: Record<string, string | null> = {};
    if (!fullName.trim()) {
      nextErrors.fullName = "Nombre obligatorio";
    }
    nextErrors.email = validateEmail(email.trim());
    if (!phone.trim()) {
      nextErrors.phone = "Telefono obligatorio";
    } else if (!/^[0-9+\s-]{7,}$/.test(phone.trim())) {
      nextErrors.phone = "Telefono invalido";
    }
    return nextErrors;
  };

  const validateShipping = () => {
    const nextErrors: Record<string, string | null> = {};
    if (!city) {
      nextErrors.city = "Selecciona una ciudad";
    }
    if (!address.trim() || address.trim().length < 6) {
      nextErrors.address = "Direccion invalida";
    }
    if (!deliveryMethod) {
      nextErrors.deliveryMethod = "Selecciona un metodo";
    }
    return nextErrors;
  };

  const validatePayment = () => {
    const nextErrors: Record<string, string | null> = {};
    if (!paymentMethod) {
      nextErrors.paymentMethod = "Selecciona un metodo";
    }
    return nextErrors;
  };

  const shippingEstimate = useMemo(() => {
    if (subtotal === 0 || subtotal >= freeShippingThreshold) {
      return 0;
    }
    if (!city || !deliveryMethod) {
      return 0;
    }
    const rates = SHIPPING_CITIES[city as keyof typeof SHIPPING_CITIES];
    if (!rates) {
      return 0;
    }
    return deliveryMethod === "express" ? rates.express : rates.standard;
  }, [subtotal, freeShippingThreshold, city, deliveryMethod]);

  const shippingEta = useMemo(() => {
    if (!city || !deliveryMethod) {
      return "";
    }
    const rates = SHIPPING_CITIES[city as keyof typeof SHIPPING_CITIES];
    if (!rates) {
      return "";
    }
    return deliveryMethod === "express" ? rates.etaExpress : rates.etaStandard;
  }, [city, deliveryMethod]);

  const total = subtotal + shippingEstimate;

  const isDisabled =
    items.length === 0 ||
    isLoading ||
    step !== steps.length - 1 ||
    Object.values(fieldErrors).some((value) => value) ||
    (step === steps.length - 1 && !paymentMethod);

  const handleNext = () => {
    let nextErrors: Record<string, string | null> = {};
    if (step === 0) {
      nextErrors = validateContact();
    } else if (step === 1) {
      nextErrors = validateShipping();
    } else if (step === 2) {
      nextErrors = validatePayment();
    }

    const hasErrors = Object.values(nextErrors).some((value) => value);
    setFieldErrors((current) => ({ ...current, ...nextErrors }));
    if (!hasErrors) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }
  };

  const handleCheckout = async () => {
    setError(null);
    const nextErrors = {
      ...validateContact(),
      ...validateShipping(),
      ...validatePayment()
    };
    const hasErrors = Object.values(nextErrors).some((value) => value);
    setFieldErrors((current) => ({ ...current, ...nextErrors }));
    if (hasErrors) {
      return;
    }
    if (items.length === 0) {
      setError("Tu carrito esta vacio.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/payments/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currency: "COP",
            customerEmail: email.trim(),
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
      if (data?.orderId) {
        window.localStorage.setItem("street-world-last-order", data.orderId);
      }
      clearCart();
      if (data?.checkoutUrl && String(data.checkoutUrl).includes("placeholder")) {
        window.location.href = `/checkout/estado?orderId=${data.orderId}`;
        return;
      }
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
          <div className="checkout-stepper">
            {steps.map((label, index) => {
              const isActive = step === index;
              const isComplete = step > index;
              return (
                <div
                  key={label}
                  className={`step ${isActive ? "active" : ""} ${
                    isComplete ? "complete" : ""
                  }`}
                >
                  <span className="step-index">{index + 1}</span>
                  <span className="step-label">{label}</span>
                </div>
              );
            })}
          </div>

          {step === 0 ? (
            <div className="card checkout-panel">
              <h3>Contacto</h3>
              <p className="muted">
                Este correo recibira el resumen y estado del pedido.
              </p>
              <div className="field-row">
                <div className="form-field">
                  <label htmlFor="fullName">Nombre completo</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    onBlur={() =>
                      setFieldErrors((current) => ({
                        ...current,
                        fullName: fullName.trim() ? null : "Nombre obligatorio"
                      }))
                    }
                    placeholder="Nombre y apellido"
                    required
                  />
                  {fieldErrors.fullName ? (
                    <p className="form-error">{fieldErrors.fullName}</p>
                  ) : null}
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Telefono</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    onBlur={() =>
                      setFieldErrors((current) => ({
                        ...current,
                        phone: !phone.trim()
                          ? "Telefono obligatorio"
                          : /^[0-9+\s-]{7,}$/.test(phone.trim())
                            ? null
                            : "Telefono invalido"
                      }))
                    }
                    placeholder="300 000 0000"
                    required
                  />
                  {fieldErrors.phone ? (
                    <p className="form-error">{fieldErrors.phone}</p>
                  ) : null}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={() =>
                    setFieldErrors((current) => ({
                      ...current,
                      email: validateEmail(email.trim())
                    }))
                  }
                  placeholder="nombre@correo.com"
                  required
                />
                {fieldErrors.email ? (
                  <p className="form-error">{fieldErrors.email}</p>
                ) : null}
              </div>
              {error ? <p className="form-error" role="status">{error}</p> : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="card checkout-panel">
              <h3>Envio</h3>
              <p className="muted">
                Selecciona ciudad y metodo para calcular el envio.
              </p>
              <div className="field-row">
                <div className="form-field">
                  <label htmlFor="city">Ciudad</label>
                  <select
                    id="city"
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value);
                      setFieldErrors((current) => ({
                        ...current,
                        city: event.target.value ? null : "Selecciona una ciudad"
                      }));
                    }}
                  >
                    <option value="">Selecciona</option>
                    {Object.entries(SHIPPING_CITIES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.city ? (
                    <p className="form-error">{fieldErrors.city}</p>
                  ) : null}
                </div>
                <div className="form-field">
                  <label htmlFor="address">Direccion</label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    onBlur={() =>
                      setFieldErrors((current) => ({
                        ...current,
                        address:
                          address.trim().length >= 6 ? null : "Direccion invalida"
                      }))
                    }
                    placeholder="Calle 10 # 20-30"
                    required
                  />
                  {fieldErrors.address ? (
                    <p className="form-error">{fieldErrors.address}</p>
                  ) : null}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="notes">Indicaciones (opcional)</label>
                <input
                  id="notes"
                  type="text"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Apto, torre, punto de referencia"
                />
              </div>
              <div className="form-field">
                <label>Metodo de entrega</label>
                <div className="option-grid">
                  {["standard", "express"].map((method) => {
                    const isActive = deliveryMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        className={`option-card ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setDeliveryMethod(method as "standard" | "express");
                          setFieldErrors((current) => ({
                            ...current,
                            deliveryMethod: null
                          }));
                        }}
                      >
                        <strong>{method === "standard" ? "Estandar" : "Express"}</strong>
                        <span className="option-meta">
                          {city && SHIPPING_CITIES[city as keyof typeof SHIPPING_CITIES]
                            ? method === "express"
                              ? SHIPPING_CITIES[city as keyof typeof SHIPPING_CITIES].etaExpress
                              : SHIPPING_CITIES[city as keyof typeof SHIPPING_CITIES].etaStandard
                            : "Selecciona ciudad"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.deliveryMethod ? (
                  <p className="form-error">{fieldErrors.deliveryMethod}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="card checkout-panel">
              <h3>Pago</h3>
              <p className="muted">Selecciona el metodo de pago preferido.</p>
              <div className="option-grid">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    className={`option-card ${
                      paymentMethod === method.value ? "active" : ""
                    }`}
                    onClick={() => {
                      setPaymentMethod(method.value);
                      setFieldErrors((current) => ({
                        ...current,
                        paymentMethod: null
                      }));
                    }}
                  >
                    <strong>{method.label}</strong>
                    <span className="option-meta">{method.hint}</span>
                  </button>
                ))}
              </div>
              {fieldErrors.paymentMethod ? (
                <p className="form-error">{fieldErrors.paymentMethod}</p>
              ) : null}
              <div className="checkout-hint muted small">
                El cobro final se realizara cuando pasemos a pagos reales.
              </div>
            </div>
          ) : null}

          <div className="checkout-nav">
            {step > 0 ? (
              <button className="ghost" type="button" onClick={() => setStep(step - 1)}>
                Volver
              </button>
            ) : null}
            {step < steps.length - 1 ? (
              <button className="primary" type="button" onClick={handleNext}>
                Continuar
              </button>
            ) : (
              <button className="primary" onClick={handleCheckout} disabled={isDisabled}>
                {isLoading ? "Procesando..." : "Ir a pago"}
              </button>
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
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout-total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="checkout-total muted">
            <span>Envio estimado</span>
            <strong>{shippingEstimate ? formatPrice(shippingEstimate) : "Gratis"}</strong>
          </div>
          <div className="checkout-total checkout-grand">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p className="muted small">
            Envio gratis desde {formatPrice(freeShippingThreshold)}.
          </p>
          {shippingEta ? (
            <p className="muted small">Entrega estimada: {shippingEta}.</p>
          ) : null}
          <p className="muted small">
            Al continuar aceptas nuestros terminos y politicas de pago.
          </p>
        </div>
      </div>
    </section>
  );
}
