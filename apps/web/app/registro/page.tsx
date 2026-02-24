import Link from "next/link";

export default function RegistroPage() {
  return (
    <section className="section auth">
      <div className="container auth-grid">
        <div>
          <p className="eyebrow">Cuenta</p>
          <h2>Crear cuenta</h2>
          <p className="muted">
            Registra tus datos para compras mas rapidas.
          </p>
        </div>
        <div className="card">
          <div className="form-field">
            <label htmlFor="name">Nombre</label>
            <input id="name" type="text" placeholder="Tu nombre" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" placeholder="nombre@correo.com" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Contrasena</label>
            <input id="password" type="password" placeholder="********" />
          </div>
          <button className="primary" type="button">
            Crear cuenta
          </button>
          <p className="muted small">
            Ya tienes cuenta? <Link href="/login">Inicia sesion</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
