"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "../_components/ui/Button";
import InputField from "../_components/ui/InputField";
import { COUNTRY_OPTIONS } from "../_data/countries";
import { useAuth } from "../_lib/auth-context";
import {
  usersService,
  type UserOrder,
  type UserPaymentMethod,
  type UserProfile,
} from "../_lib/api";
import { formatPrice } from "../_lib/price";

type Section = "perfil" | "compras" | "pagos";

export default function CuentaPage() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("perfil");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingMethod, setSavingMethod] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("CO");

  const [holderName, setHolderName] = useState("");
  const [brand, setBrand] = useState("");
  const [last4, setLast4] = useState("");
  const [expMonth, setExpMonth] = useState(1);
  const [expYear, setExpYear] = useState(new Date().getFullYear());

  const statusMap = useMemo(
    () => ({
      PENDING: "Pendiente",
      PAID: "Pagado",
      SHIPPED: "Enviado",
      DELIVERED: "Entregado",
      CANCELLED: "Cancelado",
    }),
    []
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const load = async () => {
      try {
        const [me, myOrders, myMethods] = await Promise.all([
          usersService.getMe(),
          usersService.getMyOrders(),
          usersService.getMyPaymentMethods(),
        ]);

        setProfile(me);
        setOrders(myOrders);
        setPaymentMethods(myMethods);

        setFirstName(me.firstName || "");
        setLastName(me.lastName || "");
        setPhone(me.phone || "");
        setDocumentId(me.documentId || "");
        setAddressLine(me.addressLine || "");
        setCity(me.city || "");
        setCountry(me.country || "CO");
      } catch {
        setPageError("No se pudo cargar la informacion de tu cuenta.");
      }
    };

    void load();
  }, [isAuthenticated]);

  const onSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setPageError(null);
    try {
      const updated = await usersService.updateMe({
        firstName,
        lastName,
        phone,
        documentId,
        addressLine,
        city,
        country,
      });
      setProfile(updated);
    } catch {
      setPageError("No se pudo guardar tu perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const onCreatePaymentMethod = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingMethod(true);
    setPageError(null);
    try {
      const methods = await usersService.addPaymentMethod({
        holderName,
        brand,
        last4,
        expMonth,
        expYear,
        isDefault: paymentMethods.length === 0,
      });
      setPaymentMethods(methods);
      setHolderName("");
      setBrand("");
      setLast4("");
      setExpMonth(1);
      setExpYear(new Date().getFullYear());
    } catch {
      setPageError("No se pudo agregar el metodo de pago.");
    } finally {
      setSavingMethod(false);
    }
  };

  const setDefaultMethod = async (paymentMethodId: string) => {
    try {
      const methods = await usersService.updatePaymentMethod(paymentMethodId, { isDefault: true });
      setPaymentMethods(methods);
    } catch {
      setPageError("No se pudo actualizar el metodo de pago.");
    }
  };

  const removeMethod = async (paymentMethodId: string) => {
    try {
      const methods = await usersService.deletePaymentMethod(paymentMethodId);
      setPaymentMethods(methods);
    } catch {
      setPageError("No se pudo eliminar el metodo de pago.");
    }
  };

  if (loading) {
    return (
      <section className="section account">
        <div className="container">
          <div className="card">
            <p className="muted">Cargando cuenta...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section account">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">Cuenta</p>
            <h2>Tu espacio Street World</h2>
          </div>
          {isAuthenticated ? (
            <Button onClick={logout} type="button" variant="ghost">
              Cerrar sesion
            </Button>
          ) : (
            <Link className="button-link ghost" href="/login">
              Iniciar sesion
            </Link>
          )}
        </div>
        <div className="card">
          <p className="muted">Sesion activa como:</p>
          <h3>{user?.email}</h3>
          <div className="account-tabs">
            <button
              type="button"
              className={`chip ${activeSection === "perfil" ? "active" : ""}`}
              onClick={() => setActiveSection("perfil")}
            >
              Mi perfil
            </button>
            <button
              type="button"
              className={`chip ${activeSection === "compras" ? "active" : ""}`}
              onClick={() => setActiveSection("compras")}
            >
              Compras
            </button>
            <button
              type="button"
              className={`chip ${activeSection === "pagos" ? "active" : ""}`}
              onClick={() => setActiveSection("pagos")}
            >
              Metodos de pago
            </button>
          </div>

          {pageError ? <p className="form-error">{pageError}</p> : null}

          {activeSection === "perfil" && (
            <form className="account-grid" onSubmit={onSaveProfile}>
              <InputField id="firstName" label="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <InputField id="lastName" label="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <InputField id="phone" label="Telefono" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputField id="documentId" label="Documento" value={documentId} onChange={(e) => setDocumentId(e.target.value)} />
              <InputField id="addressLine" label="Direccion" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
              <InputField id="city" label="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
              <div className="form-field">
                <label htmlFor="country">Pais</label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRY_OPTIONS.map((countryOption) => (
                    <option key={countryOption.code} value={countryOption.code}>
                      {countryOption.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="account-actions">
                <Button type="submit" variant="primary" disabled={savingProfile}>
                  {savingProfile ? "Guardando..." : "Guardar datos"}
                </Button>
                <p className="muted small">Cuenta creada: {profile ? new Date(profile.createdAt).toLocaleDateString("es-CO") : "-"}</p>
              </div>
            </form>
          )}

          {activeSection === "compras" && (
            <div className="account-list">
              {orders.length === 0 ? (
                <p className="muted">Aun no tienes compras asociadas a tu cuenta.</p>
              ) : (
                orders.map((order) => (
                  <article key={order.id} className="account-item">
                    <div className="account-item-row">
                      <strong>Pedido {order.id.slice(0, 8)}</strong>
                      <span className="chip">{statusMap[order.status]}</span>
                    </div>
                    <p className="muted small">{new Date(order.createdAt).toLocaleString("es-CO")}</p>
                    <p><strong>{formatPrice(order.total)}</strong></p>
                    <ul className="account-sublist">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.productId}`}>
                          {item.productName} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))
              )}
            </div>
          )}

          {activeSection === "pagos" && (
            <div className="account-payments">
              <form className="account-grid" onSubmit={onCreatePaymentMethod}>
                <InputField id="holderName" label="Titular" value={holderName} onChange={(e) => setHolderName(e.target.value)} required />
                <InputField id="brand" label="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Visa, MasterCard" required />
                <InputField id="last4" label="Ultimos 4" value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} required />
                <InputField id="expMonth" label="Mes" type="number" value={String(expMonth)} onChange={(e) => setExpMonth(Number(e.target.value || 1))} required />
                <InputField id="expYear" label="Ano" type="number" value={String(expYear)} onChange={(e) => setExpYear(Number(e.target.value || new Date().getFullYear()))} required />
                <div className="account-actions">
                  <Button type="submit" variant="primary" disabled={savingMethod}>
                    {savingMethod ? "Guardando..." : "Agregar metodo"}
                  </Button>
                </div>
              </form>

              <div className="account-list">
                {paymentMethods.length === 0 ? (
                  <p className="muted">No tienes metodos de pago guardados.</p>
                ) : (
                  paymentMethods.map((method) => (
                    <article key={method.id} className="account-item">
                      <div className="account-item-row">
                        <strong>{method.brand} ****{method.last4}</strong>
                        {method.isDefault && <span className="chip active">Principal</span>}
                      </div>
                      <p className="muted small">Titular: {method.holderName}</p>
                      <p className="muted small">Vence: {String(method.expMonth).padStart(2, "0")}/{method.expYear}</p>
                      <div className="account-actions-inline">
                        {!method.isDefault && (
                          <Button type="button" variant="ghost" onClick={() => setDefaultMethod(method.id)}>
                            Marcar principal
                          </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={() => removeMethod(method.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
