export default function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="container footer-grid">
        <div>
          <div className="logo">Street World</div>
          <p className="muted">
            Moda urbana con alma latina. Pagos locales y envios en Colombia.
          </p>
        </div>
        <div>
          <h4>Marca</h4>
          <ul>
            <li><a href="#colecciones">Colecciones</a></li>
            <li><a href="#catalogo">Catalogo</a></li>
            <li><a href="#beneficios">Beneficios</a></li>
          </ul>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul>
            <li><a href="#">Envios y devoluciones</a></li>
            <li><a href="#">Guia de tallas</a></li>
            <li><a href="#">Soporte</a></li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacidad</a></li>
            <li><a href="#">Terminos</a></li>
            <li><a href="#">Pagos</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          Hecho en Colombia · 2026
        </div>
      </div>
    </footer>
  );
}
