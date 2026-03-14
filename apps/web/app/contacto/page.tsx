"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "../_components/ui/Button";
import InputField from "../_components/ui/InputField";
import { contactService } from "../_lib/api";

export default function ContactoPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      await contactService.send({
        fullName,
        email,
        subject,
        message,
      });

      setSubmitSuccess("Mensaje enviado correctamente. Te responderemos pronto.");
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setSubmitError("No se pudo enviar tu mensaje. Intenta nuevamente en unos minutos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <span>Contacto</span>
          </div>
          <div className="hero-copy" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h1>Estamos aqui para ayudarte</h1>
            <p className="lead">
              Tienes dudas, comentarios o sugerencias? Contactanos por cualquiera de nuestros canales.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid cards">
            <article className="card">
              <h3>Correo electronico</h3>
              <p className="muted">
                Envianos un correo y te responderemos en menos de 24 horas.
              </p>
              <a href="mailto:hola@streetworld.co" className="button-link primary" style={{ marginTop: "1rem" }}>
                hola@streetworld.co
              </a>
            </article>

            <article className="card">
              <h3>WhatsApp</h3>
              <p className="muted">
                Chatea con nuestro equipo de soporte de lunes a viernes de 9am a 6pm.
              </p>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="button-link primary" style={{ marginTop: "1rem" }}>
                +57 300 123 4567
              </a>
            </article>

            <article className="card">
              <h3>Ubicacion</h3>
              <p className="muted">
                Visitanos en nuestra tienda fisica en Bogota.
              </p>
              <p style={{ marginTop: "1rem" }}>
                <strong>Calle 72 #10-34</strong>
                <br />
                Chapinero, Bogota
                <br />
                Colombia
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Envianos un mensaje</h2>
            <p className="muted">
              Completa el formulario y nos pondremos en contacto contigo pronto.
            </p>
          </div>
          <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <form className="form" onSubmit={onSubmit}>
              <InputField
                id="contact-full-name"
                label="Nombre completo"
                type="text"
                placeholder="Tu nombre"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />

              <InputField
                id="contact-email"
                label="Correo electronico"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <InputField
                id="contact-subject"
                label="Asunto"
                type="text"
                placeholder="En que podemos ayudarte?"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
              />

              <div className="form-field">
                <label htmlFor="contact-message">Mensaje</label>
                <textarea
                  id="contact-message"
                  rows={6}
                  placeholder="Cuentanos mas detalles..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </div>

              {submitError ? <p className="form-error">{submitError}</p> : null}
              {submitSuccess ? <p className="form-success">{submitSuccess}</p> : null}

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="grid cards">
            <article className="card">
              <h3>Cuanto demora el envio?</h3>
              <p className="muted">
                Los envios a ciudades principales llegan en 24-48 horas. Para otras ciudades puede tomar de 3 a 5 dias habiles.
              </p>
            </article>

            <article className="card">
              <h3>Puedo devolver un producto?</h3>
              <p className="muted">
                Si, tienes 30 dias desde la compra para devolver cualquier producto en perfecto estado.
              </p>
            </article>

            <article className="card">
              <h3>Que metodos de pago aceptan?</h3>
              <p className="muted">
                Aceptamos PSE, tarjetas debito/credito, Nequi, Daviplata y transferencias bancarias.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
