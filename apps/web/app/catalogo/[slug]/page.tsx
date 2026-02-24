import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../_components/AddToCartButton";
import { products } from "../../_data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = products.find((item) => item.slug === params.slug);

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
          <div className="detail-panel">
            <div className="tag">{product.tag}</div>
            <p className="muted">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="price">{product.price}</p>
            <p className="lead">{product.description}</p>
            <div className="detail-actions">
              <AddToCartButton product={product} />
              <AddToCartButton
                product={product}
                label="Comprar ahora"
                variant="ghost"
                openOnAdd
              />
            </div>
          </div>
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
        </div>
      </div>
    </section>
  );
}
