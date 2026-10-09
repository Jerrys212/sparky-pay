import { z } from "@/lib/zod";

export const isAmex = (digits: string) => /^3[47]/.test(digits);

export const cardLength = (digits: string) => (isAmex(digits) ? 15 : 16);

export function passesLuhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export const cardNumberSchema = z
  .string()
  .transform((value) => value.replace(/\s/g, ""))
  .pipe(
    z
      .string()
      .min(1, "Ingresa el número de tarjeta")
      .regex(/^\d+$/, "El número de tarjeta solo debe contener dígitos")
      .refine((digits) => digits.length === cardLength(digits), {
        message: "El número de tarjeta debe tener 16 dígitos (15 para American Express)",
      })
      .refine(passesLuhn, "El número de tarjeta no es válido"),
  );
