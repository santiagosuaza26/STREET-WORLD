import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../domain/products/product-repository";
import type { Product } from "../../domain/products/product";
import { randomUUID } from "crypto";

@Injectable()
export class ProductCatalogSeedService implements OnModuleInit {
  private readonly logger = new Logger(ProductCatalogSeedService.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository
  ) {}

  async onModuleInit() {
    if (process.env.SEED_PRODUCTS === "false") {
      return;
    }

    const existing = await this.products.findAll();
    if (existing.length > 0) {
      return;
    }

    const now = new Date().toISOString();
    const defaults: Product[] = [
      {
        id: randomUUID(),
        slug: "hoodie-andes",
        name: "Hoodie Andes",
        summary: "Hoodie premium para clima frio con silueta street.",
        description:
          "Hoodie disenado para clima frio, con costuras reforzadas y tacto suave. Ideal para capas urbanas.",
        tag: "Nuevo",
        gender: "hombre",
        highlights: ["Felpa premium", "Costuras reforzadas", "Fit urbano"],
        price: 189000,
        onSale: false,
        isBestSeller: true,
        isNewArrival: true,
        inStock: true,
        image: "/images/hoodie-andes.jpg",
        images: ["/images/hoodie-andes.jpg"],
        category: "Hoodies",
        stock: 24,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris"],
        brand: "Street World",
        collection: "drop-urbano",
        createdAt: now,
      },
      {
        id: randomUUID(),
        slug: "cargo-distrito",
        name: "Cargo Distrito",
        summary: "Cargo relajado con bolsillos utilitarios y tela resistente.",
        description:
          "Pantalon cargo con silueta amplia, pensado para movimiento diario. Cintura flexible y caida limpia.",
        tag: "Top ventas",
        gender: "hombre",
        highlights: ["Bolsillos utilitarios", "Tela resistente", "Corte relajado"],
        price: 159000,
        onSale: false,
        isBestSeller: true,
        isNewArrival: false,
        inStock: true,
        image: "/images/cargo-distrito.jpg",
        images: ["/images/cargo-distrito.jpg"],
        category: "Pantalones",
        stock: 18,
        sizes: ["28", "30", "32", "34"],
        colors: ["Negro", "Oliva"],
        brand: "Street World",
        collection: "basicos-premium",
        createdAt: now,
      },
      {
        id: randomUUID(),
        slug: "tee-avenida",
        name: "Tee Avenida",
        summary: "Camiseta oversize con textura suave para uso diario.",
        description:
          "Camiseta street con corte oversize y textura suave. Pensada para combinar con cargos y gorras.",
        tag: "Basico",
        gender: "unisex",
        highlights: ["Algodon pesado", "Oversize fit", "Cuello reforzado"],
        price: 79000,
        onSale: false,
        isBestSeller: false,
        isNewArrival: true,
        inStock: true,
        image: "/images/tee-avenida.jpg",
        images: ["/images/tee-avenida.jpg"],
        category: "Camisetas",
        stock: 55,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blanco", "Negro"],
        brand: "Street World",
        collection: "drop-urbano",
        createdAt: now,
      },
      {
        id: randomUUID(),
        slug: "chaqueta-barrio",
        name: "Chaqueta Barrio",
        summary: "Chaqueta ligera con detalles reflectivos para noche.",
        description:
          "Chaqueta urbana con corte recto y detalles reflectivos para noches en movimiento. Forro respirable.",
        tag: "Nuevo",
        gender: "mujer",
        highlights: ["Reflectivos", "Forro respirable", "Cierre metalico"],
        price: 249000,
        onSale: true,
        salePrice: 219000,
        isBestSeller: false,
        isNewArrival: true,
        inStock: true,
        image: "/images/chaqueta-barrio.jpg",
        images: ["/images/chaqueta-barrio.jpg"],
        category: "Chaquetas",
        stock: 9,
        sizes: ["S", "M", "L"],
        colors: ["Negro"],
        brand: "Street World",
        collection: "edicion-limitada",
        createdAt: now,
      },
      {
        id: randomUUID(),
        slug: "gorra-summit",
        name: "Gorra Summit",
        summary: "Gorra rigida con bordado frontal y ajuste trasero.",
        description:
          "Gorra con paneles rigidos y bordado frontal. Ajuste trasero para comodidad diaria.",
        tag: "Accesorio",
        gender: "unisex",
        highlights: ["Paneles rigidos", "Bordado frontal", "Ajuste trasero"],
        price: 59000,
        onSale: false,
        isBestSeller: true,
        isNewArrival: false,
        inStock: true,
        image: "/images/gorra-summit.jpg",
        images: ["/images/gorra-summit.jpg"],
        category: "Accesorios",
        stock: 41,
        sizes: ["Unica"],
        colors: ["Negro", "Azul"],
        brand: "Street World",
        collection: "basicos-premium",
        createdAt: now,
      },
    ];

    for (const product of defaults) {
      await this.products.create(product);
    }

    this.logger.log(`Seeded ${defaults.length} products into catalog`);
  }
}
