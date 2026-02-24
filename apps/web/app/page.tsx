import Link from "next/link";
import { categories, featuredProducts, perks } from "./_data/catalog";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Street World · Colombia</p>
            <h1>La calle no espera. Viste con identidad.</h1>
            <p className="lead">
              Colecciones urbanas hechas para moverse rapido, con pagos locales
              y envios confiables.
            </p>
            <div className="actions">
              <Link className="button-link primary" href="/catalogo">
                Explorar catalogo
              </Link>
              <Link className="button-link ghost" href="/#colecciones">
                Ver colecciones
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat">48h</span>
                <span className="muted">Envios principales</span>
              </div>
              <div>
                <span className="stat">COP</span>
                <span className="muted">Pagos locales</span>
              </div>
              <div>
                <span className="stat">24/7</span>
                <span className="muted">Soporte humano</span>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-card">
              <p className="muted">Coleccion destacada</p>
              <h3>Distrito Nocturno</h3>
              <p className="small">
                Capas, tonos tierra y texturas densas para noches en movimiento.
              </p>
              <Link className="button-link primary" href="/catalogo">
                Comprar ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="beneficios">
        <div className="container">
          <div className="section-title">
            <h2>Beneficios reales para crecer</h2>
            <p className="muted">
              Pensado para clientes y para operaciones que quieren escalar.
            </p>
          </div>
          <div className="grid cards">
            {perks.map((perk) => (
              <article key={perk.title} className="card">
                <h3>{perk.title}</h3>
                <p className="muted">{perk.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="catalogo">
        <div className="container">
          <div className="section-title">
            <h2>Catalogo en movimiento</h2>
            <p className="muted">
              Lineas esenciales para la calle, listas para combinar.
            </p>
          </div>
          <div className="grid categories">
            {categories.map((category) => (
              <article key={category.title} className="card">
                <h3>{category.title}</h3>
                <p className="muted">{category.description}</p>
                <Link className="button-link ghost" href="/catalogo">
                  Ver mas
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="colecciones">
        <div className="container">
          <div className="section-title">
            <h2>Favoritos de la comunidad</h2>
            <p className="muted">
              Productos elegidos por quienes viven la ciudad.
            </p>
          </div>
          <div className="grid products">
            {featuredProducts.map((product) => (
              <article key={product.name} className="card product">
                <div className="tag">{product.tag}</div>
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <button className="primary">Agregar al carrito</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section newsletter">
        <div className="container newsletter-inner">
          <div>
            <h2>Recibe lanzamientos antes que nadie</h2>
            <p className="muted">
              Acceso prioritario a drops, descuentos y eventos locales.
            </p>
          </div>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu correo" />
            <button className="primary" type="submit">
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
