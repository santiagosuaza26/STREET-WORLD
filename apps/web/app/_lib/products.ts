import { products as localProducts, type Product } from "../_data/products";
import { formatPrice } from "./price";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiProduct = {
  id: string;
  slug?: string;
  name: string;
  summary?: string;
  description: string;
  price: number;
  category: string;
  gender?: string;
  tag?: string;
  highlights?: string[];
  sizes?: string[];
  stock: number;
  brand?: string;
  collection?: string;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

function mapApiProduct(product: ApiProduct): Product {
  const stock = Number(product.stock ?? 0);
  const stockCount = Number.isFinite(stock) ? Math.max(0, stock) : 0;
  const gender = (product.gender ?? "unisex").toLowerCase();

  return {
    id: product.id,
    slug: product.slug?.trim() || normalizeSlug(product.name || product.id),
    name: product.name,
    price: formatPrice(Number(product.price) || 0),
    category: product.category,
    gender:
      gender === "hombre" || gender === "mujer" || gender === "niños" || gender === "unisex"
        ? gender
        : "unisex",
    tag: product.tag,
    summary: product.summary?.trim() || product.description.slice(0, 140),
    description: product.description,
    highlights: product.highlights && product.highlights.length > 0 ? product.highlights : ["Producto original Street World"],
    sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ["Unica"],
    stock: stockCount > 0 ? `${stockCount} disponibles` : "Agotado",
    stockCount,
    brand: product.brand,
    collection: product.collection,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (!response.ok) {
      return localProducts;
    }
    const data = (await response.json()) as ApiProduct[];
    return Array.isArray(data) ? data.map(mapApiProduct) : localProducts;
  } catch {
    return localProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`, { cache: "no-store" });
    if (!response.ok) {
      return localProducts.find((product) => product.slug === slug) ?? null;
    }
    const data = (await response.json()) as ApiProduct;
    return data ? mapApiProduct(data) : null;
  } catch {
    return localProducts.find((product) => product.slug === slug) ?? null;
  }
}
