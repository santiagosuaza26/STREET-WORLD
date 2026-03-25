import { Injectable } from "@nestjs/common";
import { Product } from "../../domain/products/product";
import { ProductRepository } from "../../domain/products/product-repository";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Hoodie Andes",
    description: "Hoodie disenado para clima frio, con costuras reforzadas y tacto suave. Ideal para capas urbanas.",
    price: 189000,
    image: "/images/hoodie-andes.jpg",
    category: "Hoodies",
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Cargo Distrito",
    description: "Pantalon cargo con silueta amplia, pensado para movimiento diario. Cintura flexible y caida limpia.",
    price: 159000,
    image: "/images/cargo-distrito.jpg",
    category: "Pantalones",
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Bucket Origen",
    description: "Sombrero tipo bucket con ala suave y bordado interno. Perfecto para complementar looks urbanos.",
    price: 89000,
    image: "/images/bucket-origen.jpg",
    category: "Accesorios",
    stock: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Tee Avenida",
    description: "Camiseta street con corte oversize y textura suave. Pensada para combinar con cargos y gorras.",
    price: 79000,
    image: "/images/tee-avenida.jpg",
    category: "Camisetas",
    stock: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Chaqueta Barrio",
    description: "Chaqueta urbana con corte recto y detalles reflectivos para noches en movimiento. Forro respirable.",
    price: 249000,
    image: "/images/chaqueta-barrio.jpg",
    category: "Chaquetas",
    stock: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Gorra Summit",
    description: "Gorra con paneles rigidos y bordado frontal. Ajuste trasero para comodidad diaria.",
    price: 59000,
    image: "/images/gorra-summit.jpg",
    category: "Accesorios",
    stock: 40,
    createdAt: new Date().toISOString()
  }
];

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  async create(product: Product): Promise<Product> {
    PRODUCTS.push(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return PRODUCTS;
  }

  async findById(id: string): Promise<Product | null> {
    return PRODUCTS.find((product) => product.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return PRODUCTS.find((product) => product.slug === slug) ?? null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return PRODUCTS.filter((product) => product.category === category);
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const index = PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    PRODUCTS[index] = { ...PRODUCTS[index], ...product };
    return PRODUCTS[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    PRODUCTS.splice(index, 1);
    return true;
  }
}
