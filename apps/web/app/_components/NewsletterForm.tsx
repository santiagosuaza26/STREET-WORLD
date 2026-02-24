"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setStatus("sent");
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Tu correo"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button className="primary" type="submit">
        {status === "sent" ? "Listo" : "Suscribirme"}
      </button>
    </form>
  );
}
