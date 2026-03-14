import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string | null;
};

export default function InputField({ id, label, error, ...props }: InputFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} {...props} />
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
