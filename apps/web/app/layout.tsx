import "./globals.css";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { CartProvider } from "./_state/CartContext";
import { AuthProvider } from "./_lib/auth-context";
import CartDrawer from "./_components/CartDrawer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Street World | Streetwear en Colombia",
    template: "%s | Street World"
  },
  description:
    "Tienda online de Street World. Streetwear urbano en Colombia con envios nacionales y pagos en COP.",
  keywords: ["streetwear", "ropa urbana", "moda urbana", "Colombia", "Street World"],
  openGraph: {
    title: "Street World | Streetwear en Colombia",
    description:
      "Compra streetwear urbano en Colombia: hoodies, joggers, camisetas y accesorios.",
    url: siteUrl,
    siteName: "Street World",
    locale: "es_CO",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Street World | Streetwear en Colombia",
    description:
      "Compra streetwear urbano en Colombia: hoodies, joggers, camisetas y accesorios."
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="page">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
