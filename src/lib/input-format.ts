import { cardLength, isAmex } from "@/lib/card";

export const digitsOnly = (max: number) => (value: string) => value.replace(/\D/g, "").slice(0, max);

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const trimmed = digits.slice(0, cardLength(digits));
  const groups = isAmex(trimmed) ? [4, 6, 5] : [4, 4, 4, 4];
  const parts: string[] = [];
  let start = 0;
  for (const size of groups) {
    if (start >= trimmed.length) break;
    parts.push(trimmed.slice(start, start + size));
    start += size;
  }
  return parts.join(" ");
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function formatAmount(value: string): string {
  const clean = value.replace(/[^\d.]/g, "");
  const [integer = "", ...rest] = clean.split(".");
  const int = integer.replace(/^0+(?=\d)/, "").slice(0, 6);
  return rest.length ? `${int}.${rest.join("").slice(0, 2)}` : int;
}

export const formatHolderName = (value: string) => value.replace(/[^\p{L}' .-]/gu, "").replace(/\s{2,}/g, " ");
