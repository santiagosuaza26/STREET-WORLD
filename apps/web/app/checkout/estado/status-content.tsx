"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "../../_lib/price";
import { useCart } from "../../_state/CartContext";

type OrderResponse = {
  id: string;
  userId: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: string;
};

export default function CheckoutStatusContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartClearedAfterPaid, setCartClearedAfterPaid] = useState(false);

  const isPaid =
    order?.status === "PAID" ||
    order?.status === "SHIPPED" ||
    order?.status === "DELIVERED";

  const statusLabel = useMemo(() => {
    if (!order) {
      return "";
    }
    if (order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED") {
      return "Compra confirmada";
    }
    if (order.status === "CANCELLED") {
      return "Pago rechazado";
    }
    return "Pago pendiente";
  }, [order]);

  useEffect(() => {
    if (isPaid && !cartClearedAfterPaid) {
      clearCart();
      setCartClearedAfterPaid(true);
    }
  }, [cartClearedAfterPaid, clearCart, isPaid]);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("No se encontro el pedido");
        }
        const data = (await response.json()) as OrderResponse;
        if (!isMounted) {
          return;
        }
        setOrder(data);
        setError(null);
        if (data.status === "PENDING") {
          timer = setTimeout(fetchStatus, 5000);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [apiUrl, orderId]);

  if (!orderId) {
    return (
      <section className="section checkout-status">
        <div className="container">
          <div className="card">
            <h2>Estado del pedido</h2>
            <p className="muted">No se encontro un pedido para validar.</p>
            <Link className="button-link ghost" href="/catalogo">
              Volver al catalogo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-status">
      <div className="container status-grid">
        <div className="card">
          <p className="eyebrow">Estado del pago</p>
          <h2>{statusLabel || "Validando pago..."}</h2>
          <div className={`status-pill status-${(order?.status ?? "PENDING").toLowerCase()}`}>
            {(order?.status ?? "PENDING").toLowerCase()}
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          {order ? (
            <div className="status-details">
              <div>
                <span className="muted">Pedido</span>
                <strong>{order.id}</strong>
              </div>
              <div>
                <span className="muted">Total</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
              <div>
                <span className="muted">Cuenta</span>
                <strong>{order.userId === "guest" ? "Invitado" : order.userId}</strong>
              </div>
              <div>
                <span className="muted">Fecha</span>
                <strong>{new Date(order.createdAt).toLocaleString("es-CO")}</strong>
              </div>
            </div>
          ) : null}
          <div className="status-actions">
            <Link className="button-link ghost" href="/catalogo">
              Seguir comprando
            </Link>
          </div>
        </div>
        <div className="card status-help">
          <h3>Que sigue?</h3>
          <p className="muted">
            Si el pago esta pendiente, mantente en esta pantalla. Vamos a actualizar
            automaticamente el estado.
          </p>
          <p className="muted">
            Si el pago fue rechazado, puedes intentar nuevamente desde el catalogo.
          </p>
          {isLoading ? <p className="muted small">Actualizando estado...</p> : null}
        </div>
      </div>
    </section>
  );
}
