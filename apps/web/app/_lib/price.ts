export function parsePriceToNumber(priceLabel: string): number {
  const digits = priceLabel.replace(/[^0-9]/g, "");
  if (!digits) {
    return 0;
  }
  return Number(digits);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(price);
}
