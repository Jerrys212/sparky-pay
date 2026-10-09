import { z } from "zod";

export const ReversalSchema = z.object({
  referenciaFinanciera: z.string().regex(/^\d{8}$/, "La referencia debe tener 8 dígitos"),
  numeroTarjeta: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{15,16}$/, "El número de tarjeta debe tener 15 o 16 dígitos")),
});

export type ReversalValues = z.infer<typeof ReversalSchema>;
