import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="section auth">
      <div className="container auth-grid">
        <div>
          <p className="eyebrow">Cuenta</p>
          <h2>Iniciar sesion</h2>
          <p className="muted">
            Accede para ver pedidos, direcciones y beneficios exclusivos.
          </p>
        </div>
        <div className="card">
          <div className="form-field">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" placeholder="nombre@correo.com" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Contrasena</label>
            <input id="password" type="password" placeholder="********" />
          </div>
          <button className="primary" type="button">
            Entrar
          </button>
          <p className="muted small">
            No tienes cuenta? <Link href="/registro">Crea una aqui</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
