"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthLayout from "../_components/features/auth/AuthLayout";
import Button from "../_components/ui/Button";
import InputField from "../_components/ui/InputField";
import { COUNTRY_OPTIONS } from "../_data/countries";
import { usersService } from "../_lib/api";
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
      return msg[0] ?? "No se pudo crear la cuenta.";
    }
    if (typeof msg === "string") {
      return msg;
    }
  }

  return "No se pudo crear la cuenta.";
}

export default function RegistroPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [documentType, setDocumentType] = useState("CC");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("CO");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(email, password);
      await usersService.updateMe({
        firstName,
        lastName,
        documentId: `${documentType}-${documentNumber}`,
        phone,
        addressLine,
        city,
        country: country.toUpperCase(),
      });
      router.push("/cuenta");
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Cuenta"
      title="Crear cuenta"
      description="Completa tus datos de facturacion para compras y factura electronica automatica."
    >
      <form onSubmit={handleSubmit}>
        <InputField
          id="firstName"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />
        <InputField
          id="lastName"
          label="Apellido"
          type="text"
          placeholder="Tu apellido"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />
        <div className="form-field">
          <label htmlFor="documentType">Tipo de documento</label>
          <select
            id="documentType"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
            required
          >
            <option value="CC">Cedula de ciudadania (CC)</option>
            <option value="CE">Cedula de extranjeria (CE)</option>
            <option value="NIT">NIT</option>
            <option value="PAS">Pasaporte</option>
          </select>
        </div>
        <InputField
          id="documentNumber"
          label="Numero de documento"
          type="text"
          placeholder="Ej: 1234567890"
          value={documentNumber}
          onChange={(event) =>
            setDocumentNumber(event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24))
          }
          required
        />
        <InputField
          id="phone"
          label="Telefono"
          type="tel"
          placeholder="3001234567"
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/[^0-9+]/g, "").slice(0, 20))}
          required
        />
        <InputField
          id="addressLine"
          label="Direccion de facturacion"
          type="text"
          placeholder="Calle 00 #00-00"
          value={addressLine}
          onChange={(event) => setAddressLine(event.target.value)}
          required
        />
        <InputField
          id="city"
          label="Ciudad"
          type="text"
          placeholder="Bogota"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          required
        />
        <div className="form-field">
          <label htmlFor="country">Pais</label>
          <select
            id="country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
          >
            {COUNTRY_OPTIONS.map((countryOption) => (
              <option key={countryOption.code} value={countryOption.code}>
                {countryOption.name}
              </option>
            ))}
          </select>
        </div>
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
          {isSubmitting ? "Creando..." : "Crear cuenta"}
        </Button>
      </form>
      <p className="muted small">
        Ya tienes cuenta? <Link href="/login">Inicia sesion</Link>.
      </p>
    </AuthLayout>
  );
}
