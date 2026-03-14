import { Suspense } from "react";
import CatalogFilters from "../_components/CatalogFilters";
import { getProducts } from "../_lib/products";

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <section className="section catalog" id="catalogo">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h1>Encuentra tu proximo look</h1>
          </div>
          <p className="muted">
            Seleccion curada de piezas urbanas listas para moverse contigo.
          </p>
        </div>
        
        <Suspense fallback={<p className="muted">Cargando filtros...</p>}>
          <CatalogFilters products={products} />
        </Suspense>
      </div>
    </section>
  );
}
