import CatalogFilters from "../_components/CatalogFilters";
import { getProducts } from "../_lib/products";

export default async function CatalogPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return (
    <section className="section catalog" id="catalogo">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Encuentra tu proximo look</h2>
          </div>
          <p className="muted">
            Seleccion curada de piezas urbanas listas para moverse contigo.
          </p>
        </div>
        <CatalogFilters products={products} categories={categories} />
      </div>
    </section>
  );
}
