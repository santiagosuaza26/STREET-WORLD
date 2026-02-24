"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { parsePriceToNumber } from "../_lib/price";
import type { Product } from "../_data/products";

type CatalogFiltersProps = {
  products: Product[];
  categories: string[];
};

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export default function CatalogFilters({ products, categories }: CatalogFiltersProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (normalizedQuery) {
      result = result.filter((product) => {
        const haystack = `${product.name} ${product.summary} ${product.category}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    if (sort === "price-asc") {
      result = [...result].sort(
        (a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price)
      );
    } else if (sort === "price-desc") {
      result = [...result].sort(
        (a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price)
      );
    } else if (sort === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, query, sort]);

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <label htmlFor="catalog-search" className="eyebrow">
            Buscar
          </label>
          <input
            id="catalog-search"
            type="search"
            placeholder="Busca por nombre o categoria"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="catalog-sort">
          <label htmlFor="catalog-sort" className="eyebrow">
            Ordenar
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
          </select>
        </div>
        <div className="catalog-count">
          <span className="eyebrow">Resultados</span>
          <strong>{filteredProducts.length}</strong>
        </div>
      </div>

      <div className="chip-row">
        <button
          className={`chip ${activeCategory === "all" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveCategory("all")}
        >
          Todo
        </button>
        {categories.map((category) => (
          <button
            className={`chip ${activeCategory === category ? "active" : ""}`}
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid catalog-grid">
        {filteredProducts.map((product) => (
          <article className="card product-card" key={product.slug}>
            {product.tag ? <div className="tag">{product.tag}</div> : null}
            <p className="muted">{product.category}</p>
            <h3>{product.name}</h3>
            <p className="muted">{product.summary}</p>
            <div className="product-footer">
              <span className="price">{product.price}</span>
              <div className="product-actions">
                <Link className="button-link ghost" href={`/catalogo/${product.slug}`}>
                  Ver detalle
                </Link>
                <AddToCartButton product={product} label="Agregar" variant="primary" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
