'use client';

import Link from 'next/link';
import Image from 'next/image';

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

interface ProductCardProps {
  product: Product;
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const hasDiscount = product.onSale && product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <article className="product-card">
      <Link href={`/catalogo/${product.id}`}>
        <div className="product-image-wrapper">
          {hasDiscount && (
            <span className="discount-badge">-{discountPercent}%</span>
          )}
          {!product.inStock && (
            <span className="stock-badge">Agotado</span>
          )}
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="product-image"
            width={800}
            height={1000}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            {hasDiscount && (
              <span className="original-price">{formatCurrency(product.price)}</span>
            )}
            <span className={hasDiscount ? "sale-price" : "current-price"}>
              {formatCurrency(displayPrice)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
