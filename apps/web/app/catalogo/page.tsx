import Link from "next/link";
import AddToCartButton from "../_components/AddToCartButton";
import { products } from "../_data/products";

const categories = Array.from(new Set(products.map((product) => product.category)));

export default function CatalogPage() {
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
        <div className="chip-row">
          {categories.map((category) => (
            <span className="chip" key={category}>
              {category}
            </span>
          ))}
        </div>
        <div className="grid catalog-grid">
          {products.map((product) => (
            <article className="card product-card" key={product.slug}>
              <div className="tag">{product.tag}</div>
              <p className="muted">{product.category}</p>
              <h3>{product.name}</h3>
              <p className="muted">{product.summary}</p>
              <div className="product-footer">
                <span className="price">{product.price}</span>
                <div className="product-actions">
                  <Link className="button-link ghost" href={`/catalogo/${product.slug}`}>
                    Ver detalle
                  </Link>
                  <AddToCartButton
                    product={product}
                    label="Agregar"
                    variant="primary"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
