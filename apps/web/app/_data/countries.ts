export type CountryOption = {
  code: string;
  name: string;
};

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "CO", name: "Colombia" },
  { code: "MX", name: "Mexico" },
  { code: "PE", name: "Peru" },
  { code: "CL", name: "Chile" },
  { code: "EC", name: "Ecuador" },
  { code: "AR", name: "Argentina" },
  { code: "PA", name: "Panama" },
  { code: "CR", name: "Costa Rica" },
  { code: "US", name: "Estados Unidos" },
  { code: "ES", name: "Espana" },
];

export function getCountryNameByCode(code?: string): string {
  if (!code) {
    return "No registrado";
  }

  const match = COUNTRY_OPTIONS.find((country) => country.code === code.toUpperCase());
  return match?.name ?? code;
}
