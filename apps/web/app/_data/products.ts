export type Gender = "hombre" | "mujer" | "niños";
export type ProductCategory = "Camisetas" | "Tanks" | "Medias" | "Buzos" | "Shorts" | "Gorras" | "Polos" | "Joggers" | "Pantalones" | "Camisas" | "Jeans" | "Chaquetas";

export type Product = {
  slug: string;
  name: string;
  price: string;
  category: ProductCategory;
  gender: Gender;
  tag?: string;
  summary: string;
  description: string;
  highlights: string[];
  sizes: string[];
  stock: string;
};

export const products: Product[] = [
  // HOMBRE - CAMISETAS
  {
    slug: "camiseta-hombre-blanca",
    name: "Camiseta Blanca Clásica",
    price: "$59.000",
    category: "Camisetas",
    gender: "hombre",
    tag: "Básico",
    summary: "Camiseta 100% algodón, corte clásico.",
    description: "Camiseta versátil perfecta para cualquier ocasión, con cuello reforzado y tela premium.",
    highlights: ["Algodón 100%", "Cuello reforzado", "Corte clásico"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - TANKS
  {
    slug: "tank-hombre-negro",
    name: "Tank Top Negro",
    price: "$49.000",
    category: "Tanks",
    gender: "hombre",
    tag: "Verano",
    summary: "Tank top ajustado en algodón puro.",
    description: "Perfecto para entrenar o usar en climas cálidos, con ajuste deportivo.",
    highlights: ["Algodón puro", "Ajuste deportivo", "Transpirable"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - MEDIAS
  {
    slug: "medias-hombre-pack",
    name: "Pack 3 Medias Deportivas",
    price: "$39.000",
    category: "Medias",
    gender: "hombre",
    tag: "Pack",
    summary: "3 pares de medias deportivas con tecnología breathable.",
    description: "Medias cómodas y duraderas, ideales para uso diario y deportivo.",
    highlights: ["Tecnología breathable", "Pack x3", "Cómodo"],
    sizes: ["Unica"],
    stock: "Disponible"
  },
  // HOMBRE - BUZOS
  {
    slug: "buzo-hombre-gris",
    name: "Buzo Gris Deportivo",
    price: "$89.000",
    category: "Buzos",
    gender: "hombre",
    tag: "Nuevo",
    summary: "Buzo de algodón con capucha y bolsillos.",
    description: "Buzo cómodo para entrenar o usar casual, con interior suave.",
    highlights: ["Algodón suave", "Capucha", "Bolsillos funcionales"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - SHORTS
  {
    slug: "shorts-hombre-azul",
    name: "Shorts Azul Marino",
    price: "$69.000",
    category: "Shorts",
    gender: "hombre",
    tag: "Verano",
    summary: "Shorts ligeros para clima cálido.",
    description: "Shorts con cintura elástica y bolsillos laterales, ideal para actividades al aire libre.",
    highlights: ["Cintura elástica", "Bolsillos laterales", "Rápido secado"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - GORRAS
  {
    slug: "gorra-hombre-negra",
    name: "Gorra Baseball Negra",
    price: "$59.000",
    category: "Gorras",
    gender: "hombre",
    tag: "Clásico",
    summary: "Gorra estilo baseball con visera estructurada.",
    description: "Gorra duradera con bordado frontal y ajuste trasero confortable.",
    highlights: ["Visera estructurada", "Ajuste trasero", "Bordado"],
    sizes: ["Unica"],
    stock: "Disponible"
  },
  // HOMBRE - POLOS
  {
    slug: "polo-hombre-rojo",
    name: "Polo Rojo Street",
    price: "$79.000",
    category: "Polos",
    gender: "hombre",
    tag: "Nuevo",
    summary: "Polo en algodón piqué con pecho bordado.",
    description: "Polo versátil que combina comodidad y estilo, perfecto para looks casuales.",
    highlights: ["Algodón piqué", "Pecho bordado", "Cuello reforzado"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - JOGGERS
  {
    slug: "joggers-hombre-negro",
    name: "Joggers Negro Premium",
    price: "$129.000",
    category: "Joggers",
    gender: "hombre",
    tag: "Top ventas",
    summary: "Pantalón deportivo con cintura elástica.",
    description: "Joggers cómodos para entrenar o usar casual, con tela suave y respirable.",
    highlights: ["Cintura elástica", "Bolsillos laterales", "Tela suave"],
    sizes: ["S", "M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - PANTALONES
  {
    slug: "cargo-distrito",
    name: "Cargo Distrito",
    price: "$159.000",
    category: "Pantalones",
    gender: "hombre",
    tag: "Top ventas",
    summary: "Cargo de ajuste relajado y bolsillos utilitarios.",
    description: "Pantalón cargo con silueta amplia, pensado para movimiento diario.",
    highlights: ["Cintura elástica", "Bolsillos laterales", "Tela resistente"],
    sizes: ["28", "30", "32", "34"],
    stock: "Disponible"
  },
  // HOMBRE - CAMISAS
  {
    slug: "camisa-hombre-blanca",
    name: "Camisa Blanca Clásica",
    price: "$119.000",
    category: "Camisas",
    gender: "hombre",
    tag: "Clásico",
    summary: "Camisa de lino fresco y ligero.",
    description: "Camisa versátil que puedes usar sola o por encima de otras prendas.",
    highlights: ["Lino suave", "Botones metálicos", "Corte recto"],
    sizes: ["M", "L", "XL"],
    stock: "Disponible"
  },
  // HOMBRE - JEANS
  {
    slug: "jeans-hombre-azul",
    name: "Jeans Azul Clásico",
    price: "$129.000",
    category: "Jeans",
    gender: "hombre",
    tag: "Top ventas",
    summary: "Jeans cintura normal con corte recto.",
    description: "Jeans clásico y versátil, perfecto para combinar con cualquier top.",
    highlights: ["Cintura normal", "Corte recto", "Denim premium"],
    sizes: ["28", "30", "32", "34"],
    stock: "Disponible"
  },
  // HOMBRE - CHAQUETAS
  {
    slug: "chaqueta-barrio",
    name: "Chaqueta Barrio",
    price: "$249.000",
    category: "Chaquetas",
    gender: "hombre",
    tag: "Nuevo",
    summary: "Chaqueta ligera con forro y detalles reflectivos.",
    description: "Chaqueta urbana con corte recto y detalles reflectivos para noches en movimiento.",
    highlights: ["Detalles reflectivos", "Forro respirable", "Cierre metálico"],
    sizes: ["M", "L", "XL"],
    stock: "Disponible"
  },
  
  // MUJER - CAMISETAS
  {
    slug: "camiseta-mujer-blanca",
    name: "Camiseta Mujer Blanca",
    price: "$69.000",
    category: "Camisetas",
    gender: "mujer",
    tag: "Básico",
    summary: "Camiseta fitted con algodón premium.",
    description: "Camiseta elegante y cómoda, perfecta para looks casuales y sofisticados.",
    highlights: ["Algodón premium", "Fitted", "Cuello fino"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - TANKS
  {
    slug: "tank-mujer-negro",
    name: "Tank Mujer Ajustado",
    price: "$59.000",
    category: "Tanks",
    gender: "mujer",
    tag: "Verano",
    summary: "Tank top ajustado y cómodo.",
    description: "Perfecto para entrenar o usar en verano, con silueta favorecedora.",
    highlights: ["Ajuste ceñido", "Transpirable", "Elegante"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - MEDIAS
  {
    slug: "medias-mujer-pack",
    name: "Pack 3 Medias Moda",
    price: "$49.000",
    category: "Medias",
    gender: "mujer",
    tag: "Pack",
    summary: "3 pares de medias para distintas ocasiones.",
    description: "Medias variadas y cómodas para completar cualquier outfit.",
    highlights: ["Pack x3", "Diseños variados", "Cómodo"],
    sizes: ["Unica"],
    stock: "Disponible"
  },
  // MUJER - BUZOS
  {
    slug: "sudadera-mujer-rosa",
    name: "Sudadera Rosa Urbana",
    price: "$169.000",
    category: "Buzos",
    gender: "mujer",
    tag: "Nuevo",
    summary: "Sudadera oversize en tono rosa pastel.",
    description: "Sudadera cómoda y elegante, perfecta para looks casuales y sofisticados.",
    highlights: ["Algodón 100%", "Oversize fit", "Bolsillos laterales"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - SHORTS
  {
    slug: "shorts-mujer-blanco",
    name: "Shorts Blanco Verano",
    price: "$79.000",
    category: "Shorts",
    gender: "mujer",
    tag: "Verano",
    summary: "Shorts cortos y frescos para el calor.",
    description: "Shorts ligeros y cómodos, ideales para actividades al aire libre.",
    highlights: ["Cintura alta", "Ligero", "Bolsillos"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - GORRAS
  {
    slug: "gorra-mujer-rosa",
    name: "Gorra Mujer Rosa",
    price: "$59.000",
    category: "Gorras",
    gender: "mujer",
    tag: "Nuevo",
    summary: "Gorra con visera ajustable y diseño moderno.",
    description: "Gorra elegante con bordado frontal y ajuste trasero confortable.",
    highlights: ["Visera ajustable", "Diseño moderno", "Ajuste trasero"],
    sizes: ["Unica"],
    stock: "Disponible"
  },
  // MUJER - POLOS
  {
    slug: "polo-mujer-blanco",
    name: "Polo Mujer Blanco",
    price: "$89.000",
    category: "Polos",
    gender: "mujer",
    tag: "Clásico",
    summary: "Polo elegante en algodón piqué.",
    description: "Polo versátil y sofisticado, perfecto para cualquier ocasión casual.",
    highlights: ["Algodón piqué", "Corte femenino", "Cuello reforzado"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - JOGGERS
  {
    slug: "joggers-mujer-gris",
    name: "Joggers Gris Mujer",
    price: "$139.000",
    category: "Joggers",
    gender: "mujer",
    tag: "Comodidad",
    summary: "Pantalón deportivo con corte femenino.",
    description: "Joggers cómodos y elegantes, ideales para entrenar o usar casual.",
    highlights: ["Corte femenino", "Cintura elástica", "Bolsillos"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - PANTALONES
  {
    slug: "pantalon-mujer-negro",
    name: "Pantalón Elegante Negro",
    price: "$179.000",
    category: "Pantalones",
    gender: "mujer",
    tag: "Top ventas",
    summary: "Pantalón negro de cintura alta con corte limpio.",
    description: "Pantalón versátil que combina confort con estilo minimalista.",
    highlights: ["Cintura alta", "Botones metálicos", "Tela premium"],
    sizes: ["24", "26", "28", "30"],
    stock: "Disponible"
  },
  // MUJER - CAMISAS
  {
    slug: "camisa-mujer-negra",
    name: "Camisa Negra Elegante",
    price: "$149.000",
    category: "Camisas",
    gender: "mujer",
    tag: "Nuevo",
    summary: "Camisa de lino con botones metálicos.",
    description: "Camisa versátil que puedes usar sola o por encima de otras prendas.",
    highlights: ["Lino suave", "Botones metálicos", "Corte recto"],
    sizes: ["XS", "S", "M", "L"],
    stock: "Disponible"
  },
  // MUJER - JEANS
  {
    slug: "jeans-mujer-azul",
    name: "Jeans Azul Clásico",
    price: "$139.000",
    category: "Jeans",
    gender: "mujer",
    tag: "Top ventas",
    summary: "Jeans cintura alta con corte recto.",
    description: "Jeans clásico y versátil, perfecto para combinar con cualquier top.",
    highlights: ["Cintura alta", "Corte recto", "Denim premium"],
    sizes: ["24", "26", "28", "30"],
    stock: "Disponible"
  },
  // MUJER - CHAQUETAS
  {
    slug: "chaqueta-mujer-denim",
    name: "Chaqueta Denim Clásica",
    price: "$219.000",
    category: "Chaquetas",
    gender: "mujer",
    tag: "Clásico",
    summary: "Chaqueta denim azul oscuro con detalles vintage.",
    description: "Pieza atemporal que nunca pasa de moda, perfecta para capas.",
    highlights: ["Denim premium", "Bolsillos funcionales", "Botones resistentes"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: "Disponible"
  },

  // NIÑOS - CAMISETAS
  {
    slug: "camiseta-nino-azul",
    name: "Camiseta Azul Infantil",
    price: "$49.000",
    category: "Camisetas",
    gender: "niños",
    tag: "Básico",
    summary: "Camiseta cómoda en algodón azul marino.",
    description: "Camiseta perfecta para el día a día de los niños, duradera y cómoda.",
    highlights: ["Algodón suave", "Cuello reforzado", "Fácil de lavar"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - TANKS
  {
    slug: "tank-nino-blanco",
    name: "Tank Niño Blanco",
    price: "$39.000",
    category: "Tanks",
    gender: "niños",
    tag: "Verano",
    summary: "Tank top de algodón para el calor.",
    description: "Camiseta sin mangas ideal para climas cálidos y actividades deportivas.",
    highlights: ["Algodón 100%", "Ligero", "Transpirable"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - MEDIAS
  {
    slug: "medias-nino-pack",
    name: "Pack 3 Medias Infantil",
    price: "$29.000",
    category: "Medias",
    gender: "niños",
    tag: "Pack",
    summary: "3 pares de medias coloridas para niños.",
    description: "Medias divertidas y cómodas en diversos colores.",
    highlights: ["Pack x3", "Colores varios", "Cómodo"],
    sizes: ["Unica"],
    stock: "Disponible"
  },
  // NIÑOS - BUZOS
  {
    slug: "buzo-nino-gris",
    name: "Hoodie Gris para Niños",
    price: "$129.000",
    category: "Buzos",
    gender: "niños",
    tag: "Comodidad",
    summary: "Sudadera con capucha suave y cálida.",
    description: "Ideal para abrigar a los niños en días fríos sin perder el estilo.",
    highlights: ["Felpa suave", "Cordones ajustables", "Bolsillo canguro"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - SHORTS
  {
    slug: "shorts-nino-azul",
    name: "Shorts Azul Niño",
    price: "$59.000",
    category: "Shorts",
    gender: "niños",
    tag: "Verano",
    summary: "Shorts ligeros y resistentes para activos.",
    description: "Shorts cómodos perfectos para jugar y estar al aire libre.",
    highlights: ["Resistente", "Cintura elástica", "Bolsillos"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - GORRAS
  {
    slug: "gorra-nino-roja",
    name: "Gorra Niño Roja",
    price: "$49.000",
    category: "Gorras",
    gender: "niños",
    tag: "Nuevo",
    summary: "Gorra divertida para niños.",
    description: "Gorra con visera ajustable y diseño colorido.",
    highlights: ["Ajuste ajustable", "Visera", "Colores vivos"],
    sizes: ["Unica"],
    stock: "Disponible"
  },
  // NIÑOS - POLOS
  {
    slug: "polo-nino-blanco",
    name: "Polo Niño Blanco",
    price: "$69.000",
    category: "Polos",
    gender: "niños",
    tag: "Clásico",
    summary: "Polo clásico en algodón.",
    description: "Polo cómodo y fácil de combinar.",
    highlights: ["Algodón suave", "Cuello reforzado", "Clásico"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - JOGGERS
  {
    slug: "joggers-nino-negro",
    name: "Joggers Niño Negro",
    price: "$99.000",
    category: "Joggers",
    gender: "niños",
    tag: "Comodidad",
    summary: "Pantalón deportivo cómodo.",
    description: "Joggers ideales para jugar y estar cómodo todo el día.",
    highlights: ["Cintura elástica", "Cómodo", "Bolsillos"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - PANTALONES
  {
    slug: "pantalon-nino-gris",
    name: "Pantalón Gris Niño",
    price: "$89.000",
    category: "Pantalones",
    gender: "niños",
    tag: "Básico",
    summary: "Pantalón versátil para uso diario.",
    description: "Pantalón de tela suave y resistente.",
    highlights: ["Tela suave", "Resistente", "Ajuste cómodo"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - CAMISAS
  {
    slug: "camisa-nino-azul",
    name: "Camisa Niño Azul",
    price: "$79.000",
    category: "Camisas",
    gender: "niños",
    tag: "Nuevo",
    summary: "Camisa de algodón con botones.",
    description: "Camisa elegante para ocasiones especiales.",
    highlights: ["Algodón 100%", "Botones", "Elegante"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  },
  // NIÑOS - JEANS
  {
    slug: "jeans-nino-negro",
    name: "Jeans Negro Niño",
    price: "$99.000",
    category: "Jeans",
    gender: "niños",
    tag: "Básico",
    summary: "Jeans resistente diseñado para activos.",
    description: "Jeans clásico que resiste el uso intenso de los niños activos.",
    highlights: ["Denim resistente", "Cintura ajustable", "Costuras reforzadas"],
    sizes: ["4", "6", "8", "10", "12"],
    stock: "Disponible"
  },
  // NIÑOS - CHAQUETAS
  {
    slug: "chaqueta-nino-negra",
    name: "Chaqueta Niño Negra",
    price: "$149.000",
    category: "Chaquetas",
    gender: "niños",
    tag: "Abrigo",
    summary: "Chaqueta cálida para invierno.",
    description: "Chaqueta resistente y cómoda para mantener calor.",
    highlights: ["Forro suave", "Resistente", "Ajustable"],
    sizes: ["4-6", "8-10", "12-14"],
    stock: "Disponible"
  }
];
