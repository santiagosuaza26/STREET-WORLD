import type { Product } from "./products";

export const categories = [
  {
    title: "Hoodies",
    description: "Cortes limpios y telas pesadas para clima frio."
  },
  {
    title: "Oversize",
    description: "Siluetas amplias con actitud y comodidad."
  },
  {
    title: "Accesorios",
    description: "Gorras, bolsos y detalles que cierran el look."
  }
];

export const featuredProducts: Partial<Product>[] = [
  {
    slug: "hoodie-andes",
    name: "Hoodie Andes",
    price: "$189.000",
    tag: "Nuevo"
  },
  {
    slug: "cargo-distrito",
    name: "Cargo Distrito",
    price: "$159.000",
    tag: "Top ventas"
  },
  {
    slug: "bucket-origen",
    name: "Bucket Origen",
    price: "$89.000",
    tag: "Edicion limitada"
  }
];

export const perks = [
  {
    title: "Pagos en COP",
    description: "Checkout local para Colombia y opciones seguras."
  },
  {
    title: "Envio rapido",
    description: "Despachos en 24-48h en ciudades principales."
  },
  {
    title: "Soporte humano",
    description: "Atencion real por WhatsApp y correo."
  }
];
