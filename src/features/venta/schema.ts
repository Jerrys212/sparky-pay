import { z } from "zod";

export const VentaSchema = z.object({
  importe: z
    .string()
    .min(1, "Ingresa el importe")
    .refine((value) => Number(value) > 0, "Ingresa un importe mayor a 0"),
  nombreTitular: z.string().trim().min(1, "Ingresa el nombre del titular"),
  numeroTarjeta: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{15,16}$/, "El número de tarjeta debe tener 15 o 16 dígitos")),
  fechaExpiracion: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Usa el formato MM/AA"),
  cvv: z.string().regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
});

export type VentaValues = z.infer<typeof VentaSchema>;
