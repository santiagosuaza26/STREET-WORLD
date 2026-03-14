"use client";

import AddToCartButton from "./AddToCartButton";
import type { Product } from "../_data/products";

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <div className="grid products">
      {products.map((product) => (
        <article key={product.slug} className="card product">
          <div className="tag">{product.tag || "Destacado"}</div>
          <h3>{product.name}</h3>
          <p className="price">{product.price}</p>
          <AddToCartButton product={product} />
        </article>
      ))}
    </div>
  );
}
