"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { parsePriceToNumber } from "../_lib/price";
import type { Product, Gender } from "../_data/products";

type CatalogFiltersProps = {
  products: Product[];
};

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

const GENDERS: { label: string; value: Gender }[] = [
  { label: "HOMBRE", value: "hombre" },
  { label: "MUJER", value: "mujer" },
  { label: "NIÑOS", value: "niños" },
];

export default function CatalogFilters({ products }: CatalogFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const allCategories = Array.from(new Set(products.map((product) => product.category)));

  const rawGender = (searchParams.get("gender") ?? searchParams.get("genero") ?? "all").toLowerCase();
  const rawCategory = searchParams.get("category") ?? searchParams.get("categoria") ?? "all";
  const rawSort = (searchParams.get("sort") ?? searchParams.get("orden") ?? "featured") as SortOption;
  const rawQuery = searchParams.get("q") ?? "";

  const normalizedGender: Gender | "all" =
    rawGender === "hombre" || rawGender === "mujer" || rawGender === "niños" ? (rawGender as Gender) : "all";

  const normalizedCategory =
    rawCategory === "all"
      ? "all"
      : allCategories.find((category) => category.toLowerCase() === rawCategory.toLowerCase()) ?? "all";

  const normalizedSort: SortOption =
    ["featured", "price-asc", "price-desc", "name-asc"].includes(rawSort) ? rawSort : "featured";

  const normalizedQuery = rawQuery;

  const [activeGender, setActiveGender] = useState<Gender | "all">(
    normalizedGender
  );
  const [activeCategory, setActiveCategory] = useState(normalizedCategory);
  const [sort, setSort] = useState<SortOption>(normalizedSort);
  const [query, setQuery] = useState(normalizedQuery);

  useEffect(() => {
    setActiveGender(normalizedGender);
    setActiveCategory(normalizedCategory);
    setSort(normalizedSort);
    setQuery(normalizedQuery);
  }, [normalizedGender, normalizedCategory, normalizedSort, normalizedQuery]);

  useEffect(() => {
    const canonical = new URLSearchParams(searchParams.toString());

    // Remove legacy keys once parsed so URLs become stable and shareable.
    canonical.delete("genero");
    canonical.delete("categoria");
    canonical.delete("orden");

    if (normalizedGender === "all") {
      canonical.delete("gender");
    } else {
      canonical.set("gender", normalizedGender);
    }

    if (normalizedCategory === "all") {
      canonical.delete("category");
    } else {
      canonical.set("category", normalizedCategory);
    }

    if (normalizedSort === "featured") {
      canonical.delete("sort");
    } else {
      canonical.set("sort", normalizedSort);
    }

    if (!normalizedQuery.trim()) {
      canonical.delete("q");
    } else {
      canonical.set("q", normalizedQuery.trim());
    }

    const canonicalString = canonical.toString();
    const currentString = searchParams.toString();

    if (canonicalString !== currentString) {
      router.replace(canonicalString ? `${pathname}?${canonicalString}` : pathname, { scroll: false });
    }
  }, [normalizedGender, normalizedCategory, normalizedSort, normalizedQuery, pathname, router, searchParams]);

  const updateUrl = (next: {
    gender?: string;
    category?: string;
    sort?: SortOption;
    q?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const gender = next.gender ?? activeGender;
    const category = next.category ?? activeCategory;
    const nextSort = next.sort ?? sort;
    const q = next.q ?? query;

    params.delete("genero");
    params.delete("categoria");
    params.delete("orden");

    if (!gender || gender === "all") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }

    if (!category || category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    if (!nextSort || nextSort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    if (!q || !q.trim()) {
      params.delete("q");
    } else {
      params.set("q", q.trim());
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  // Obtener categorías disponibles para el género seleccionado
  const availableCategories = useMemo(() => {
    const filtered =
      activeGender === "all"
        ? products
        : products.filter((p) => p.gender === activeGender);
    const categories = Array.from(new Set(filtered.map((p) => p.category)));
    return categories.sort();
  }, [activeGender, products]);

  // Resetear categoría si el género cambia
  const handleGenderChange = (gender: Gender | "all") => {
    setActiveGender(gender);
    setActiveCategory("all");
    updateUrl({ gender, category: "all" });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    updateUrl({ category });
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);
    updateUrl({ sort: nextSort });
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    updateUrl({ q: nextQuery });
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = products;

    // Filtro por género
    if (activeGender !== "all") {
      result = result.filter((product) => product.gender === activeGender);
    }

    // Filtro por categoría
    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // Filtro por búsqueda
    if (normalizedQuery) {
      result = result.filter((product) => {
        const haystack = `${product.name} ${product.summary} ${product.category}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    // Ordenamiento
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
  }, [products, activeGender, activeCategory, query, sort]);

  return (
    <>
      {/* BARRA 1: GÉNERO */}
      <nav className="filters-section gender-section">
        <div className="nav-bar gender-bar">
          <button
            className={`nav-item ${activeGender === "all" ? "active" : ""}`}
            type="button"
            onClick={() => handleGenderChange("all")}
          >
            TODOS
          </button>
          {GENDERS.map((gender) => (
            <button
              key={gender.value}
              className={`nav-item ${activeGender === gender.value ? "active" : ""}`}
              type="button"
              onClick={() => handleGenderChange(gender.value)}
            >
              {gender.label}
            </button>
          ))}
        </div>
      </nav>

      {/* BARRA 2: CATEGORÍA (dinámicas) */}
      {activeGender !== "all" && availableCategories.length > 0 && (
        <nav className="filters-section category-section">
          <div className="nav-bar category-bar">
            <button
              className={`nav-item ${activeCategory === "all" ? "active" : ""}`}
              type="button"
              onClick={() => handleCategoryChange("all")}
            >
              TODAS
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                className={`nav-item ${activeCategory === category ? "active" : ""}`}
                type="button"
                onClick={() => handleCategoryChange(category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* SECCIÓN: BÚSQUEDA, ORDENAMIENTO Y RESULTADOS */}
      <div className="filters-toolbar-section">
        <div className="catalog-toolbar">
          <div className="toolbar-item search-item">
            <input
              id="catalog-search"
              type="search"
              placeholder="Buscar por nombre o categoría"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-item sort-item">
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value as SortOption)}
              className="sort-select"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
            </select>
          </div>
          <div className="toolbar-item count-item">
            <span className="results-count">{filteredProducts.length} productos</span>
          </div>
        </div>
      </div>

      {/* GRILLA DE PRODUCTOS */}
      {filteredProducts.length > 0 ? (
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
      ) : (
        <div className="no-results">
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </>
  );
}
