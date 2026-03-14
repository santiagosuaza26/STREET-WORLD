"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthLayout from "../_components/features/auth/AuthLayout";
import Button from "../_components/ui/Button";
import InputField from "../_components/ui/InputField";
import { useAuth } from "../_lib/auth-context";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const msg = err.response?.data?.message;
    if (Array.isArray(msg)) {
      return msg[0] ?? "No se pudo iniciar sesion.";
    }
    if (typeof msg === "string") {
      return msg;
    }
  }

  return "No se pudo iniciar sesion.";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/cuenta");
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Cuenta"
      title="Iniciar sesion"
      description="Accede para ver pedidos, direcciones y beneficios exclusivos."
    >
      <form onSubmit={handleSubmit}>
        <InputField
          id="email"
          label="Correo"
          type="email"
          placeholder="nombre@correo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <InputField
          id="password"
          label="Contrasena"
          type="password"
          placeholder="********"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <p className="form-error">{error}</p> : null}
        <Button disabled={isSubmitting} type="submit" variant="primary">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="muted small">
        No tienes cuenta? <Link href="/registro">Crea una aqui</Link>.
      </p>
    </AuthLayout>
  );
}
