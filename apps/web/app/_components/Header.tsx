"use client";

import Link from "next/link";
import { useCart } from "../_state/CartContext";

export default function Header() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          Street World
        </Link>
        <nav className="nav">
          <Link href="/catalogo">Catalogo</Link>
          <Link href="/#colecciones">Colecciones</Link>
          <Link href="/#beneficios">Beneficios</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <div className="header-actions">
          <Link className="button-link ghost" href="/login">
            Entrar
          </Link>
          <button className="primary cart-button" onClick={openCart} type="button">
            Carrito
            <span className="cart-badge" aria-live="polite">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
