import { products as localProducts, type Product } from "../_data/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (!response.ok) {
      return localProducts;
    }
    const data = (await response.json()) as Product[];
    return Array.isArray(data) ? data : localProducts;
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
    const data = (await response.json()) as Product;
    return data ?? null;
  } catch {
    return localProducts.find((product) => product.slug === slug) ?? null;
  }
}
