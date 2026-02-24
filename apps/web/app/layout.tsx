import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { CartProvider } from "./_state/CartContext";
import CartDrawer from "./_components/CartDrawer";

export const metadata = {
  title: "Street World",
  description: "Tienda online de Street World"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Header />
          <main className="page">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
