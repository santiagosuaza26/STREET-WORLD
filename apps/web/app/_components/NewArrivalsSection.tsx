'use client';

import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  isNewArrival: boolean;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  inStock: boolean;
  createdAt: string;
}

interface NewArrivalsSectionProps {
  products: Product[];
}

export default function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const newArrivals = products
    .filter(p => p.isNewArrival)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  if (newArrivals.length === 0) return null;

  return (
    <section className="section new-arrivals-section">
      <div className="container">
        <div className="section-title">
          <h2>🆕 Novedades</h2>
          <p className="muted">
            Lo último en moda urbana acaba de llegar
          </p>
        </div>
        
        <div className="grid products-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
