const tomanFormatter = new Intl.NumberFormat("en-US");

/** Format a Toman amount, e.g. 5600000 -> "5,600,000 Toman". */
export function formatToman(amount: number): string {
  return `${tomanFormatter.format(amount)} Toman`;
}

/** Format an API datetime like "2026-10-22 17:28:28" for display. */
export function formatDate(value: string): string {
  // API datetimes are UTC without a zone suffix.
  const date = new Date(value.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
