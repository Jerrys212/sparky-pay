import { z } from "@/lib/zod";
import { cardNumberSchema } from "@/lib/card";

export const MAX_AMOUNT = 999_999.99;
export const HOLDER_MAX_LENGTH = 40;
const MAX_CARD_YEARS = 20;

const isExpired = (month: number, year: number, now: Date) =>
  year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);

export const VentaSchema = z
  .object({
    importe: z
      .string()
      .trim()
      .min(1, "Ingresa el importe")
      .regex(/^\d+(\.\d{1,2})?$/, "Ingresa un importe válido, con máximo 2 decimales")
      .refine((value) => Number(value) > 0, "Ingresa un importe mayor a 0")
      .refine((value) => Number(value) <= MAX_AMOUNT, "El importe máximo por venta es $999,999.99"),
    nombreTitular: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, " "))
      .pipe(
        z
          .string()
          .min(1, "Ingresa el nombre del titular")
          .min(5, "El nombre debe tener al menos 5 caracteres")
          .max(HOLDER_MAX_LENGTH, `El nombre debe tener máximo ${HOLDER_MAX_LENGTH} caracteres`)
          .regex(/^[\p{L}' .-]+$/u, "El nombre solo puede contener letras y espacios")
          .refine((value) => value.split(" ").length >= 2, "Ingresa nombre y apellido como aparecen en la tarjeta"),
      ),
    numeroTarjeta: cardNumberSchema,
    fechaExpiracion: z
      .string()
      .min(1, "Ingresa la fecha de vencimiento")
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Usa el formato MM/AA")
      .refine((value) => {
        const [mm, yy] = value.split("/");
        return !isExpired(Number(mm), 2000 + Number(yy), new Date());
      }, "La tarjeta está vencida")
      .refine((value) => 2000 + Number(value.slice(3)) <= new Date().getFullYear() + MAX_CARD_YEARS, "Revisa el año de vencimiento"),
    cvv: z.string().min(1, "Ingresa el CVV").regex(/^\d{3}$/, "El CVV debe tener 3 dígitos"),
  });

export type VentaValues = z.infer<typeof VentaSchema>;
