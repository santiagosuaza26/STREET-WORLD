import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const routes = [
    "",
    "/catalogo",
    "/sale",
    "/beneficios",
    "/contacto",
    "/envios",
    "/pagos",
    "/privacidad",
    "/terminos",
    "/tallas",
    "/soporte"
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7
  }));
}
