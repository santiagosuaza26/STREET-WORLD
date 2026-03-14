import Link from "next/link";
import { perks } from "../_data/catalog";

export default function BeneficiosPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <span>Beneficios</span>
          </div>
          <div className="hero-copy" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Beneficios reales para crecer</h1>
            <p className="lead">
              Diseñado para clientes y operaciones que quieren escalar. Aquí te ofrecemos ventajas que marcan la diferencia.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
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

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>¿Por qué elegir Street World?</h2>
          </div>
          <div className="grid cards">
            <article className="card">
              <h3>🎨 Diseño Colombiano</h3>
              <p className="muted">
                Cada pieza es diseñada pensando en el estilo urbano latinoamericano, con calidad premium y atención al detalle.
              </p>
            </article>
            <article className="card">
              <h3>💳 Métodos de Pago Locales</h3>
              <p className="muted">
                Acepta pagos en pesos colombianos con PSE, tarjetas débito/crédito, Nequi y más opciones que facilitan tu compra.
              </p>
            </article>
            <article className="card">
              <h3>📦 Envíos Confiables</h3>
              <p className="muted">
                Trabajamos con las mejores transportadoras de Colombia para garantizar entregas rápidas y seguras a todo el país.
              </p>
            </article>
            <article className="card">
              <h3>🔄 Devoluciones Fáciles</h3>
              <p className="muted">
                Si no quedas satisfecho con tu compra, tienes 30 días para devolverla sin complicaciones.
              </p>
            </article>
            <article className="card">
              <h3>👥 Comunidad</h3>
              <p className="muted">
                Más que una marca, somos una comunidad de personas que viven y respiran cultura urbana.
              </p>
            </article>
            <article className="card">
              <h3>🌱 Sostenibilidad</h3>
              <p className="muted">
                Comprometidos con prácticas responsables en producción y empaque, reduciendo nuestro impacto ambiental.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section newsletter">
        <div className="container newsletter-inner">
          <div>
            <h2>¿Listo para unirte?</h2>
            <p className="muted">
              Explora nuestro catálogo y descubre por qué somos la marca preferida del streetwear colombiano.
            </p>
          </div>
          <Link className="button-link primary" href="/catalogo">
            Explorar Catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
