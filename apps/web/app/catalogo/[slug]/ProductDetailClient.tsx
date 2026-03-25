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
  const [selectedColor, setSelectedColor] = useState<string>("");

  const hasSizes = product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Unica";
  const hasColors = Boolean(product.colors && product.colors.length > 0);

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
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
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
            {hasColors && (
              <div className="size-list">
                <p className="muted">Colores</p>
                <div className="chip-row">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      className={`chip ${selectedColor === color ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="muted">Stock: {product.stock}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
