'use client';

import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  isBestSeller: boolean;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  inStock: boolean;
}

interface BestSellersSectionProps {
  products: Product[];
}

export default function BestSellersSection({ products }: BestSellersSectionProps) {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);

  if (bestSellers.length === 0) return null;

  return (
    <section className="section bestsellers-section">
      <div className="container">
        <div className="section-title">
          <h2>⭐ Best Sellers</h2>
          <p className="muted">
            Los productos más populares entre nuestros clientes
          </p>
        </div>
        
        <div className="grid products-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
