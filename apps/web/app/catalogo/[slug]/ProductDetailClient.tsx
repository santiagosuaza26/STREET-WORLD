"use client";

import { useState } from "react";
import Link from "next/link";
import ProductPurchaseActions from "../../_components/ProductPurchaseActions";
import type { Product } from "../../_data/products";

type ProductDetailClientProps = {
  product: Product;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const hasSizes = product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unica";

  return (
    <section className="section product-detail">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo">Catalogo</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-panel">
            <div className="tag">{product.tag}</div>
            <p className="muted">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="price">{product.price}</p>
            <p className="lead">{product.description}</p>
            <ProductPurchaseActions 
              product={product} 
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>
          <div className="card">
            <h3>Detalles</h3>
            <ul className="detail-list">
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <div className="size-list">
              <p className="muted">Tallas disponibles</p>
              <div className="chip-row">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`chip ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <p className="muted">Stock: {product.stock}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
