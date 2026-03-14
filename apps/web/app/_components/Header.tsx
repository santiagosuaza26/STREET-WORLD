"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useAuth } from "../_lib/auth-context";
import { useCart } from "../_state/CartContext";
import Button from "./ui/Button";

type NavLink = { label: string; href: string; desc?: string };
type NavColumn = { heading?: string; links: NavLink[] };
type NavItem = {
  label: string;
  href: string;
  accent?: boolean;
  columns?: NavColumn[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Catálogo",
    href: "/catalogo",
    columns: [
      {
        heading: "Categorías",
        links: [
          { label: "Hoodies", href: "/catalogo?categoria=hoodies", desc: "Cortes limpios para clima frío" },
          { label: "Oversize", href: "/catalogo?categoria=oversize", desc: "Siluetas amplias con actitud" },
          { label: "Accesorios", href: "/catalogo?categoria=accesorios", desc: "Gorras, bolsos y detalles" },
          { label: "Ver todo →", href: "/catalogo" },
        ],
      },
      {
        heading: "Colecciones",
        links: [
          { label: "Drop Urbano", href: "/catalogo?coleccion=drop-urbano" },
          { label: "Edición Limitada", href: "/catalogo?coleccion=edicion-limitada" },
          { label: "Básicos Premium", href: "/catalogo?coleccion=basicos-premium" },
        ],
      },
    ],
  },
  {
    label: "Sale 🔥",
    href: "/sale",
    accent: true,
    columns: [
      {
        links: [
          { label: "Hasta 50% off", href: "/sale" },
          { label: "Últimas unidades", href: "/sale#ultimas" },
          { label: "Temporada anterior", href: "/sale#temporada" },
        ],
      },
    ],
  },
  {
    label: "Colecciones",
    href: "/#colecciones",
    columns: [
      {
        links: [
          { label: "Drop Urbano", href: "/catalogo?coleccion=drop-urbano" },
          { label: "Edición Limitada", href: "/catalogo?coleccion=edicion-limitada" },
          { label: "Básicos Premium", href: "/catalogo?coleccion=basicos-premium" },
        ],
      },
    ],
  },
  {
    label: "Nosotros",
    href: "/beneficios",
    columns: [
      {
        links: [
          { label: "Beneficios", href: "/beneficios", desc: "Por qué elegir Street World" },
          { label: "Envíos", href: "/envios", desc: "Tarifas y zonas de despacho" },
          { label: "Soporte", href: "/soporte", desc: "Ayuda y seguimiento" },
          { label: "Contacto", href: "/contacto", desc: "Escríbenos directamente" },
        ],
      },
    ],
  },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, loading, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const close = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const closeAll = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="logo" href="/" onClick={closeAll}>
            Street World
          </Link>

          {/* Desktop nav */}
          <nav className="nav" role="navigation" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`nav-group${activeMenu === item.label ? " open" : ""}`}
                onMouseEnter={() => item.columns ? open(item.label) : undefined}
                onMouseLeave={close}
              >
                <Link
                  href={item.href}
                  className={`nav-link${item.accent ? " nav-link--accent" : ""}`}
                  onClick={closeAll}
                >
                  {item.label}
                  {item.columns && <span className="nav-caret" aria-hidden="true">▾</span>}
                </Link>

                {item.columns && (
                  <div
                    className="nav-dropdown"
                    role="menu"
                    onMouseEnter={() => open(item.label)}
                    onMouseLeave={close}
                  >
                    <div
                      className="nav-dropdown-inner"
                      style={{ gridTemplateColumns: `repeat(${item.columns.length}, 1fr)` }}
                    >
                      {item.columns.map((col, ci) => (
                        <div key={ci} className="nav-dropdown-col">
                          {col.heading && (
                            <p className="nav-dropdown-heading">{col.heading}</p>
                          )}
                          <ul>
                            {col.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="nav-dropdown-link"
                                  role="menuitem"
                                  onClick={closeAll}
                                >
                                  <span className="nav-dropdown-link-label">{link.label}</span>
                                  {link.desc && (
                                    <span className="nav-dropdown-link-desc">{link.desc}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions + hamburger */}
          <div className="header-actions">
            {!loading && isAuthenticated ? (
              <>
                <Link className="button-link ghost" href="/cuenta">
                  Mi cuenta
                </Link>
                <Button variant="ghost" onClick={logout} type="button">
                  Salir
                </Button>
              </>
            ) : (
              <Link className="button-link ghost" href="/login">
                Entrar
              </Link>
            )}
            <Button className="cart-button" variant="primary" onClick={openCart} type="button">
              Carrito
              <span className="cart-badge" aria-live="polite">{totalItems}</span>
            </Button>
            <button
              className={`hamburger${mobileOpen ? " open" : ""}`}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className={`mobile-nav${mobileOpen ? " open" : ""}`} aria-label="Menú móvil">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="mobile-nav-section">
              <Link
                href={item.href}
                className={`mobile-nav-link${item.accent ? " mobile-nav-link--accent" : ""}`}
                onClick={closeAll}
              >
                {item.label}
              </Link>
              {item.columns?.flatMap((col) => col.links).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-sub"
                  onClick={closeAll}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </header>
    </>
  );
}
