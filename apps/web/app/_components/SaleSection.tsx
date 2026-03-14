'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  inStock: boolean;
}

interface SaleSectionProps {
  products: Product[];
}

export default function SaleSection({ products }: SaleSectionProps) {
  const saleProducts = products.filter(p => p.onSale).slice(0, 8);

  if (saleProducts.length === 0) return null;

  return (
    <section className="section sale-section">
      <div className="container">
        <div className="section-title">
          <h2>🔥 SALE - Ofertas Especiales</h2>
          <p className="muted">
            Aprovecha nuestras ofertas exclusivas. ¡Descuentos de hasta 50%!
          </p>
        </div>
        
        <div className="grid products-grid">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="section-cta">
          <Link className="button-link primary" href="/sale">
            Ver todas las ofertas
          </Link>
        </div>
      </div>
    </section>
  );
}
