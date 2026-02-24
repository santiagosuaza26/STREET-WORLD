import Link from "next/link";

export default function CuentaPage() {
  return (
    <section className="section account">
      <div className="container">
        <div className="section-title">
          <div>
            <p className="eyebrow">Cuenta</p>
            <h2>Tu espacio Street World</h2>
          </div>
          <Link className="button-link ghost" href="/login">
            Iniciar sesion
          </Link>
        </div>
        <div className="card">
          <p className="muted">
            Aqui veras tus pedidos, direcciones y preferencias cuando la cuenta
            este activa.
          </p>
        </div>
      </div>
    </section>
  );
}
