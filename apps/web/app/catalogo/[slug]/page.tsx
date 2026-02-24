import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../_components/AddToCartButton";
import ProductPurchaseActions from "../../_components/ProductPurchaseActions";
import { getProduct, getProducts } from "../../_lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  const products = await getProducts();
  const recommendations = products
    .filter((item) => item.slug !== params.slug)
    .filter((item) => item.category === product?.category)
    .slice(0, 3);
  const fallbackRecommendations = products
    .filter((item) => item.slug !== params.slug)
    .slice(0, 3);

  if (!product) {
    notFound();
  }


  return (
    <section className="section product-detail">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo">Catalogo</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-media">
            <div className="media-main">
              <div className="media-placeholder">
                <span>{product.name}</span>
                <p className="muted">Street World Edition</p>
              </div>
            </div>
            <div className="media-thumbs">
              {["01", "02", "03"].map((label) => (
                <div className="media-thumb" key={label}>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="detail-panel">
            {product.tag ? <div className="tag">{product.tag}</div> : null}
            <p className="muted">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="price">{product.price}</p>
            <p className="lead">{product.description}</p>
            <ProductPurchaseActions product={product} />
          </div>
        </div>
        <div className="detail-extra">
          <div className="card">
            <h3>Detalles</h3>
            <ul className="detail-list">
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <div className="size-list">
              <p className="muted">Tallas disponibles</p>
              <div className="chip-row">
                {product.sizes.map((size) => (
                  <span className="chip" key={size}>
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <p className="muted">Stock: {product.stock}</p>
          </div>
          <div className="card detail-care">
            <h3>Envio y cuidado</h3>
            <p className="muted">
              Entrega nacional con seguimiento. Recomendamos lavado en frio y
              secado a la sombra para mantener la textura.
            </p>
            <div className="detail-badges">
              <span className="chip">Envio 48h</span>
              <span className="chip">Cambio facil</span>
              <span className="chip">Calidad premium</span>
            </div>
          </div>
        </div>
        <section className="section related">
          <div className="section-title">
            <div>
              <p className="eyebrow">Recomendados</p>
              <h2>Combina este look</h2>
            </div>
            <Link className="button-link ghost" href="/catalogo">
              Ver todo
            </Link>
          </div>
          <div className="grid products">
            {(recommendations.length ? recommendations : fallbackRecommendations).map(
              (item) => (
                <article key={item.slug} className="card product">
                  {item.tag ? <div className="tag">{item.tag}</div> : null}
                  <p className="muted">{item.category}</p>
                  <h3>{item.name}</h3>
                  <p className="price">{item.price}</p>
                  <div className="product-actions">
                    <Link className="button-link ghost" href={`/catalogo/${item.slug}`}>
                      Ver detalle
                    </Link>
                    <AddToCartButton product={item} label="Agregar" />
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
