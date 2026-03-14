import Link from 'next/link';
import ProductCard from '../_components/ProductCard';
import { sampleProducts } from '../_data/sample-products';

export default function SalePage() {
  const saleProducts = sampleProducts.filter(p => p.onSale);

  return (
    <main className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="section-title" style={{ marginBottom: '48px' }}>
        <h1>🔥 SALE - Ofertas Especiales</h1>
        <p className="muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Aprovecha descuentos de hasta 50% en productos seleccionados. Ofertas por tiempo limitado.
        </p>
      </div>

      {saleProducts.length > 0 ? (
        <div className="grid products-grid" style={{ marginBottom: '48px' }}>
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p className="muted">No hay ofertas disponibles en este momento.</p>
          <Link href="/catalogo" className="button-link primary" style={{ marginTop: '24px', display: 'inline-block' }}>
            Ver todos los productos
          </Link>
        </div>
      )}

      <div className="section-cta">
        <Link href="/catalogo" className="button-link ghost">
          Ver todo el catálogo
        </Link>
      </div>
    </main>
  );
}
