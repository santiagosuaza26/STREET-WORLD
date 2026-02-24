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

export const products: Product[] = [
  {
    slug: "hoodie-andes",
    name: "Hoodie Andes",
    price: "$189.000",
    category: "Hoodies",
    tag: "Nuevo",
    summary: "Felpa pesada, capucha amplia y ajuste premium.",
    description:
      "Hoodie diseñado para clima frio, con costuras reforzadas y tacto suave. Ideal para capas urbanas.",
    highlights: ["Felpa 400g", "Bolsillo canguro", "Cordones reforzados"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  {
    slug: "cargo-distrito",
    name: "Cargo Distrito",
    price: "$159.000",
    category: "Pantalones",
    tag: "Top ventas",
    summary: "Cargo de ajuste relajado y bolsillos utilitarios.",
    description:
      "Pantalon cargo con silueta amplia, pensado para movimiento diario. Cintura flexible y caida limpia.",
    highlights: ["Cintura elastica", "Bolsillos laterales", "Tela resistente"],
    sizes: ["28", "30", "32", "34"],
    stock: "Disponible"
  },
  {
    slug: "bucket-origen",
    name: "Bucket Origen",
    price: "$89.000",
    category: "Accesorios",
    tag: "Edicion limitada",
    summary: "Bucket ligero con bordado interno Street World.",
    description:
      "Sombrero tipo bucket con ala suave y bordado interno. Perfecto para complementar looks urbanos.",
    highlights: ["Bordado interno", "Talla unica", "Algodon premium"],
    sizes: ["Unica"],
    stock: "Pocas unidades"
  },
  {
    slug: "tee-avenida",
    name: "Tee Avenida",
    price: "$79.000",
    category: "Camisetas",
    tag: "Basico",
    summary: "Camiseta oversize con cuello alto y caida amplia.",
    description:
      "Camiseta street con corte oversize y textura suave. Pensada para combinar con cargos y gorras.",
    highlights: ["Oversize", "Cuello reforzado", "Algodon peinado"],
    sizes: ["S", "M", "L"],
    stock: "Disponible"
  },
  {
    slug: "chaqueta-barrio",
    name: "Chaqueta Barrio",
    price: "$249.000",
    category: "Chaquetas",
    tag: "Nuevo",
    summary: "Chaqueta ligera con forro y detalles reflectivos.",
    description:
      "Chaqueta urbana con corte recto y detalles reflectivos para noches en movimiento. Forro respirable.",
    highlights: ["Detalles reflectivos", "Forro respirable", "Cierre metalico"],
    sizes: ["M", "L", "XL"],
    stock: "Disponible"
  },
  {
    slug: "gorra-summit",
    name: "Gorra Summit",
    price: "$59.000",
    category: "Accesorios",
    tag: "Nuevo",
    summary: "Gorra estructurada con visera curva.",
    description:
      "Gorra con paneles rigidos y bordado frontal. Ajuste trasero para comodidad diaria.",
    highlights: ["Ajuste trasero", "Bordado frontal", "Visera curva"],
    sizes: ["Unica"],
    stock: "Disponible"
  }
];
