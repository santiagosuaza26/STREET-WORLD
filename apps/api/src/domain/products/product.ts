export type Product = {
  slug: string;
  name: string;
  price: string;
  category: string;
  tag?: string;
  summary: string;
  description: string;
  highlights: string[];
  sizes: string[];
  stock: string;
};
